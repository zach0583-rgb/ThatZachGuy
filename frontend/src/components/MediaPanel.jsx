import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Upload,
  Image as ImageIcon,
  Music,
  Share2,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { mockData } from '../utils/mockData';

const MediaPanel = () => {
  const [currentTrack, setCurrentTrack] = useState(mockData.musicTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [sharedImages, setSharedImages] = useState(mockData.sharedImages);
  const [musicTracks, setMusicTracks] = useState(mockData.musicTracks);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackChange = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleImageUpload = () => {
    // Mock image upload
    const newImage = {
      id: Date.now(),
      title: `New Image ${sharedImages.length + 1}`,
      url: '/api/placeholder/300/200',
      sharedBy: 'You',
      timestamp: 'Just now',
      likes: 0
    };
    setSharedImages(prev => [newImage, ...prev]);
  };

  const handleMusicUpload = () => {
    // Mock music upload
    const newTrack = {
      id: Date.now(),
      title: `New Track ${musicTracks.length + 1}`,
      artist: 'You',
      duration: '3:45',
      sharedBy: 'You'
    };
    setMusicTracks(prev => [newTrack, ...prev]);
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="music" className="h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="music">
            <Music className="h-4 w-4 mr-1" />
            Music
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4 mr-1" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music" className="h-[calc(100%-40px)] mt-4">
          <div className="h-full flex flex-col space-y-4">
            {/* Current Track Player */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="font-medium">{currentTrack.title}</h4>
                    <p className="text-sm text-gray-500">{currentTrack.artist}</p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Button size="sm" variant="outline">
                      <SkipForward className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button size="sm" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={toggleMute}>
                      {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 w-8">{isMuted ? 0 : volume}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Button */}
            <Button onClick={handleMusicUpload} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Share Music
            </Button>

            {/* Music Library */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Shared Music</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-64">
                  <div className="space-y-2 p-4">
                    {musicTracks.map((track) => (
                      <div
                        key={track.id}
                        className={`p-3 rounded cursor-pointer transition-colors hover:bg-gray-50 ${
                          currentTrack.id === track.id ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                        onClick={() => handleTrackChange(track)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm truncate">{track.title}</h5>
                            <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-xs text-gray-400">{track.duration}</span>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Shared by {track.sharedBy}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="h-[calc(100%-40px)] mt-4">
          <div className="h-full flex flex-col space-y-4">
            {/* Upload Button */}
            <Button onClick={handleImageUpload} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Share Image
            </Button>

            {/* Image Gallery */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Shared Images</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  <div className="grid grid-cols-1 gap-4 p-4">
                    {sharedImages.map((image) => (
                      <Card key={image.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h5 className="font-medium text-sm mb-1">{image.title}</h5>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>By {image.sharedBy}</span>
                            <span>{image.timestamp}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Heart className="h-3 w-3" />
                              </Button>
                              <span className="text-xs">{image.likes}</span>
                            </div>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaPanel;