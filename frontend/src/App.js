import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import VirtualMeetingPlace from "./components/VirtualMeetingPlace";
import AuthPage from "./components/auth/AuthPage";
import LoadingSpinner from "./components/LoadingSpinner";

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
      <Route path="/" element={<VirtualMeetingPlace />} />
      <Route path="/scene/:sceneId" element={<VirtualMeetingPlace />} />
      <Route path="/join/:inviteId" element={<VirtualMeetingPlace />} />
    </Routes>
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