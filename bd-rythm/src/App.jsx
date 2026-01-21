import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import AudioRecorder from "./pages/AudioRecorder";
import Search from "./pages/Search";
import Signup from "./pages/Signup";


import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Library from "./pages/Library";
import PlaylistPage from "./pages/PlayListPage";
import HomePage from "./pages/HomePage";
import TrendingSongs from "./pages/TrendingSongs";
import TopAlbums from "./pages/TopAlbums";
import TopSongs from "./pages/TopSongs";
import PopularArtists from "./pages/PopularArtists";
import PopularPlaylists from "./pages/PopularPlaylists";
import NewReleases from "./pages/NewReleases";


function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
        <Route path="/library" element={<Library />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/playlistpage" element={<PlaylistPage />} />
       <Route path="/trending-songs" element={<TrendingSongs />} />
        <Route path="/top-albums" element={<TopAlbums />} />
        <Route path="/recorder" element={<AudioRecorder />} />
          <Route path="/search" element={<Search />} />
          <Route path="/top-songs" element={<TopSongs />} />
          <Route path="/popular-artists" element={<PopularArtists />} />
            <Route path="/popular-playlists" element={<PopularPlaylists />} />
              <Route path="/new-releases" element={<NewReleases />} />


      </Routes>
    </>
  );
}

export default App;
