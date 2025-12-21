import React from "react";

const SearchBar = () => {
  return (
    <div className="relative w-full">

     
      <img 
        src="/assets/search-button.png" 
        className="h-4 absolute left-3 top-3"
        alt="search-icon" 
      />

      <input
        type="text"
        placeholder="Artists, Songs, Lyrics and more"
        className="w-full bg-white text-black rounded-md py-2 pl-10 pr-3 text-sm"
      />
    </div>
  );
};

export default SearchBar;
