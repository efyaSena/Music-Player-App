import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Library from "./pages/Library";
import PlaylistPage from "./pages/PlayListPage";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/library" element={<Library />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/playlistpage" element={<PlaylistPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
