import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { 
  Settings, 
  Edit3, 
  Sun, 
  Moon, 
  Cloud, 
  Plus,
  Home,
  Camera,
  Share2,
  Palette
} from 'lucide-react';

const MobileUI = ({
  isCustomizing,
  setIsCustomizing,
  forestDensity,
  setForestDensity,
  lightingMood,
  setLightingMood,
  weatherEffect,
  setWeatherEffect,
  onAddObject,
  isMobile
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showObjectMenu, setShowObjectMenu] = useState(false);

  const lightingOptions = [
    { id: 'morning', icon: Sun, label: 'Morning', color: '#ffd89b' },
    { id: 'evening', icon: Sun, label: 'Evening', color: '#e8dcc0' },
    { id: 'night', icon: Moon, label: 'Night', color: '#4a5568' },
    { id: 'mystical', icon: Cloud, label: 'Mystical', color: '#6a5acd' }
  ];

  const objectTypes = [
    { id: 'campfire', label: '🔥 Campfire', description: 'Cozy fire pit' },
    { id: 'boulder', label: '🪨 Boulder', description: 'Natural stone' },
    { id: 'bench', label: '🪑 Bench', description: 'Wooden seat' }
  ];

  const handleAddObject = (objectType) => {
    // Add object in front of camera
    const position = [
      Math.random() * 4 - 2, // Random x position
      0,
      Math.random() * 4 - 2  // Random z position
    ];
    onAddObject(objectType, position);
    setShowObjectMenu(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My 3D Virtual World',
          text: 'Check out my customized Pacific Northwest virtual space!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      {/* Mobile-Optimized Control Bar */}
      <div className={`absolute ${isMobile ? 'bottom-4' : 'top-4'} left-4 right-4 z-50`}>
        <Card className="bg-black/70 backdrop-blur-sm text-white border-gray-600">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={isCustomizing ? 'default' : 'outline'}
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="text-white border-gray-500"
                >
                  <Edit3 className="h-4 w-4" />
                  {!isMobile && <span className="ml-1">Customize</span>}
                </Button>
                
                {isCustomizing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowObjectMenu(!showObjectMenu)}
                    className="text-white border-gray-500"
                  >
                    <Plus className="h-4 w-4" />
                    {!isMobile && <span className="ml-1">Add</span>}
                  </Button>
                )}
              </div>

              {/* Center Title */}
              <div className="text-center flex-1 mx-4">
                <h3 className="font-bold text-sm">🌲 Twin Peaks Lodge</h3>
                {isCustomizing && (
                  <p className="text-xs text-gray-300">Customization Mode</p>
                )}
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white border-gray-500"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleShare}
                  className="text-white border-gray-500"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Virtual Joystick Area Indicator (Mobile Only) */}
      {isMobile && !isCustomizing && (
        <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-white text-xs text-center">
            <div>🕹️</div>
            <div>Move</div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Card className="absolute top-20 right-4 w-80 bg-black/80 backdrop-blur-sm text-white border-gray-600 z-50">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-bold flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Atmosphere Settings
            </h4>
            
            {/* Lighting Mood */}
            <div>
              <label className="text-sm font-medium mb-2 block">Lighting Mood</label>
              <div className="grid grid-cols-2 gap-2">
                {lightingOptions.map((option) => (
                  <Button
                    key={option.id}
                    size="sm"
                    variant={lightingMood === option.id ? 'default' : 'outline'}
                    onClick={() => setLightingMood(option.id)}
                    className="justify-start text-white border-gray-500"
                  >
                    <option.icon className="h-4 w-4 mr-1" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Forest Density */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Forest Density: {Math.round(forestDensity * 100)}%
              </label>
              <Slider
                value={[forestDensity]}
                onValueChange={(value) => setForestDensity(value[0])}
                min={0.2}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Weather Effects */}
            <div>
              <label className="text-sm font-medium mb-2 block">Weather</label>
              <div className="flex space-x-2">
                {['clear', 'misty', 'stormy'].map((weather) => (
                  <Button
                    key={weather}
                    size="sm"
                    variant={weatherEffect === weather ? 'default' : 'outline'}
                    onClick={() => setWeatherEffect(weather)}
                    className="text-white border-gray-500 capitalize"
                  >
                    {weather}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Object Addition Menu */}
      {showObjectMenu && isCustomizing && (
        <Card className="absolute top-20 left-4 w-72 bg-black/80 backdrop-blur-sm text-white border-gray-600 z-50">
          <CardContent className="p-4">
            <h4 className="font-bold mb-3 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Objects
            </h4>
            <div className="space-y-2">
              {objectTypes.map((objType) => (
                <Button
                  key={objType.id}
                  variant="outline"
                  className="w-full justify-start text-white border-gray-500 h-auto py-3"
                  onClick={() => handleAddObject(objType.id)}
                >
                  <div className="text-left">
                    <div className="font-medium">{objType.label}</div>
                    <div className="text-xs text-gray-300">{objType.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Instructions */}
      {isMobile && (
        <div className="absolute top-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg text-center text-xs z-30">
          {isCustomizing ? 
            "🎨 Tap objects to select • Use settings to customize atmosphere" :
            "🕹️ Use bottom-left joystick to move • Touch and drag to look around"
          }
        </div>
      )}
    </>
  );
};

export default MobileUI;