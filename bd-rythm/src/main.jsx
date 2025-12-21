import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import './index.css'

import Welcome from './pages/Welcome.jsx'
import Login from './pages/Login.jsx'

import Search from './pages/Search.jsx'
import TrackDetail from './pages/TrackDetail.jsx'
import Playlist from './pages/Playlist.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<Search />} />
      <Route path="/track/:id" element={<TrackDetail />} />
      <Route path="/playlist" element={<Playlist />} />
    </Routes>
  </BrowserRouter>
)
