import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import './index.css'

import Welcome from './pages/Welcome.jsx'
import Login from './pages/Login.jsx'
import Library from './pages/Library.jsx'
import HomePage from './pages/HomePage.jsx'
import PlayListPage from './pages/PlayListPage.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/library" element={<Library />} />
      <Route path='/homepage' element={<HomePage />} />
      <Route path="/playlist" element={<PlayListPage />} />
    </Routes>
  </BrowserRouter>
)
