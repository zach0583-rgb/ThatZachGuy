import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Search, Sofa, Armchair, Monitor, TreePine, BookOpen, Coffee, Palette } from 'lucide-react';

const ObjectsLibrary = ({ onAddObject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const objectCategories = [
    { id: 'all', name: 'All', icon: null },
    { id: 'furniture', name: 'Furniture', icon: Sofa },
    { id: 'decor', name: 'Decor', icon: Palette },
    { id: 'tech', name: 'Technology', icon: Monitor },
    { id: 'nature', name: 'Nature', icon: TreePine }
  ];

  const objectLibrary = [
    { 
      id: 'desk', 
      name: 'Desk', 
      category: 'furniture', 
      icon: '🏢',
      description: 'Modern office desk'
    },
    { 
      id: 'chair', 
      name: 'Office Chair', 
      category: 'furniture', 
      icon: '💺',
      description: 'Ergonomic office chair'
    },
    { 
      id: 'sofa', 
      name: 'Sofa', 
      category: 'furniture', 
      icon: '🛋️',
      description: 'Comfortable lounge sofa'
    },
    { 
      id: 'table', 
      name: 'Round Table', 
      category: 'furniture', 
      icon: '⭕',
      description: 'Round meeting table'
    },
    { 
      id: 'bookshelf', 
      name: 'Bookshelf', 
      category: 'furniture', 
      icon: '📚',
      description: 'Wooden bookshelf'
    },
    { 
      id: 'plant', 
      name: 'Plant', 
      category: 'nature', 
      icon: '🌱',
      description: 'Green office plant'
    },
    { 
      id: 'whiteboard', 
      name: 'Whiteboard', 
      category: 'tech', 
      icon: '📝',
      description: 'Interactive whiteboard'
    },
    { 
      id: 'artwork', 
      name: 'Artwork', 
      category: 'decor', 
      icon: '🖼️',
      description: 'Decorative wall art'
    }
  ];

  const filteredObjects = objectLibrary.filter(obj => {
    const matchesSearch = obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obj.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || obj.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddObject = (objectType) => {
    // Add object at a random position within reasonable bounds
    const position = {
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50
    };
    onAddObject(objectType, position);
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Objects Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search objects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {objectCategories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon && <category.icon className="h-3 w-3 mr-1" />}
                {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Objects Grid */}
      <div className="flex-1">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-3 p-1">
            {filteredObjects.map((object) => (
              <Card
                key={object.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => handleAddObject(object.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{object.icon}</div>
                  <h4 className="font-medium text-sm mb-1">{object.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{object.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredObjects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No objects found</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Quick Add Section */}
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Add</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['desk', 'chair', 'plant', 'whiteboard'].map((quickItem) => (
              <Button
                key={quickItem}
                size="sm"
                variant="outline"
                onClick={() => handleAddObject(quickItem)}
                className="text-xs"
              >
                {quickItem}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectsLibrary;