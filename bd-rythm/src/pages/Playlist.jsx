import React from "react";
import { FiSearch } from "react-icons/fi";
import logo from "../assets/BD-RYTHM-logo.png";

const PlaylistPage = () => {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] relative p-6">
     
      <div className="flex justify-between items-center mb-10">
        <p className="text-sm cursor-pointer">login / register</p>
      </div>

     <div className="flex flex-col items-center mb-10">
  <img src={logo} alt="BD Rythm Logo" className="w-48 mb-2" />
  <p className="text-lg text-gray-300">Feel the sound. Play your vibe.</p>
</div>

    
      <div className="flex items-center bg-white rounded-xl px-4 py-3 mb-10">
        <FiSearch className="text-black mr-3" size={20} />
        <input
          type="text"
          placeholder="Artists, Songs, Lyrics and More"
          className="flex-1 outline-none text-black placeholder-gray-500"
        />
      </div>

      
      <div className="mb-10">
        <h2 className="text-md mb-4 text-white">Trending / Popular tracks</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { name: "Artist ", title: "Song title", opacity: "opacity-80" },
            { name: "Artist ", title: "Song title", opacity: "opacity-60" },
            { name: "Artist ", title: "Song title", opacity: "opacity-60" },
            { name: "Artist ", title: "Song title", opacity: "opacity-60" },
            { name: "Artist ", title: "Song title", opacity: "opacity-80" },
          ].map((track, idx) => (
            <div key={idx} className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-20 h-20 bg-[#00FFFF] ${track.opacity} rounded-md mb-1`}
              ></div>
              <p className="text-xs text-white">{track.name}</p>
              <p className="text-xs text-white">{track.title}</p>
            </div>
          ))}
        </div>
      </div>

   
      <div className="mb-20">
        <h2 className="text-md mb-4 text-white">Favorite Songs</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { title: "Song Title ", artist: "Artist ", w: "w-64", h: "h-80" },
            { title: "Song Title ", artist: "Artist ", w: "w-56", h: "h-72" },
            { title: "Song Title ", artist: "Artist ", w: "w-48", h: "h-64" },
            { title: "Song Title ", artist: "Artist ", w: "w-40", h: "h-56" },
            { title: "Song Title ", artist: "Artist ", w: "w-32", h: "h-48" },
          ].map((song, idx) => (
            <div
              key={idx}
              className={`${song.w} ${song.h} bg-[#00FFFF] opacity-80 rounded-md p-4 flex flex-col justify-end text-black flex-shrink-0`}
            >
              <p className="font-bold text-lg">{song.title}</p>
              <p className="text-sm">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
