import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ logout }) {
  return (
    <nav className="bg-yellow-200 p-4 border-b-4 border-black">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link 
            to="/" 
            className="bg-white px-4 py-2 text-lg font-bold border-4 border-black rounded hover:bg-yellow-400 transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            Home
          </Link>
          <Link 
            to="/register"
            className="bg-white px-4 py-2 text-lg font-bold border-4 border-black rounded hover:bg-yellow-400 transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            Tambahkan User/Admin
          </Link>
        </div>
        <div>
          <button
            onClick={logout}
            className="bg-black text-white px-6 py-2 text-lg font-bold border-4 border-black rounded hover:bg-red-500 hover:text-black transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
