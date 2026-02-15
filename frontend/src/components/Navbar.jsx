import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Remote Work Tracker
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/login"
            className="text-gray-600 hover:text-black transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
