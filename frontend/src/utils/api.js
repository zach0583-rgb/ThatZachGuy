import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token from localStorage to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Scene API calls
export const sceneAPI = {
  // Get all user scenes
  getScenes: () => api.get('/scenes'),
  
  // Get specific scene
  getScene: (sceneId) => api.get(`/scenes/${sceneId}`),
  
  // Create new scene
  createScene: (sceneData) => api.post('/scenes', sceneData),
  
  // Update scene
  updateScene: (sceneId, updates) => api.put(`/scenes/${sceneId}`, updates),
  
  // Delete scene
  deleteScene: (sceneId) => api.delete(`/scenes/${sceneId}`),
  
  // Invite user to scene
  inviteUser: (sceneId, inviteData) => api.post(`/scenes/${sceneId}/invite`, inviteData),
};

// Messages API calls
export const messagesAPI = {
  // Get scene messages
  getMessages: (sceneId, limit = 50, skip = 0) => 
    api.get(`/scenes/${sceneId}/messages`, { params: { limit, skip } }),
  
  // Send message
  sendMessage: (sceneId, messageData) => 
    api.post(`/scenes/${sceneId}/messages`, messageData),
};

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (updates) => api.put('/auth/profile', updates),
  logout: () => api.post('/auth/logout'),
};

export default api;