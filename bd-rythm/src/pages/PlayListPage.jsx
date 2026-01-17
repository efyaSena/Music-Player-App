import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import TrackCard from "../components/TrackCard";
import PlayListCard from "../components/PlaylistCard";
import PlayerBar from "../components/BottomNav";

const TracksDetail = () => {
    console.log("TrackDetail component rendered");
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

   
      <Navbar />

    
      <div className="px-4 mt-6">
        <h1 className="text-lg font-semibold">Search</h1>
      </div>

     
      <div className="px-4 mt-4">
        <SearchBar />
      </div>


    <div className="px-4 mt-8">
        <h2 className="text-sm text-gray-300 mb-3">Trending this week</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <TrackCard />
          <TrackCard />
          <TrackCard />
          <TrackCard />
          <TrackCard />
          <TrackCard />
        </div>
      </div>

    <div className="px-4 mt-10">
        <h2 className="text-sm text-gray-300 mb-3">Playlists</h2>
        <div className="flex gap-4 flex-col">
          <PlayListCard />
          <PlayListCard />
        </div>
      </div>

      
      <div className="px-4 mt-4">
        <button className="flex items-center justify-between w-full bg-[#00FFFF] text-black py-2 px-3 rounded-md text-sm font-semibold">
          <img src="/assets/music-icon.png" className="h-4 w-4" alt="music icon" />
          Not Playing
          <img src="/assets/next-icon.png" className="h-4 w-4" alt="next icon" />
        </button>
      </div>

      <PlayerBar />
    </div>
  );
};

export default TracksDetail;
