import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import TrackCard from "../components/TrackCard";

const Search = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
     
      <Navbar />

     
      <div className="px-4 mt-6">
        <SearchBar />
      </div>

     
      <div className="px-4 mt-8">
        <h2 className="text-sm text-[#00FFFF] mb-3">Recently Played</h2>

        <div className="flex gap-4 items-end overflow-x-auto">
        
          <div className="w-32 h-44">
            <TrackCard size="large" />
          </div>

      
          <div className="w-24 h-32">
            <TrackCard size="small" />
          </div>
        </div>
      </div>

      
      <div className="px-4 mt-10">
        <h2 className="text-sm text-[#00FFFF] mb-3">Recommended for You</h2>

        <div className="flex gap-4 overflow-x-auto items-end mt-3 pb-3">
          <div className="w-28 h-auto flex flex-col gap-1">
            <TrackCard size="medium" />
            <p className="text-white text-xs font-semibold truncate">
              All My Life
            </p>
            <p className="text-gray-400 text-[10px] truncate">
              Lil Durk, J. Cole
            </p>
          </div>

          <div className="w-28 h-auto flex flex-col gap-1">
            <TrackCard size="medium" />
            <p className="text-white text-xs font-semibold truncate">
              Try Me
            </p>
            <p className="text-gray-400 text-[10px] truncate">
              Megan Thee Stallion
            </p>
          </div>

          <div className="w-28 h-auto flex flex-col gap-1">
            <TrackCard size="medium" />
            <p className="text-white text-xs font-semibold truncate">
              Elevate
            </p>
            <p className="text-gray-400 text-[10px] truncate">
              Maya Swiss
            </p>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default Search;
