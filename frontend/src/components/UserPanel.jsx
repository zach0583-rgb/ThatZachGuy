import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  UserPlus, 
  Crown, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  MoreHorizontal,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { mockData } from '../utils/mockData';

const UserPanel = () => {
  const [collaborators, setCollaborators] = useState(mockData.collaborators);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return;
    
    setIsInviting(true);
    
    // Mock invite process
    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        avatar: '/api/placeholder/32/32',
        status: 'invited',
        isOwner: false,
        permissions: ['view', 'edit'],
        lastSeen: 'Invited',
        isOnline: false,
        micEnabled: true,
        videoEnabled: true
      };
      
      setCollaborators(prev => [...prev, newUser]);
      setInviteEmail('');
      setIsInviting(false);
    }, 1000);
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/join/${Date.now()}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleUserMic = (userId) => {
    setCollaborators(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, micEnabled: !user.micEnabled }
          : user
      )
    );
  };

  const toggleUserVideo = (userId) => {
    setCollaborators(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, videoEnabled: !user.videoEnabled }
          : user
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      case 'invited': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (user) => {
    if (!user.isOnline) return user.lastSeen;
    return user.status === 'online' ? 'Online' : 'Away';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Collaborators</CardTitle>
            <Badge variant="secondary">
              {collaborators.filter(u => u.isOnline).length} online
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Invite by Email */}
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInviteUser()}
              />
              <Button 
                size="sm" 
                onClick={handleInviteUser}
                disabled={isInviting || !inviteEmail.trim()}
              >
                {isInviting ? '...' : <UserPlus className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Invite Link */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleCopyInviteLink}
            >
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Invite Link
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Active Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-3 p-4">
              {/* Current User */}
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">You</span>
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <Badge variant="secondary" className="text-xs">Owner</Badge>
                  </div>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Mic className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Video className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </div>

              {/* Other Users */}
              {collaborators.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm truncate">{user.name}</span>
                      {user.isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
                      {user.status === 'invited' && (
                        <Badge variant="outline" className="text-xs">Invited</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{getStatusText(user)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => toggleUserMic(user.id)}
                      disabled={user.status === 'invited' || !user.isOnline}
                    >
                      {user.micEnabled ? (
                        <Mic className="h-4 w-4 text-green-600" />
                      ) : (
                        <MicOff className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => toggleUserVideo(user.id)}
                      disabled={user.status === 'invited' || !user.isOnline}
                    >
                      {user.videoEnabled ? (
                        <Video className="h-4 w-4 text-green-600" />
                      ) : (
                        <VideoOff className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Permissions Summary */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-center text-xs text-gray-500">
            <p>All users can edit and view this space</p>
            <p className="mt-1">Use audio/video for live collaboration</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPanel;