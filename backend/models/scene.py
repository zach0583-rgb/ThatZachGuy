from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema: dict, handler) -> dict:
        field_schema.update(type="string")
        return field_schema


class SceneObject(BaseModel):
    id: str
    type: str
    position: Dict[str, float]  # {"x": 100, "y": 200}
    rotation: float = 0
    scale: float = 1
    z_index: int = 0

    class Config:
        schema_extra = {
            "example": {
                "id": "obj_123",
                "type": "desk",
                "position": {"x": 150, "y": 200},
                "rotation": 0,
                "scale": 1,
                "z_index": 1
            }
        }


class Collaborator(BaseModel):
    user: PyObjectId
    permissions: List[str] = ["view", "edit"]  # view, edit, admin
    invited_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "invited"  # invited, active, removed

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Scene(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: Optional[str] = ""
    background: str = "modern-office"
    objects: List[SceneObject] = []
    owner: PyObjectId
    collaborators: List[Collaborator] = []
    is_public: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Team Meeting Room",
                "description": "Our main collaboration space",
                "background": "modern-office",
                "objects": [],
                "is_public": False
            }
        }


class SceneCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    background: str = "modern-office"
    is_public: bool = False

    class Config:
        schema_extra = {
            "example": {
                "name": "My Virtual Office",
                "description": "A cozy workspace for team meetings",
                "background": "modern-office",
                "is_public": False
            }
        }


class SceneUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    background: Optional[str] = None
    objects: Optional[List[SceneObject]] = None
    is_public: Optional[bool] = None


class SceneResponse(BaseModel):
    id: str
    name: str
    description: str
    background: str
    objects: List[SceneObject]
    owner: str
    collaborators: List[Dict[str, Any]]
    is_public: bool
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_scene(cls, scene: Scene, owner_name: str = None, collaborator_details: List[Dict] = None):
        return cls(
            id=str(scene.id),
            name=scene.name,
            description=scene.description or "",
            background=scene.background,
            objects=scene.objects,
            owner=str(scene.owner),
            collaborators=collaborator_details or [],
            is_public=scene.is_public,
            created_at=scene.created_at,
            updated_at=scene.updated_at
        )


class SceneInvite(BaseModel):
    email: str
    permissions: List[str] = ["view", "edit"]

    class Config:
        schema_extra = {
            "example": {
                "email": "colleague@example.com",
                "permissions": ["view", "edit"]
            }
        }