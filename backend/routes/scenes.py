from fastapi import APIRouter, HTTPException, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorClient
from models.scene import Scene, SceneCreate, SceneUpdate, SceneResponse, SceneInvite, Collaborator
from models.user import UserResponse
from auth import get_current_user
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/scenes", tags=["scenes"])


async def get_database():
    from server import db
    return db


@router.post("/", response_model=SceneResponse)
async def create_scene(
    scene_data: SceneCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Create new scene
    scene = Scene(
        name=scene_data.name,
        description=scene_data.description,
        background=scene_data.background,
        owner=ObjectId(current_user.id),
        is_public=scene_data.is_public
    )
    
    # Insert scene into database
    scene_dict = scene.dict(by_alias=True)
    result = await db.scenes.insert_one(scene_dict)
    scene.id = result.inserted_id
    
    return SceneResponse.from_scene(scene, current_user.name, [])


@router.get("/", response_model=List[SceneResponse])
async def get_user_scenes(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database),
    include_shared: bool = Query(True, description="Include scenes shared with user")
):
    # Get scenes owned by user
    query = {"owner": ObjectId(current_user.id)}
    scenes_cursor = db.scenes.find(query)
    scenes = []
    
    async for scene_doc in scenes_cursor:
        scene = Scene(**scene_doc)
        # Get owner details
        owner_doc = await db.users.find_one({"_id": scene.owner})
        owner_name = owner_doc["name"] if owner_doc else "Unknown"
        
        # Get collaborator details
        collaborator_details = []
        for collab in scene.collaborators:
            user_doc = await db.users.find_one({"_id": collab.user})
            if user_doc:
                collaborator_details.append({
                    "user": {
                        "id": str(collab.user),
                        "name": user_doc["name"],
                        "email": user_doc["email"],
                        "avatar": user_doc.get("avatar"),
                        "is_online": user_doc.get("is_online", False)
                    },
                    "permissions": collab.permissions,
                    "status": collab.status,
                    "invited_at": collab.invited_at
                })
        
        scenes.append(SceneResponse.from_scene(scene, owner_name, collaborator_details))
    
    # Also get scenes where user is a collaborator
    if include_shared:
        shared_scenes_cursor = db.scenes.find({
            "collaborators.user": ObjectId(current_user.id),
            "collaborators.status": "active"
        })
        
        async for scene_doc in shared_scenes_cursor:
            scene = Scene(**scene_doc)
            owner_doc = await db.users.find_one({"_id": scene.owner})
            owner_name = owner_doc["name"] if owner_doc else "Unknown"
            
            collaborator_details = []
            for collab in scene.collaborators:
                user_doc = await db.users.find_one({"_id": collab.user})
                if user_doc:
                    collaborator_details.append({
                        "user": {
                            "id": str(collab.user),
                            "name": user_doc["name"],
                            "email": user_doc["email"],
                            "avatar": user_doc.get("avatar"),
                            "is_online": user_doc.get("is_online", False)
                        },
                        "permissions": collab.permissions,
                        "status": collab.status,
                        "invited_at": collab.invited_at
                    })
            
            scenes.append(SceneResponse.from_scene(scene, owner_name, collaborator_details))
    
    return scenes


@router.get("/{scene_id}", response_model=SceneResponse)
async def get_scene(
    scene_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    if not ObjectId.is_valid(scene_id):
        raise HTTPException(status_code=400, detail="Invalid scene ID")
    
    scene_doc = await db.scenes.find_one({"_id": ObjectId(scene_id)})
    if not scene_doc:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    scene = Scene(**scene_doc)
    
    # Check if user has access
    user_id = ObjectId(current_user.id)
    has_access = (
        scene.owner == user_id or
        scene.is_public or
        any(collab.user == user_id and collab.status == "active" for collab in scene.collaborators)
    )
    
    if not has_access:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get owner details
    owner_doc = await db.users.find_one({"_id": scene.owner})
    owner_name = owner_doc["name"] if owner_doc else "Unknown"
    
    # Get collaborator details
    collaborator_details = []
    for collab in scene.collaborators:
        user_doc = await db.users.find_one({"_id": collab.user})
        if user_doc:
            collaborator_details.append({
                "user": {
                    "id": str(collab.user),
                    "name": user_doc["name"],
                    "email": user_doc["email"],
                    "avatar": user_doc.get("avatar"),
                    "is_online": user_doc.get("is_online", False)
                },
                "permissions": collab.permissions,
                "status": collab.status,
                "invited_at": collab.invited_at
            })
    
    return SceneResponse.from_scene(scene, owner_name, collaborator_details)


@router.put("/{scene_id}", response_model=SceneResponse)
async def update_scene(
    scene_id: str,
    scene_update: SceneUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    if not ObjectId.is_valid(scene_id):
        raise HTTPException(status_code=400, detail="Invalid scene ID")
    
    scene_doc = await db.scenes.find_one({"_id": ObjectId(scene_id)})
    if not scene_doc:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    scene = Scene(**scene_doc)
    
    # Check if user has edit permissions
    user_id = ObjectId(current_user.id)
    has_edit_access = (
        scene.owner == user_id or
        any(collab.user == user_id and "edit" in collab.permissions and collab.status == "active" 
            for collab in scene.collaborators)
    )
    
    if not has_edit_access:
        raise HTTPException(status_code=403, detail="Edit access denied")
    
    # Update scene
    update_data = {k: v for k, v in scene_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.scenes.update_one(
        {"_id": ObjectId(scene_id)},
        {"$set": update_data}
    )
    
    # Return updated scene
    updated_scene_doc = await db.scenes.find_one({"_id": ObjectId(scene_id)})
    updated_scene = Scene(**updated_scene_doc)
    
    # Get owner details
    owner_doc = await db.users.find_one({"_id": updated_scene.owner})
    owner_name = owner_doc["name"] if owner_doc else "Unknown"
    
    return SceneResponse.from_scene(updated_scene, owner_name, [])


@router.delete("/{scene_id}")
async def delete_scene(
    scene_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    if not ObjectId.is_valid(scene_id):
        raise HTTPException(status_code=400, detail="Invalid scene ID")
    
    scene_doc = await db.scenes.find_one({"_id": ObjectId(scene_id)})
    if not scene_doc:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    scene = Scene(**scene_doc)
    
    # Only owner can delete
    if scene.owner != ObjectId(current_user.id):
        raise HTTPException(status_code=403, detail="Only owner can delete scene")
    
    # Delete scene
    await db.scenes.delete_one({"_id": ObjectId(scene_id)})
    
    # Also delete related messages and media
    await db.messages.delete_many({"scene_id": ObjectId(scene_id)})
    await db.media.delete_many({"scene_id": ObjectId(scene_id)})
    
    return {"message": "Scene deleted successfully"}


@router.post("/{scene_id}/invite")
async def invite_user_to_scene(
    scene_id: str,
    invite_data: SceneInvite,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    if not ObjectId.is_valid(scene_id):
        raise HTTPException(status_code=400, detail="Invalid scene ID")
    
    scene_doc = await db.scenes.find_one({"_id": ObjectId(scene_id)})
    if not scene_doc:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    scene = Scene(**scene_doc)
    
    # Only owner or admins can invite
    user_id = ObjectId(current_user.id)
    can_invite = (
        scene.owner == user_id or
        any(collab.user == user_id and "admin" in collab.permissions and collab.status == "active" 
            for collab in scene.collaborators)
    )
    
    if not can_invite:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Find user to invite
    invitee_doc = await db.users.find_one({"email": invite_data.email})
    if not invitee_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    invitee_id = invitee_doc["_id"]
    
    # Check if already a collaborator
    existing_collab = any(collab.user == invitee_id for collab in scene.collaborators)
    if existing_collab:
        raise HTTPException(status_code=400, detail="User is already a collaborator")
    
    # Add collaborator
    new_collaborator = Collaborator(
        user=invitee_id,
        permissions=invite_data.permissions,
        status="invited"
    )
    
    await db.scenes.update_one(
        {"_id": ObjectId(scene_id)},
        {"$push": {"collaborators": new_collaborator.dict(by_alias=True)}}
    )
    
    return {"message": f"User {invite_data.email} invited successfully"}