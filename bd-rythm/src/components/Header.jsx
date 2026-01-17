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


         <Link to="/library">
          <button>LIBRARY</button>
        </Link>


        <Link to="/homepage">
          <button>HOMEPAGE</button>
        </Link>

         <Link to="/playlistpage">
          <button>PLAYLIST</button>
        </Link>

      

      </nav>
    </header>
  );
};

export default Header;
