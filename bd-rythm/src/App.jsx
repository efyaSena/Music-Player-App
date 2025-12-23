import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Playlist from "./pages/Playlist";
import Search from "./pages/Search";
import TracksDetail from "./pages/TracksDetail";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tracksdetail" element={<TracksDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
