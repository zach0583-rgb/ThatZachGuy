import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Users, 
  MessageCircle, 
  Music, 
  Image, 
  Save, 
  Share2, 
  Settings,
  Volume2,
  Send,
  Plus,
  Move,
  Trash2,
  Palette
} from 'lucide-react';
import ObjectsLibrary from './ObjectsLibrary';
import SceneCanvas from './SceneCanvas';
import ChatPanel from './ChatPanel';
import MediaPanel from './MediaPanel';
import UserPanel from './UserPanel';

const VirtualMeetingPlace = () => {
  const [activeTab, setActiveTab] = useState('objects');
  const [selectedTool, setSelectedTool] = useState('move');
  const [sceneName, setSceneName] = useState('My Virtual Space');
  const [sceneObjects, setSceneObjects] = useState([]);
  const [sceneBackground, setSceneBackground] = useState('modern-office');
  const [isEditMode, setIsEditMode] = useState(true);
  const canvasRef = useRef(null);

  const handleAddObject = useCallback((objectType, position = { x: 100, y: 100 }) => {
    const newObject = {
      id: Date.now() + Math.random(),
      type: objectType,
      position,
      rotation: 0,
      scale: 1,
      zIndex: sceneObjects.length
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

  const handleSaveScene = () => {
    const sceneData = {
      name: sceneName,
      background: sceneBackground,
      objects: sceneObjects,
      timestamp: new Date().toISOString()
    };
    // Mock save - will be replaced with actual API call
    console.log('Saving scene:', sceneData);
    alert('Scene saved successfully!');
  };

  const handleShareScene = () => {
    // Mock share functionality
    const shareLink = `${window.location.origin}/scene/${Date.now()}`;
    navigator.clipboard.writeText(shareLink);
    alert(`Scene link copied to clipboard: ${shareLink}`);
  };

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
            <Input
              value={sceneName}
              onChange={(e) => setSceneName(e.target.value)}
              className="max-w-xs"
              placeholder="Scene name"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSaveScene}>
              <Save className="h-4 w-4 mr-2" />
              Save Scene
            </Button>
            <Button onClick={handleShareScene}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-80 border-r bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4 m-4">
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
              <TabsTrigger value="media" className="text-xs">
                <Music className="h-4 w-4 mr-1" />
                Media
              </TabsTrigger>
            </TabsList>

            <div className="px-4 pb-4 h-[calc(100%-60px)]">
              <TabsContent value="objects" className="h-full mt-0">
                <ObjectsLibrary onAddObject={handleAddObject} />
              </TabsContent>
              
              <TabsContent value="users" className="h-full mt-0">
                <UserPanel />
              </TabsContent>
              
              <TabsContent value="chat" className="h-full mt-0">
                <ChatPanel />
              </TabsContent>
              
              <TabsContent value="media" className="h-full mt-0">
                <MediaPanel />
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