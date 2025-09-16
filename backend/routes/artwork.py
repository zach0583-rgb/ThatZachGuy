from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
import os
import uuid
import aiofiles
from datetime import datetime
import json

from ..models.artwork import Artwork, ArtworkCreate, ArtworkUpdate, ArtworkResponse, SuiteInfo
from ..models.user import User
from ..auth import verify_token
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()
security = HTTPBearer()

# Get database connection
def get_database():
    client = AsyncIOMotorClient(os.environ.get("MONGO_URL"))
    return client[os.environ.get("DB_NAME", "virtual_meeting")]


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token = credentials.credentials
    user_data = verify_token(token)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    db = get_database()
    user = await db.users.find_one({"email": user_data["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user)


# Predefined suite information for the artist friends
ARTIST_SUITES = {
    "suite-1": {
        "id": "suite-1",
        "suite_name": "Christopher's Creative Space",
        "room_number": "201",
        "artist_name": "Christopher Royal King",
        "initials": "CK",
        "room_key": "ROOM-201-CK",
        "door_color": "#FFD700",
        "personal_color": "#FFF8DC",
        "bio": "Painter exploring the connection between nature and emotion"
    },
    "suite-2": {
        "id": "suite-2",
        "suite_name": "Philip's Music Lab",
        "room_number": "202",
        "artist_name": "Philip Nanos",
        "initials": "PN",
        "room_key": "ROOM-202-PN",
        "door_color": "#4169E1",
        "personal_color": "#87CEEB",
        "bio": "Composer crafting ambient soundscapes"
    },
    "suite-3": {
        "id": "suite-3",
        "suite_name": "Jeremy's Digital Studio",
        "room_number": "203",
        "artist_name": "Jeremy Galindo",
        "initials": "JG",
        "room_key": "ROOM-203-JG",
        "door_color": "#FF4500",
        "personal_color": "#FFA07A",
        "bio": "Digital artist pushing creative boundaries"
    },
    "suite-4": {
        "id": "suite-4",
        "suite_name": "Joshua's Writing Den",
        "room_number": "204",
        "artist_name": "Joshua Brock",
        "initials": "JB",
        "room_key": "ROOM-204-JB",
        "door_color": "#32CD32",
        "personal_color": "#98FB98",
        "bio": "Writer weaving stories from dreams"
    },
    "suite-5": {
        "id": "suite-5",
        "suite_name": "Chris's Photography Studio",
        "room_number": "205",
        "artist_name": "Chris Andrews",
        "initials": "CA",
        "room_key": "ROOM-205-CA",
        "door_color": "#9370DB",
        "personal_color": "#DDA0DD",
        "bio": "Photographer capturing fleeting moments"
    },
    "suite-6": {
        "id": "suite-6",
        "suite_name": "Eric's Sculpture Workshop",
        "room_number": "206",
        "artist_name": "Eric Kriefels",
        "initials": "EK",
        "room_key": "ROOM-206-EK",
        "door_color": "#FF1493",
        "personal_color": "#FFB6C1",
        "bio": "Sculptor shaping reality from imagination"
    }
}


@router.get("/suites", response_model=List[SuiteInfo])
async def get_all_suites():
    """Get all artist suite information"""
    suites = []
    db = get_database()
    
    for suite_id, suite_data in ARTIST_SUITES.items():
        # Get artwork count for this suite
        artwork_count = await db.artworks.count_documents({"suite_id": suite_id})
        
        suite_info = SuiteInfo(
            **suite_data,
            artwork_count=artwork_count,
            is_online=False,  # TODO: Implement real online status
            last_seen="Unknown"
        )
        suites.append(suite_info)
    
    return suites


@router.get("/suites/{suite_id}", response_model=SuiteInfo)
async def get_suite_info(suite_id: str):
    """Get specific suite information"""
    if suite_id not in ARTIST_SUITES:
        raise HTTPException(status_code=404, detail="Suite not found")
    
    db = get_database()
    artwork_count = await db.artworks.count_documents({"suite_id": suite_id})
    
    suite_data = ARTIST_SUITES[suite_id]
    return SuiteInfo(
        **suite_data,
        artwork_count=artwork_count,
        is_online=False,
        last_seen="Unknown"
    )


@router.get("/suites/{suite_id}/artworks", response_model=List[ArtworkResponse])
async def get_suite_artworks(suite_id: str, current_user: User = Depends(get_current_user)):
    """Get all artworks for a specific suite"""
    if suite_id not in ARTIST_SUITES:
        raise HTTPException(status_code=404, detail="Suite not found")
    
    db = get_database()
    artworks = await db.artworks.find({"suite_id": suite_id}).to_list(length=None)
    
    response_artworks = []
    for artwork_doc in artworks:
        artwork = Artwork(**artwork_doc)
        suite_info = ARTIST_SUITES[suite_id]
        response_artworks.append(
            ArtworkResponse.from_artwork(artwork, suite_info["artist_name"])
        )
    
    return response_artworks


@router.post("/suites/{suite_id}/artworks", response_model=ArtworkResponse)
async def upload_artwork(
    suite_id: str,
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    artwork_type: str = Form(...),
    tags: str = Form("[]"),  # JSON string of tags
    is_public: bool = Form(True),
    current_user: User = Depends(get_current_user)
):
    """Upload artwork to a specific suite"""
    if suite_id not in ARTIST_SUITES:
        raise HTTPException(status_code=404, detail="Suite not found")
    
    # Parse tags
    try:
        tag_list = json.loads(tags)
    except:
        tag_list = []
    
    # Validate file type
    allowed_types = {
        'painting': ['image/jpeg', 'image/png', 'image/webp'],
        'music': ['audio/mpeg', 'audio/wav', 'audio/ogg'],
        'writing': ['text/plain', 'application/pdf'],
        'sculpture': ['model/gltf+json', 'model/obj', 'image/jpeg', 'image/png'],
        'photo': ['image/jpeg', 'image/png', 'image/webp']
    }
    
    if artwork_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid artwork type")
    
    if file.content_type not in allowed_types[artwork_type]:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type for {artwork_type}. Allowed: {allowed_types[artwork_type]}"
        )
    
    # Create upload directory
    upload_dir = "/app/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Create artwork record
    artwork = Artwork(
        artist_id=str(current_user.id),
        suite_id=suite_id,
        title=title,
        description=description,
        type=artwork_type,
        file_url=f"/uploads/{unique_filename}",
        mime_type=file.content_type,
        file_size=len(content),
        tags=tag_list,
        is_public=is_public
    )
    
    # Save to database
    db = get_database()
    await db.artworks.insert_one(artwork.dict())
    
    # Return response
    suite_info = ARTIST_SUITES[suite_id]
    return ArtworkResponse.from_artwork(artwork, suite_info["artist_name"])


@router.get("/artworks/{artwork_id}", response_model=ArtworkResponse)
async def get_artwork(artwork_id: str):
    """Get specific artwork by ID"""
    db = get_database()
    artwork_doc = await db.artworks.find_one({"id": artwork_id})
    
    if not artwork_doc:
        raise HTTPException(status_code=404, detail="Artwork not found")
    
    artwork = Artwork(**artwork_doc)
    
    # Get artist name from suite info
    suite_info = ARTIST_SUITES.get(artwork.suite_id, {})
    artist_name = suite_info.get("artist_name", "Unknown Artist")
    
    # Increment views
    await db.artworks.update_one(
        {"id": artwork_id},
        {"$inc": {"views": 1}}
    )
    
    return ArtworkResponse.from_artwork(artwork, artist_name)


@router.put("/artworks/{artwork_id}", response_model=ArtworkResponse)
async def update_artwork(
    artwork_id: str,
    artwork_update: ArtworkUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update artwork details"""
    db = get_database()
    artwork_doc = await db.artworks.find_one({"id": artwork_id})
    
    if not artwork_doc:
        raise HTTPException(status_code=404, detail="Artwork not found")
    
    artwork = Artwork(**artwork_doc)
    
    # Check if user owns this artwork
    if artwork.artist_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this artwork")
    
    # Update fields
    update_data = artwork_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.artworks.update_one(
        {"id": artwork_id},
        {"$set": update_data}
    )
    
    # Get updated artwork
    updated_doc = await db.artworks.find_one({"id": artwork_id})
    updated_artwork = Artwork(**updated_doc)
    
    suite_info = ARTIST_SUITES.get(artwork.suite_id, {})
    artist_name = suite_info.get("artist_name", "Unknown Artist")
    
    return ArtworkResponse.from_artwork(updated_artwork, artist_name)


@router.delete("/artworks/{artwork_id}")
async def delete_artwork(
    artwork_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete artwork"""
    db = get_database()
    artwork_doc = await db.artworks.find_one({"id": artwork_id})
    
    if not artwork_doc:
        raise HTTPException(status_code=404, detail="Artwork not found")
    
    artwork = Artwork(**artwork_doc)
    
    # Check if user owns this artwork
    if artwork.artist_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this artwork")
    
    # Delete file
    file_path = f"/app{artwork.file_url}"
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Delete from database
    await db.artworks.delete_one({"id": artwork_id})
    
    return {"message": "Artwork deleted successfully"}


@router.post("/artworks/{artwork_id}/like")
async def like_artwork(artwork_id: str, current_user: User = Depends(get_current_user)):
    """Like an artwork"""
    db = get_database()
    
    # Check if artwork exists
    artwork_doc = await db.artworks.find_one({"id": artwork_id})
    if not artwork_doc:
        raise HTTPException(status_code=404, detail="Artwork not found")
    
    # Increment likes
    await db.artworks.update_one(
        {"id": artwork_id},
        {"$inc": {"likes": 1}}
    )
    
    return {"message": "Artwork liked successfully"}


@router.get("/public-gallery", response_model=List[ArtworkResponse])
async def get_public_gallery():
    """Get all public artworks across all suites"""
    db = get_database()
    artworks = await db.artworks.find({"is_public": True}).to_list(length=None)
    
    response_artworks = []
    for artwork_doc in artworks:
        artwork = Artwork(**artwork_doc)
        suite_info = ARTIST_SUITES.get(artwork.suite_id, {})
        artist_name = suite_info.get("artist_name", "Unknown Artist")
        response_artworks.append(
            ArtworkResponse.from_artwork(artwork, artist_name)
        )
    
    return response_artworks