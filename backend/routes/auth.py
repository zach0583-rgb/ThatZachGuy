from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from models.user import User, UserCreate, UserLogin, UserResponse, UserUpdate
from auth import create_access_token, get_current_user
from datetime import timedelta
import os
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()


async def get_database():
    from server import db
    return db


@router.post("/register", response_model=dict)
async def register_user(
    user_data: UserCreate,
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = User.hash_password(user_data.password)
    user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        is_online=True
    )
    
    # Insert user into database
    user_dict = user.dict(by_alias=True)
    result = await db.users.insert_one(user_dict)
    user.id = result.inserted_id
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=30 * 24 * 60)  # 30 days
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_user(user).dict()
    }


@router.post("/login", response_model=dict)
async def login_user(
    user_credentials: UserLogin,
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Find user by email
    user_doc = await db.users.find_one({"email": user_credentials.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = User(**user_doc)
    
    # Verify password
    if not user.verify_password(user_credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Update user online status
    await db.users.update_one(
        {"_id": user.id},
        {"$set": {"is_online": True, "last_seen": user.last_seen}}
    )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=30 * 24 * 60)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_user(user).dict()
    }


@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: UserResponse = Depends(get_current_user)
):
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(current_user.id)},
            {"$set": update_data}
        )
    
    # Return updated user
    updated_user_doc = await db.users.find_one({"_id": ObjectId(current_user.id)})
    updated_user = User(**updated_user_doc)
    return UserResponse.from_user(updated_user)


@router.post("/logout")
async def logout_user(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorClient = Depends(get_database)
):
    # Update user offline status
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"is_online": False}}
    )
    
    return {"message": "Successfully logged out"}