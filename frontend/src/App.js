import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import VirtualMeetingPlace from "./components/VirtualMeetingPlace";
import World3D from "./components/3d/World3D";
import AuthPage from "./components/auth/AuthPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { Button } from "./components/ui/button";

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/2d" element={<VirtualMeetingPlace />} />
      <Route path="/3d" element={<World3D />} />
      <Route path="/scene/:sceneId" element={<VirtualMeetingPlace />} />
      <Route path="/join/:inviteId" element={<VirtualMeetingPlace />} />
    </Routes>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
          🌲 Virtual Meeting Place 🌲
        </h1>
        <p className="text-xl text-gray-700 mb-12">
          Choose your virtual experience
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 2D Experience */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <h2 className="text-2xl font-semibold mb-4">🎨 2D Designer</h2>
            <p className="text-gray-600 mb-6">
              Design and collaborate in our original 2D scene editor with drag-and-drop furniture placement.
            </p>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/2d'}
            >
              Enter 2D World
            </Button>
          </div>
          
          {/* 3D Experience */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-purple-200">
            <h2 className="text-2xl font-semibold mb-4">🏔️ 3D Pacific Northwest</h2>
            <p className="text-gray-600 mb-6">
              <strong>NEW!</strong> Immersive 3D experience in a mystical Twin Peaks-style lodge surrounded by coastal forest.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600" 
              onClick={() => window.location.href = '/3d'}
            >
              Enter 3D World ✨
            </Button>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">🎮 3D Controls</h3>
          <p className="text-sm text-gray-600">
            <strong>Click to enter</strong> • <strong>WASD</strong> to move • <strong>Mouse</strong> to look around • <strong>Shift</strong> to run • <strong>ESC</strong> to exit
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;