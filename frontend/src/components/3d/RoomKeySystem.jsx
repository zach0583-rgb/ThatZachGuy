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

  // Available room keys for your ACTUAL ASSHOLE artist friends - Twin Peaks Hotel Style
  const roomKeys = {
    'ROOM-201-TZG': {
      suiteId: 'suite-1',
      artistName: 'Christopher Royal King',
      medium: 'The "Royal" Artist',
      roomNumber: '201',
      personalMessage: 'Christopher Royal fucking King - yeah, I went with the full pretentious name. Found this old brass key with the green Twin Peaks keychain in the back office. Room 201 is yours. Your royal highness better not disappoint with the same mediocre shit from back in the day. Time to prove that name means something. 👑💀'
    },
    'ROOM-202-TZG': {
      suiteId: 'suite-2', 
      artistName: 'Philip Nanos',
      medium: 'The Experimenter',
      roomNumber: '202',
      personalMessage: 'Philip, you magnificent bastard. Got you Room 202 - the green keychain is a little faded but it still works. Remember when you thought you were the next big thing? Well, here\'s your chance to actually BE something. This suite better produce art that doesn\'t make me question our friendship. No pressure. 🎨😈'
    },
    'ROOM-203-TZG': {
      suiteId: 'suite-3',
      artistName: 'Jeremy Galindo',
      medium: 'Chaos Creator', 
      roomNumber: '203',
      personalMessage: 'Jeremy, I still remember your "experimental phase" - we all suffered through it. Room 203 has that old Twin Peaks charm you always pretended to understand. This gallery is your redemption arc. Show me you\'ve actually learned something since then, or I\'m roasting you in front of everyone. 🔥💀'
    },
    'ROOM-204-TZG': {
      suiteId: 'suite-4',
      artistName: 'Joshua Brock',
      medium: 'The Bold One',
      roomNumber: '204',
      personalMessage: 'Josh, you stubborn asshole. Room 204 - the key is as old and worn as your excuses for unfinished projects. Your art was always bold but half the time it looked like you threw paint at a wall and called it deep. This space is for you to prove you can actually finish something good. Don\'t fuck it up. 🎯😈'
    },
    'ROOM-205-TZG': {
      suiteId: 'suite-5',
      artistName: 'Chris Andrews',
      medium: 'The Quiet Genius',
      roomNumber: '205',
      personalMessage: 'Chris Andrews - not to be confused with the other Chris (Royal King thinks he\'s special). Room 205 came with this vintage green keychain that actually matches your understated style. You were always the quiet one with surprisingly good taste. This suite better showcase that you didn\'t peak in your twenties. Surprise me. 🎨🔥'
    },
    'ROOM-206-TZG': {
      suiteId: 'suite-6',
      artistName: 'Eric Kriefels', 
      medium: 'Wildcard Genius/Disaster',
      roomNumber: '206',
      personalMessage: 'Eric fucking Kriefels - the wildcard gets the end room, 206. The brass key is tarnished and the green plastic keychain has seen better days - perfect for your chaotic energy. Your art was either brilliant or complete garbage, no in-between. Show me which Eric shows up - genius or disaster. 💻💀'
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
        title: "Roast Invite Copied! 💀",
        description: `Brutal invitation for ${roomKeys[selectedSuite].artistName} copied to clipboard. Time to destroy them with nostalgia!`
      });
      
      setShowInviteDialog(false);
      setInviteEmail('');
      setSelectedSuite('');
    } catch (err) {
      toast({
        title: "Asshole Invite Ready! 🔥", 
        description: "Copy the brutal message below and send it to your victim... I mean friend",
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