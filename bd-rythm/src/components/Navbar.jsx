import React from "react";

const Navbar = () => {
  return (
    <div className="w-full flex justify-between items-center px-4 py-4 bg-black">
      <img src="assets/BD-RYTHM-logo.png" alt="logo" className="h-8" />

      <div className="flex gap-3 text-xs">
        <button>Login</button>
        <button>Register</button>
      </div>
    </div>
  );
};

export default Navbar;
