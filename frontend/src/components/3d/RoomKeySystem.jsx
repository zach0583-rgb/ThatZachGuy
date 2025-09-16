import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';

const RoomKeySystem = ({ onRoomAccess }) => {
  const [roomKey, setRoomKey] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedSuite, setSelectedSuite] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  // Available room keys for your artist friends
  const roomKeys = {
    'PAINT-DREAMS-2024': {
      suiteId: 'suite-1',
      artistName: 'Sarah Mitchell',
      medium: 'Painter',
      personalMessage: 'Hey Sarah! Remember our late-night painting sessions? I created this space for you to share your art again. Hope we can reconnect! 💕'
    },
    'GUITAR-HERO-2024': {
      suiteId: 'suite-2', 
      artistName: 'Marcus Rodriguez',
      medium: 'Musician',
      personalMessage: 'Marcus! I still have that demo tape you made. This is your virtual studio - share your new music with me! Miss jamming together. 🎸'
    },
    'LENS-MAGIC-2024': {
      suiteId: 'suite-3',
      artistName: 'Elena Kowalski',
      medium: 'Photographer', 
      personalMessage: 'Elena! Your photos always captured the soul of our adventures. I made this gallery just for you. Can\'t wait to see your latest work! 📸'
    },
    'STORY-TELLER-2024': {
      suiteId: 'suite-4',
      artistName: 'David Chen',
      medium: 'Writer',
      personalMessage: 'David, your stories always made us believe in magic. This writer\'s retreat is yours - share your tales again! Our stories live on. ✍️'
    },
    'CLAY-DREAMS-2024': {
      suiteId: 'suite-5',
      artistName: 'Isabella Romano',
      medium: 'Sculptor',
      personalMessage: 'Bella! I still have that clay figure you made of all of us. This space is for your sculptures - let\'s shape new memories together! 🏺'
    },
    'PIXEL-ARTIST-2024': {
      suiteId: 'suite-6',
      artistName: 'James Thompson', 
      medium: 'Digital Artist',
      personalMessage: 'James! You were always ahead of your time with digital art. This virtual space is perfect for you - show me your pixel worlds! 💻'
    }
  };

  const handleRoomKeySubmit = () => {
    const keyData = roomKeys[roomKey.toUpperCase()];
    
    if (keyData) {
      onRoomAccess(keyData.suiteId, keyData);
      toast({
        title: "Welcome Back! 💕",
        description: `Access granted to ${keyData.artistName}'s suite`
      });
      setRoomKey('');
    } else {
      toast({
        title: "Invalid Room Key",
        description: "Please check your room key and try again",
        variant: "destructive"
      });
    }
  };

  const generateInviteLink = (suiteKey) => {
    const inviteData = roomKeys[suiteKey];
    const inviteLink = `${window.location.origin}/artist-invite?key=${suiteKey}&from=${encodeURIComponent(user.name)}`;
    
    return {
      link: inviteLink,
      message: `🎨 You're invited to your personal artist suite! 🎨

${inviteData.personalMessage}

Your Room Key: ${suiteKey}
Direct Link: ${inviteLink}

Steps to enter:
1. Click the link above (or go to the website and enter your room key)
2. Your personal suite is waiting with a gallery for your art
3. Upload your paintings, music, photos, or any creative work
4. Let's reconnect through our art like the old days!

Can't wait to see what you've been creating! 💕

- ${user.name}`
    };
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !selectedSuite) return;
    
    const inviteInfo = generateInviteLink(selectedSuite);
    
    // In a real app, this would send an email
    // For demo, we'll show the invite message and copy to clipboard
    try {
      await navigator.clipboard.writeText(inviteInfo.message);
      toast({
        title: "Invite Copied! 💌",
        description: `Invitation for ${roomKeys[selectedSuite].artistName} copied to clipboard. Send it via email, text, or social media!`
      });
      
      setShowInviteDialog(false);
      setInviteEmail('');
      setSelectedSuite('');
    } catch (err) {
      toast({
        title: "Invite Ready! 📝", 
        description: "Copy the message below and send it to your friend",
        variant: "default"
      });
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50 space-y-4">
      {/* Room Key Entry */}
      <Card className="bg-black/70 backdrop-blur-sm text-white border-gray-600 w-80">
        <CardHeader>
          <CardTitle className="text-center">🗝️ Artist Suite Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value)}
              placeholder="Enter your room key..."
              className="text-white bg-gray-800 border-gray-600"
              onKeyPress={(e) => e.key === 'Enter' && handleRoomKeySubmit()}
            />
          </div>
          <Button onClick={handleRoomKeySubmit} className="w-full">
            🏠 Enter Suite
          </Button>
        </CardContent>
      </Card>

      {/* Send Invites to Friends */}
      <Card className="bg-purple-600/90 backdrop-blur-sm text-white border-purple-400 w-80">
        <CardHeader>
          <CardTitle className="text-center">💌 Invite Your Artist Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowInviteDialog(true)}
            className="w-full bg-white text-purple-600 hover:bg-purple-50"
          >
            📧 Send Room Keys to Friends
          </Button>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="bg-white text-gray-900 max-w-md">
          <DialogHeader>
            <DialogTitle>💕 Invite Your Artist Friends</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Choose Suite:</label>
              <select 
                value={selectedSuite}
                onChange={(e) => setSelectedSuite(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select a suite...</option>
                {Object.entries(roomKeys).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.artistName} - {data.medium}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Friend's Email:</label>
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                type="email"
              />
            </div>
            
            {selectedSuite && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Personal Message Preview:</strong>
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {roomKeys[selectedSuite].personalMessage.substring(0, 100)}...
                </p>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSendInvite}
                disabled={!inviteEmail || !selectedSuite}
                className="flex-1"
              >
                💌 Create Invite
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInviteDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Instructions */}
      <Card className="bg-blue-600/80 backdrop-blur-sm text-white border-blue-400 w-80">
        <CardContent className="p-3">
          <p className="text-xs text-center">
            💡 <strong>For Friends:</strong> Enter your room key above to access your personal art suite and gallery!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomKeySystem;