# Virtual Meeting Place - Backend Integration Contracts

## Overview
Converting the frontend mock implementation to a full-stack application with persistent data, real-time features, and user management.

## API Contracts

### 1. Scene Management
```
POST   /api/scenes                    - Create new scene
GET    /api/scenes                    - Get user's scenes
GET    /api/scenes/:id                - Get specific scene
PUT    /api/scenes/:id                - Update scene
DELETE /api/scenes/:id                - Delete scene
POST   /api/scenes/:id/share          - Share scene with users
```

### 2. User & Collaboration Management
```
POST   /api/auth/register             - User registration
POST   /api/auth/login                - User login
GET    /api/users/profile             - Get user profile
POST   /api/scenes/:id/invite         - Invite users to scene
GET    /api/scenes/:id/collaborators  - Get scene collaborators
PUT    /api/scenes/:id/collaborators/:userId - Update user permissions
```

### 3. Chat System
```
GET    /api/scenes/:id/messages       - Get chat messages
POST   /api/scenes/:id/messages       - Send new message
WebSocket /api/ws/scenes/:id          - Real-time chat & updates
```

### 4. Media Sharing
```
POST   /api/scenes/:id/media          - Upload media (music/images)
GET    /api/scenes/:id/media          - Get scene media
DELETE /api/scenes/:id/media/:mediaId - Delete media
```

## Data Models

### Scene Schema
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  background: String,
  objects: [{
    id: String,
    type: String,
    position: { x: Number, y: Number },
    rotation: Number,
    scale: Number,
    zIndex: Number
  }],
  owner: ObjectId (ref: User),
  collaborators: [{
    user: ObjectId (ref: User),
    permissions: [String],
    invitedAt: Date,
    status: String // 'invited', 'active'
  }],
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  avatar: String,
  createdAt: Date,
  lastSeen: Date,
  isOnline: Boolean
}
```

### Message Schema
```javascript
{
  _id: ObjectId,
  sceneId: ObjectId (ref: Scene),
  sender: ObjectId (ref: User),
  content: String,
  type: String, // 'text', 'system'
  timestamp: Date
}
```

### Media Schema
```javascript
{
  _id: ObjectId,
  sceneId: ObjectId (ref: Scene),
  uploadedBy: ObjectId (ref: User),
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  type: String, // 'music', 'image'
  url: String,
  uploadedAt: Date
}
```

## Mock Data Replacement Plan

### Frontend Mock Data to Replace:
1. **mockData.collaborators** → Real user data from `/api/scenes/:id/collaborators`
2. **mockData.chatMessages** → Real messages from `/api/scenes/:id/messages`
3. **mockData.musicTracks** → Real media from `/api/scenes/:id/media?type=music`
4. **mockData.sharedImages** → Real media from `/api/scenes/:id/media?type=image`
5. **Scene objects state** → Persistent scene data from `/api/scenes/:id`
6. **User authentication** → JWT-based auth system

### Frontend Integration Changes:
1. Replace mock functions in `VirtualMeetingPlace.jsx` with API calls
2. Add authentication context and login/register components
3. Implement WebSocket connection for real-time updates
4. Add file upload functionality for media sharing
5. Replace localStorage scene saving with API persistence

## Real-time Features Implementation
- WebSocket connection for live collaboration
- Real-time object movement synchronization
- Live chat updates
- User presence indicators
- Collaborative editing conflict resolution

## Authentication Flow
1. User registration/login → JWT token
2. Token stored in localStorage/httpOnly cookie
3. Protected routes require valid token
4. Scene access based on ownership/collaboration permissions

## File Upload Strategy
- Use multer for handling file uploads
- Store files in `/uploads` directory
- Generate unique filenames to prevent conflicts
- Validate file types and sizes
- Return accessible URLs for frontend consumption

## WebSocket Events
```javascript
// Client to Server
'join-scene': { sceneId, userId }
'leave-scene': { sceneId, userId }
'object-update': { sceneId, object }
'chat-message': { sceneId, message }
'user-status': { sceneId, status }

// Server to Client
'scene-updated': { sceneId, objects }
'new-message': { message }
'user-joined': { user }
'user-left': { userId }
'collaboration-update': { type, data }
```

## Backend Implementation Priority:
1. User authentication system
2. Scene CRUD operations
3. Basic chat functionality
4. Real-time WebSocket integration
5. Media upload system
6. Advanced collaboration features