import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Header = () => {
  return (
    <header className="p-4">
      <nav className="flex items-center gap-6 bg-white/10 backdrop-blur-lg rounded-md px-4 py-2 shadow-sm ring-1 ring-white/10 text-xs text-white">
        
        <Link to="/">
          <button>WELCOME</button>
        </Link>

        <Link to="/login">
          <button>LOGIN</button>
        </Link>

        <Link to="/playlist">
          <button>PLAYLIST</button>
        </Link>

        <Link to="/tracksdetail">
          <button>TRACK DETAIL</button>
        </Link>

        <Link to="/search">
          <button className="flex items-center gap-1">
            <FiSearch className="w-4" />
            SEARCH
          </button>
        </Link>

      </nav>
    </header>
  );
};

export default Header;
