import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const ArtUpload = ({ suiteId, suiteName, onUploadSuccess }) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    type: 'painting',
    tags: '',
    isPublic: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fileTypes = {
    painting: { accept: 'image/*', types: ['image/jpeg', 'image/png', 'image/webp'] },
    music: { accept: 'audio/*', types: ['audio/mpeg', 'audio/wav', 'audio/ogg'] },
    writing: { accept: '.txt,.pdf', types: ['text/plain', 'application/pdf'] },
    sculpture: { accept: 'image/*,model/*', types: ['image/jpeg', 'image/png', 'model/gltf+json'] },
    photo: { accept: 'image/*', types: ['image/jpeg', 'image/png', 'image/webp'] }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!uploadData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your artwork",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('artwork_type', uploadData.type);
      formData.append('tags', JSON.stringify(uploadData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)));
      formData.append('is_public', uploadData.isPublic);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/suites/${suiteId}/artworks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }

      const result = await response.json();
      
      toast({
        title: "Upload Successful! 🎨",
        description: `"${result.title}" has been added to your gallery`
      });
      
      // Reset form
      setUploadData({
        title: '',
        description: '',
        type: 'painting',
        tags: '',
        isPublic: true
      });
      setSelectedFile(null);
      setShowUploadDialog(false);
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Something went wrong with the upload",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileTypeInfo = () => {
    const typeInfo = fileTypes[uploadData.type];
    return typeInfo ? typeInfo.types.join(', ') : 'Various formats';
  };

  return (
    <>
      {/* Upload Button */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-lg">
        <CardContent className="p-4">
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold"
          >
            🎨 Share Your Art
          </Button>
          <p className="text-center text-sm mt-2 opacity-90">
            Upload your creations to {suiteName}
          </p>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle>🎨 Share Your Art</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Art Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">What are you sharing?</label>
              <select 
                value={uploadData.type}
                onChange={(e) => setUploadData({...uploadData, type: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="painting">🎨 Painting/Drawing</option>
                <option value="music">🎵 Music/Audio</option>
                <option value="writing">📝 Writing/Story</option>
                <option value="photo">📸 Photography</option>
                <option value="sculpture">🗿 Sculpture/3D Art</option>
              </select>
            </div>

            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div>
                  <p className="text-green-600 font-medium">✓ {selectedFile.name}</p>
                  <p className="text-sm text-gray-500">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSelectedFile(null)}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-gray-600 mb-2">Drag & drop your file here</p>
                  <p className="text-sm text-gray-500 mb-3">or click to select</p>
                  <input
                    type="file"
                    accept={fileTypes[uploadData.type]?.accept}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    Supported: {getFileTypeInfo()}
                  </p>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={uploadData.title}
                onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                placeholder="Give your art a name..."
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                placeholder="Tell the story behind your art..."
                className="w-full p-2 border rounded-lg resize-none h-20"
                maxLength={500}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <Input
                value={uploadData.tags}
                onChange={(e) => setUploadData({...uploadData, tags: e.target.value})}
                placeholder="nature, abstract, portrait (comma separated)"
              />
            </div>

            {/* Privacy */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="public"
                checked={uploadData.isPublic}
                onChange={(e) => setUploadData({...uploadData, isPublic: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="public" className="text-sm">
                Make this public (others can see it in the gallery)
              </label>
            </div>

            {/* Upload Button */}
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile || !uploadData.title.trim() || uploading}
                className="flex-1"
              >
                {uploading ? "Uploading..." : "🚀 Share Art"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUploadDialog(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtUpload;