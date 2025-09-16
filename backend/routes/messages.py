from fastapi import APIRouter, HTTPException, status, Depends, Query
from motor.motor_asyncio import AsyncIOMotorClient
from models.message import Message, MessageCreate, MessageResponse
from models.user import UserResponse
from auth import get_current_user
from bson import ObjectId
from typing import List
from datetime import datetime

router = APIRouter(prefix="/scenes", tags=["messages"])


async def get_database():
    from server import db
    return db


async def check_scene_access(scene_id: str, user_id: str, db: AsyncIOMotorClient):
    """Check if user has access to the scene"""
    if not ObjectId.is_valid(scene_id):
        raise HTTPException(status_code=400, detail="Invalid scene ID")
    
    scene_doc = await db.scenes.find_one({"_id": ObjectId(scene_id)})
    if not scene_doc:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    # Check access
    user_obj_id = ObjectId(user_id)
    has_access = (
        scene_doc["owner"] == user_obj_id or
        scene_doc.get("is_public", False) or
        any(collab["user"] == user_obj_id and collab["status"] == "active" 
            for collab in scene_doc.get("collaborators", []))
    )
    
    if not has_access:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return scene_doc


@router.get("/{scene_id}/messages", response_model=List[MessageResponse])
async def get_scene_messages(
    scene_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database),
    limit: int = Query(50, description="Number of messages to retrieve"),
    skip: int = Query(0, description="Number of messages to skip")
):
    # Check scene access
    await check_scene_access(scene_id, current_user.id, db)
    
    # Get messages
    messages_cursor = db.messages.find(
        {"scene_id": ObjectId(scene_id)}
    ).sort("timestamp", -1).skip(skip).limit(limit)
    
    messages = []
    async for message_doc in messages_cursor:
        message = Message(**message_doc)
        
        # Get sender details
        sender_doc = await db.users.find_one({"_id": message.sender})
        sender_details = {
            "id": str(message.sender),
            "name": sender_doc["name"] if sender_doc else "Unknown User",
            "email": sender_doc.get("email", ""),
            "avatar": sender_doc.get("avatar")
        }
        
        messages.append(MessageResponse.from_message(message, sender_details))
    
    # Reverse to get chronological order
    messages.reverse()
    return messages


@router.post("/{scene_id}/messages", response_model=MessageResponse)
async def send_message(
    scene_id: str,
    message_data: MessageCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Check scene access
    await check_scene_access(scene_id, current_user.id, db)
    
    # Create message
    message = Message(
        scene_id=ObjectId(scene_id),
        sender=ObjectId(current_user.id),
        content=message_data.content,
        type=message_data.type
    )
    
    # Insert message
    message_dict = message.dict(by_alias=True)
    result = await db.messages.insert_one(message_dict)
    message.id = result.inserted_id
    
    # Prepare sender details
    sender_details = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "avatar": current_user.avatar
    }
    
    # TODO: Emit real-time message via WebSocket
    
    return MessageResponse.from_message(message, sender_details)