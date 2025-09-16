import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Palette, Image as ImageIcon } from 'lucide-react';
import { mockData } from '../utils/mockData';

const SceneCanvas = forwardRef(({ 
  objects, 
  background, 
  selectedTool, 
  isEditMode, 
  onObjectUpdate, 
  onDeleteObject,
  onBackgroundChange 
}, ref) => {
  const [draggedObject, setDraggedObject] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const canvasRef = useRef(null);

  const backgroundStyles = {
    'modern-office': 'bg-gradient-to-br from-blue-50 to-indigo-100',
    'cozy-cafe': 'bg-gradient-to-br from-amber-50 to-orange-100',
    'creative-studio': 'bg-gradient-to-br from-purple-50 to-pink-100',
    'nature-retreat': 'bg-gradient-to-br from-green-50 to-emerald-100',
    'minimalist': 'bg-gradient-to-br from-gray-50 to-slate-100',
    'dark-mode': 'bg-gradient-to-br from-slate-800 to-slate-900'
  };

  const objectComponents = {
    desk: (props) => (
      <div className="w-24 h-16 bg-amber-600 rounded shadow-lg border-2 border-amber-700" {...props}>
        <div className="w-full h-2 bg-amber-700 rounded-t"></div>
      </div>
    ),
    chair: (props) => (
      <div className="w-12 h-16 bg-blue-600 rounded shadow-lg relative" {...props}>
        <div className="w-full h-8 bg-blue-700 rounded-t"></div>
        <div className="w-2 h-4 bg-blue-800 absolute bottom-0 left-2"></div>
        <div className="w-2 h-4 bg-blue-800 absolute bottom-0 right-2"></div>
      </div>
    ),
    plant: (props) => (
      <div className="w-8 h-12 relative" {...props}>
        <div className="w-8 h-8 bg-green-400 rounded-full shadow-lg"></div>
        <div className="w-6 h-4 bg-amber-800 rounded absolute bottom-0 left-1"></div>
      </div>
    ),
    bookshelf: (props) => (
      <div className="w-20 h-24 bg-amber-800 shadow-lg relative" {...props}>
        <div className="w-full h-1 bg-amber-900 absolute top-6"></div>
        <div className="w-full h-1 bg-amber-900 absolute top-12"></div>
        <div className="w-full h-1 bg-amber-900 absolute top-18"></div>
      </div>
    ),
    whiteboard: (props) => (
      <div className="w-28 h-20 bg-white border-4 border-gray-400 rounded shadow-lg relative" {...props}>
        <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 left-2"></div>
        <div className="w-4 h-1 bg-blue-500 absolute top-6 left-4"></div>
        <div className="w-6 h-1 bg-green-500 absolute top-10 left-4"></div>
      </div>
    ),
    sofa: (props) => (
      <div className="w-32 h-20 bg-purple-600 rounded-lg shadow-lg relative" {...props}>
        <div className="w-full h-12 bg-purple-700 rounded-t-lg"></div>
        <div className="w-6 h-8 bg-purple-800 rounded absolute top-2 left-2"></div>
        <div className="w-6 h-8 bg-purple-800 rounded absolute top-2 right-2"></div>
      </div>
    ),
    table: (props) => (
      <div className="w-24 h-24 bg-amber-700 rounded-full shadow-lg relative" {...props}>
        <div className="w-20 h-20 bg-amber-600 rounded-full absolute top-2 left-2"></div>
      </div>
    ),
    artwork: (props) => (
      <div className="w-16 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded shadow-lg border-4 border-white" {...props}>
        <div className="w-6 h-6 bg-yellow-400 rounded-full mt-2 ml-2"></div>
        <div className="w-8 h-2 bg-blue-400 mt-2 ml-2"></div>
      </div>
    )
  };

  const handleMouseDown = (e, objectId) => {
    if (!isEditMode || selectedTool !== 'move') return;
    
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const object = objects.find(obj => obj.id === objectId);
    
    setDraggedObject(objectId);
    setDragOffset({
      x: e.clientX - rect.left - object.position.x,
      y: e.clientY - rect.top - object.position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggedObject || !isEditMode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newPosition = {
      x: Math.max(0, Math.min(rect.width - 100, e.clientX - rect.left - dragOffset.x)),
      y: Math.max(0, Math.min(rect.height - 100, e.clientY - rect.top - dragOffset.y))
    };
    
    onObjectUpdate(draggedObject, { position: newPosition });
  };

  const handleMouseUp = () => {
    setDraggedObject(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleObjectClick = (e, objectId) => {
    if (!isEditMode) return;
    
    e.stopPropagation();
    
    if (selectedTool === 'delete') {
      onDeleteObject(objectId);
    }
  };

  useEffect(() => {
    if (draggedObject) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedObject, dragOffset]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${backgroundStyles[background] || backgroundStyles['modern-office']}`}>
        {/* Grid pattern for editing */}
        {isEditMode && (
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
        )}
      </div>

      {/* Background Selector */}
      {showBackgroundSelector && (
        <Card className="absolute top-4 right-4 p-4 z-50 bg-white/90 backdrop-blur-sm">
          <h3 className="font-medium mb-3">Choose Background</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(backgroundStyles).map(([key, style]) => (
              <button
                key={key}
                className={`w-16 h-12 rounded border-2 ${style} ${background === key ? 'border-blue-500' : 'border-gray-300'}`}
                onClick={() => {
                  onBackgroundChange(key);
                  setShowBackgroundSelector(false);
                }}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseUp={handleMouseUp}
      >
        {/* Objects */}
        {objects.map((object) => {
          const ObjectComponent = objectComponents[object.type];
          if (!ObjectComponent) return null;

          return (
            <div
              key={object.id}
              className={`absolute transition-all duration-200 ${
                isEditMode ? 'hover:scale-110 cursor-pointer' : ''
              } ${selectedTool === 'delete' ? 'hover:ring-2 hover:ring-red-500' : ''}`}
              style={{
                left: object.position.x,
                top: object.position.y,
                transform: `rotate(${object.rotation}deg) scale(${object.scale})`,
                zIndex: object.zIndex
              }}
              onMouseDown={(e) => handleMouseDown(e, object.id)}
              onClick={(e) => handleObjectClick(e, object.id)}
            >
              <ObjectComponent />
              {isEditMode && (
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full opacity-50"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-white/80 backdrop-blur-sm"
          onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
        >
          <Palette className="h-4 w-4" />
        </Button>
      </div>

      {/* Instructions */}
      {isEditMode && objects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Card className="p-8 bg-white/80 backdrop-blur-sm text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Start Creating Your Virtual Space</h3>
            <p className="text-gray-600">
              Add objects from the sidebar to begin designing your meeting place
            </p>
          </Card>
        </div>
      )}
    </div>
  );
});

SceneCanvas.displayName = 'SceneCanvas';

export default SceneCanvas;