from pydantic import BaseModel, Field
from typing import Optional
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


class Media(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    scene_id: PyObjectId
    uploaded_by: PyObjectId
    filename: str
    original_name: str
    mime_type: str
    size: int
    type: str  # music, image
    url: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class MediaResponse(BaseModel):
    id: str
    scene_id: str
    uploaded_by: dict  # Will include uploader details
    filename: str
    original_name: str
    mime_type: str
    size: int
    type: str
    url: str
    uploaded_at: datetime

    @classmethod
    def from_media(cls, media: Media, uploader_details: dict):
        return cls(
            id=str(media.id),
            scene_id=str(media.scene_id),
            uploaded_by=uploader_details,
            filename=media.filename,
            original_name=media.original_name,
            mime_type=media.mime_type,
            size=media.size,
            type=media.type,
            url=media.url,
            uploaded_at=media.uploaded_at
        )