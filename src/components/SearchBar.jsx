import { FiSearch } from "react-icons/fi";
import { BiSolidMicrophone } from "react-icons/bi";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-[#CFFFFF] rounded-xl px-4 py-3 gap-3"
    >
      {/* search icon */}
      <button type="submit">
        <FiSearch className="text-black" size={18} />
      </button>

      {/* input */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Artists, Songs, Lyrics and more"
        className="flex-1 bg-transparent outline-none text-black placeholder-black/60 text-[11px] sm:text-sm font-semibold"
      />

      {/* mic icon (placeholder for now) */}
      <button type="button">
        <BiSolidMicrophone className="text-black" size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
