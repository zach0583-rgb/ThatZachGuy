import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VirtualMeetingPlace from "./components/VirtualMeetingPlace";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VirtualMeetingPlace />} />
          <Route path="/scene/:sceneId" element={<VirtualMeetingPlace />} />
          <Route path="/join/:inviteId" element={<VirtualMeetingPlace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}