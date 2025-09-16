from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid


class Artwork(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    artist_id: str
    suite_id: str
    title: str
    description: Optional[str] = None
    type: str  # painting, music, writing, sculpture, photo
    file_url: str
    thumbnail_url: Optional[str] = None
    mime_type: str
    file_size: int
    metadata: Optional[dict] = None  # For storing type-specific data like duration, dimensions, etc.
    tags: List[str] = []
    likes: int = 0
    views: int = 0
    is_public: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        schema_extra = {
            "example": {
                "title": "Pacific Dreams",
                "description": "A painting inspired by the coastal forests",
                "type": "painting",
                "file_url": "/uploads/artwork_123.jpg",
                "mime_type": "image/jpeg",
                "file_size": 2048000,
                "tags": ["painting", "nature", "forest"],
                "is_public": True
            }
        }


class ArtworkCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str
    tags: List[str] = []
    is_public: bool = True

    class Config:
        schema_extra = {
            "example": {
                "title": "Forest Symphony",
                "description": "An ambient music piece inspired by nature",
                "type": "music",
                "tags": ["music", "ambient", "nature"],
                "is_public": True
            }
        }


class ArtworkUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None


class ArtworkResponse(BaseModel):
    id: str
    artist_id: str
    artist_name: str
    suite_id: str
    title: str
    description: Optional[str] = None
    type: str
    file_url: str
    thumbnail_url: Optional[str] = None
    mime_type: str
    file_size: int
    metadata: Optional[dict] = None
    tags: List[str] = []
    likes: int = 0
    views: int = 0
    is_public: bool = True
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_artwork(cls, artwork: Artwork, artist_name: str):
        return cls(
            artist_name=artist_name,
            **artwork.dict()
        )


class SuiteInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    suite_name: str
    room_number: str
    artist_id: str
    artist_name: str
    initials: str
    room_key: str
    door_color: str
    personal_color: str
    is_online: bool = False
    last_seen: str
    artwork_count: int = 0
    bio: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        schema_extra = {
            "example": {
                "suite_name": "Christopher's Creative Space",
                "room_number": "201",
                "artist_name": "Christopher Royal King",
                "initials": "CK",
                "room_key": "ROOM-201-CK",
                "door_color": "#FFD700",
                "personal_color": "#FFF8DC",
                "bio": "Painter exploring the connection between nature and emotion"
            }
        }