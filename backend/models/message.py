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


class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    scene_id: PyObjectId
    sender: PyObjectId
    content: str
    type: str = "text"  # text, system, media
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class MessageCreate(BaseModel):
    content: str
    type: str = "text"

    class Config:
        schema_extra = {
            "example": {
                "content": "Hello everyone! 👋",
                "type": "text"
            }
        }


class MessageResponse(BaseModel):
    id: str
    scene_id: str
    sender: dict  # Will include sender details
    content: str
    type: str
    timestamp: datetime

    @classmethod
    def from_message(cls, message: Message, sender_details: dict):
        return cls(
            id=str(message.id),
            scene_id=str(message.scene_id),
            sender=sender_details,
            content=message.content,
            type=message.type,
            timestamp=message.timestamp
        )