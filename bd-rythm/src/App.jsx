import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Playlist from "./pages/Playlist";
import Search from "./pages/Search";
import TrackDetail from "./pages/TrackDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/trackdetail" element={<TrackDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
