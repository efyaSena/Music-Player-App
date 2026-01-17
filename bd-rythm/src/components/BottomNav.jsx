import React from "react";

const PlayerBar = () => {
  return (
    <div className="w-full bg-black px-4 py-3 border-t border-gray-800 mt-auto">

    
      <div className="flex justify-around items-center text-center">

        <button className="flex flex-col items-center">
          <img src="/assets/home-button.png" className="h-6" alt="" />
          <p className="text-[10px] mt-[2px]">Home</p>
        </button>

        <button className="flex flex-col items-center">
          <img src="/assets/music-icon.png" className="h-6" alt="" />
          <p className="text-[10px] mt-[2px]">Library</p>
        </button>

        <button className="flex flex-col items-center">
          <img src="/assets/voice-recorder.png" className="h-6" alt="" />
          <p className="text-[10px] mt-[2px]">Audio Recorder</p>
        </button>

        <button className="flex flex-col items-center">
          <img src="/assets/search-button.png" className="h-6" alt="" />
          <p className="text-[10px] mt-[2px]">Search</p>
        </button>

      </div>
    </div>
  );
};

export default PlayerBar;
