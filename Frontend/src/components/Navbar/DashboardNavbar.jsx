// src/components/DashboardNavbar.js
import React from "react";
import { Link } from "react-router-dom";
import { FaBlackTie } from "react-icons/fa";

const DashboardNavbar = ({ user }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-white shadow-lg text-black">
      <div className="flex items-center p-4 gap-3">
        
        <nav className="flex items-center ml-auto">
          <Link
            to="/profile"
            className="mx-4 text-sm font-semibold hover:text-blue-600"
          >
            <h3>Home</h3>
          </Link>
          <Link
            to="/timetable"
            className="mx-4 text-sm font-semibold hover:text-blue-600"
          >
            <h3>Time Table</h3>
          </Link>
          <Link
            to="/exam-dashboard"
            className="mx-4 text-sm font-semibold hover:text-blue-600"
          >
            <h3>Examination</h3>
          </Link>
          
        </nav>
        
      </div>
    </header>
  );
};

export default DashboardNavbar;
