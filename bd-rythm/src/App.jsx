import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import BottomNav from "./components/BottomNav";
import PlayerBar from "./components/PlayerBar";

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

import Playlist from "./pages/Playlist";

import ArtistProfile from "./pages/ArtistProfile";
import ListeningShelf from "./pages/ListeningShelf";
import MoodShelf from "./pages/MoodShelf";




function PlayerLayout() {
  return (
    <div className="min-h-dvh bg-black text-white overflow-x-hidden pb-[160px]">
      {/* page content */}
      <Outlet />

      {/* PlayerBar sits above BottomNav */}
      <PlayerBar />

      {/* BottomNav at the very bottom */}
      <BottomNav />
    </div>
  );
}


export default function App() {
  return (
    <Routes>
      {/* pages with NO bottom bars */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* pages WITH PlayerBar + BottomNav */}
      <Route element={<PlayerLayout />}>
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
        <Route path="/playlist" element={<Playlist />} />
      <Route path="/artist" element={<ArtistProfile />} />
      <Route path="/listening/:slug" element={<ListeningShelf />} />
      <Route path="/mood/:slug" element={<MoodShelf />} />



      </Route>
    </Routes>
  );
}
