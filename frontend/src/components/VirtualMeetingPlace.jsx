import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { sceneAPI, messagesAPI } from '../utils/api';
import { 
  Users, 
  MessageCircle, 
  Music, 
  Image, 
  Save, 
  Share2, 
  Settings,
  Send,
  Plus,
  Move,
  Trash2,
  LogOut
} from 'lucide-react';
import ObjectsLibrary from './ObjectsLibrary';
import SceneCanvas from './SceneCanvas';

const VirtualMeetingPlace = () => {
  const [activeTab, setActiveTab] = useState('objects');
  const [selectedTool, setSelectedTool] = useState('move');
  const [currentScene, setCurrentScene] = useState(null);
  const [sceneObjects, setSceneObjects] = useState([]);
  const [sceneBackground, setSceneBackground] = useState('modern-office');
  const [isEditMode, setIsEditMode] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Load or create initial scene
  useEffect(() => {
    const initializeScene = async () => {
      try {
        setLoading(true);
        
        // Try to get user's scenes
        const response = await sceneAPI.getScenes();
        const scenes = response.data;
        
        if (scenes.length > 0) {
          // Load the first scene
          const scene = scenes[0];
          setCurrentScene(scene);
          setSceneObjects(scene.objects || []);
          setSceneBackground(scene.background || 'modern-office');
          
          // Load messages for this scene
          loadMessages(scene.id);
        } else {
          // Create a new scene
          const newScene = await sceneAPI.createScene({
            name: `${user.name}'s Virtual Space`,
            description: 'My first virtual meeting space',
            background: 'modern-office',
            is_public: false
          });
          
          setCurrentScene(newScene.data);
          setSceneObjects([]);
          setSceneBackground('modern-office');
        }
      } catch (error) {
        console.error('Failed to initialize scene:', error);
        toast({
          title: "Error",
          description: "Failed to load your virtual space. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      initializeScene();
    }
  }, [user, toast]);

  const loadMessages = async (sceneId) => {
    try {
      const response = await messagesAPI.getMessages(sceneId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleAddObject = useCallback((objectType, position = { x: 100, y: 100 }) => {
    const newObject = {
      id: Date.now() + Math.random(),
      type: objectType,
      position,
      rotation: 0,
      scale: 1,
      z_index: sceneObjects.length
    };
    setSceneObjects(prev => [...prev, newObject]);
  }, [sceneObjects.length]);

  const handleObjectUpdate = useCallback((objectId, updates) => {
    setSceneObjects(prev => 
      prev.map(obj => obj.id === objectId ? { ...obj, ...updates } : obj)
    );
  }, []);

  const handleDeleteObject = useCallback((objectId) => {
    setSceneObjects(prev => prev.filter(obj => obj.id !== objectId));
  }, []);

  const handleSaveScene = async () => {
    if (!currentScene) return;
    
    try {
      await sceneAPI.updateScene(currentScene.id, {
        objects: sceneObjects,
        background: sceneBackground
      });
      
      toast({
        title: "Success",
        description: "Scene saved successfully!"
      });
    } catch (error) {
      console.error('Failed to save scene:', error);
      toast({
        title: "Error",
        description: "Failed to save scene. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShareScene = () => {
    if (!currentScene) return;
    
    const shareLink = `${window.location.origin}/scene/${currentScene.id}`;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Success",
      description: "Scene link copied to clipboard!"
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentScene) return;

    try {
      const response = await messagesAPI.sendMessage(currentScene.id, {
        content: newMessage,
        type: 'text'
      });
      
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading your virtual space...
          </h2>
        </div>
      </div>
    );
  }

  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'delete', icon: Trash2, label: 'Delete' },
    { id: 'rotate', icon: Settings, label: 'Rotate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Virtual Meeting Place
            </h1>
            <div className="text-sm text-gray-600">
              Welcome, {user?.name}!
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSaveScene} disabled={!currentScene}>
              <Save className="h-4 w-4 mr-2" />
              Save Scene
            </Button>
            <Button onClick={handleShareScene} disabled={!currentScene}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-80 border-r bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="objects" className="text-xs">
                <Plus className="h-4 w-4 mr-1" />
                Objects
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs">
                <Users className="h-4 w-4 mr-1" />
                Users
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4 h-[calc(100%-60px)]">
              <TabsContent value="objects" className="h-full mt-0">
                <ObjectsLibrary onAddObject={handleAddObject} />
              </TabsContent>
              
              <TabsContent value="users" className="h-full mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Collaborators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{user?.name}</span>
                            <Badge variant="secondary" className="text-xs">Owner</Badge>
                          </div>
                          <p className="text-xs text-gray-500">Online</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chat" className="h-full mt-0">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className="flex space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.sender?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-medium">
                                  {message.sender?.name || 'Unknown'}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="bg-gray-100 rounded-lg px-3 py-2">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="sm" onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b bg-white/70 backdrop-blur-sm dark:bg-slate-900/70">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tools:</span>
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <tool.icon className="h-4 w-4 mr-1" />
                  {tool.label}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={isEditMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? 'Edit Mode' : 'View Mode'}
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <SceneCanvas
              ref={canvasRef}
              objects={sceneObjects}
              background={sceneBackground}
              selectedTool={selectedTool}
              isEditMode={isEditMode}
              onObjectUpdate={handleObjectUpdate}
              onDeleteObject={handleDeleteObject}
              onBackgroundChange={setSceneBackground}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualMeetingPlace;