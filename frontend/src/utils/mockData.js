export const mockData = {
  // Collaborators data
  collaborators: [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: '/api/placeholder/32/32',
      status: 'online',
      isOwner: false,
      permissions: ['view', 'edit'],
      lastSeen: 'Online',
      isOnline: true,
      micEnabled: true,
      videoEnabled: false
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      avatar: '/api/placeholder/32/32',
      status: 'away',
      isOwner: false,
      permissions: ['view'],
      lastSeen: 'Online',
      isOnline: true,
      micEnabled: false,
      videoEnabled: true
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: '/api/placeholder/32/32',
      status: 'offline',
      isOwner: false,
      permissions: ['view', 'edit'],
      lastSeen: '2 hours ago',
      isOnline: false,
      micEnabled: true,
      videoEnabled: true
    }
  ],

  // Chat messages
  chatMessages: [
    {
      id: 1,
      text: 'Welcome to our virtual meeting space! 🎉',
      sender: 'Sarah Johnson',
      timestamp: '10:30 AM',
      isOwnMessage: false,
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 2,
      text: 'This looks amazing! I love the layout.',
      sender: 'Mike Chen',
      timestamp: '10:32 AM',
      isOwnMessage: false,
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 3,
      text: 'Should we add some plants to make it more cozy?',
      sender: 'You',
      timestamp: '10:35 AM',
      isOwnMessage: true,
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 4,
      text: 'Great idea! Maybe some artwork too?',
      sender: 'Emma Davis',
      timestamp: '10:37 AM',
      isOwnMessage: false,
      avatar: '/api/placeholder/32/32'
    }
  ],

  // Music tracks
  musicTracks: [
    {
      id: 1,
      title: 'Peaceful Morning',
      artist: 'Ambient Sounds',
      duration: '4:23',
      sharedBy: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Focus Flow',
      artist: 'Lo-Fi Collective',
      duration: '3:45',
      sharedBy: 'Mike Chen'
    },
    {
      id: 3,
      title: 'Coffee Shop Vibes',
      artist: 'Urban Beats',
      duration: '5:12',
      sharedBy: 'Emma Davis'
    },
    {
      id: 4,
      title: 'Nature Sounds',
      artist: 'Forest Recordings',
      duration: '6:30',
      sharedBy: 'You'
    }
  ],

  // Shared images
  sharedImages: [
    {
      id: 1,
      title: 'Mood Board - Modern Office',
      url: '/api/placeholder/300/200',
      sharedBy: 'Sarah Johnson',
      timestamp: '2 hours ago',
      likes: 3
    },
    {
      id: 2,
      title: 'Color Inspiration',
      url: '/api/placeholder/300/200',
      sharedBy: 'Mike Chen',
      timestamp: '1 day ago',
      likes: 5
    },
    {
      id: 3,
      title: 'Furniture References',
      url: '/api/placeholder/300/200',
      sharedBy: 'Emma Davis',
      timestamp: '3 days ago',
      likes: 2
    }
  ],

  // Scene templates
  sceneTemplates: [
    {
      id: 1,
      name: 'Modern Office',
      description: 'Clean, professional workspace',
      thumbnail: '/api/placeholder/200/150',
      background: 'modern-office',
      objects: [
        { type: 'desk', position: { x: 200, y: 150 } },
        { type: 'chair', position: { x: 180, y: 180 } },
        { type: 'plant', position: { x: 280, y: 140 } },
        { type: 'whiteboard', position: { x: 100, y: 100 } }
      ]
    },
    {
      id: 2,
      name: 'Cozy Lounge',
      description: 'Comfortable meeting space',
      thumbnail: '/api/placeholder/200/150',
      background: 'cozy-cafe',
      objects: [
        { type: 'sofa', position: { x: 150, y: 180 } },
        { type: 'table', position: { x: 200, y: 200 } },
        { type: 'plant', position: { x: 100, y: 120 } },
        { type: 'artwork', position: { x: 300, y: 100 } }
      ]
    },
    {
      id: 3,
      name: 'Creative Studio',
      description: 'Inspiring creative workspace',
      thumbnail: '/api/placeholder/200/150',
      background: 'creative-studio',
      objects: [
        { type: 'desk', position: { x: 180, y: 160 } },
        { type: 'chair', position: { x: 160, y: 190 } },
        { type: 'bookshelf', position: { x: 280, y: 120 } },
        { type: 'artwork', position: { x: 100, y: 100 } },
        { type: 'plant', position: { x: 320, y: 180 } }
      ]
    }
  ],

  // Saved scenes by user
  savedScenes: [
    {
      id: 1,
      name: 'Team Meeting Room',
      description: 'Our main collaboration space',
      thumbnail: '/api/placeholder/200/150',
      lastModified: '2 hours ago',
      collaborators: 4,
      isPublic: true
    },
    {
      id: 2,
      name: 'Brainstorm Space',
      description: 'Creative thinking environment',
      thumbnail: '/api/placeholder/200/150',
      lastModified: '1 day ago',
      collaborators: 2,
      isPublic: false
    },
    {
      id: 3,
      name: 'Client Presentation',
      description: 'Professional meeting setup',
      thumbnail: '/api/placeholder/200/150',
      lastModified: '3 days ago',
      collaborators: 6,
      isPublic: true
    }
  ]
};