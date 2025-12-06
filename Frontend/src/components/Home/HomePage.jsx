import React from "react";
import {
  FaCheckCircle,
  FaSignInAlt,
  FaTasks,
  FaRegCalendarAlt,
  FaQuoteLeft,
  FaPuzzlePiece,
  FaRegFileAlt,
} from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold">Welcome to AuraTracker</h1>
          <p className="mt-4 text-xl">
            Turn your academic routine into a rewarding adventure with tasks,
            assignments, daily challenges, and aura points.
          </p>

          {/* Features */}
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12 mt-10">
            <div className="flex flex-col items-center">
              <FaTasks className="text-3xl" />
              <p className="mt-2">Add & Complete Tasks</p>
            </div>
            <div className="flex flex-col items-center">
              <FaRegFileAlt className="text-3xl" />
              <p className="mt-2">Submit Assignments</p>
            </div>
            <div className="flex flex-col items-center">
              <FaPuzzlePiece className="text-3xl" />
              <p className="mt-2">Daily Challenges</p>
            </div>
            <div className="flex flex-col items-center">
              <IoIosStats className="text-3xl" />
              <p className="mt-2">Earn Aura Points</p>
            </div>
          </div>

          {/* CTA */}
          {/* <Link to="/register">
            <button className="mt-10 px-6 py-3 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
              Get Started
            </button>
          </Link> */}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mt-2 max-w-3xl mx-auto">
          AuraTracker makes your student life productive and fun. Here’s how to
          get started:
        </p>

        <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <div className="p-4 rounded-full bg-blue-500 text-white mb-4">
              <FaSignInAlt className="text-2xl" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Sign Up</h3>
            <p className="text-gray-600">
              Create your account and set up your profile to start your academic
              journey
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <div className="p-4 rounded-full bg-green-500 text-white mb-4">
              <FaTasks className="text-2xl" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Add & Complete Tasks</h3>
            <p className="text-gray-600">
              Log tasks like studying or attending lectures. Check them off to
              earn aura points
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <div className="p-4 rounded-full bg-yellow-500 text-white mb-4">
              <FaRegFileAlt className="text-2xl" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Submit Assignments</h3>
            <p className="text-gray-600">
              Submit your assignments on time and get rewarded with aura points
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <div className="p-4 rounded-full bg-pink-500 text-white mb-4">
              <FaPuzzlePiece className="text-2xl" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Complete Daily Challenges
            </h3>
            <p className="text-gray-600">
              Boost your consistency with small daily challenges
            </p>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <div className="p-4 rounded-full bg-purple-600 text-white mb-4">
              <IoIosStats className="text-2xl" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Earn Aura Points</h3>
            <p className="text-gray-600">
              Everything you complete earns you aura points. Track your growth
              and level up!
            </p>
          </div>

          {/* Step 6 */}
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <div className="p-4 rounded-full bg-indigo-600 text-white mb-4">
              <FaRegCalendarAlt className="text-2xl" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Plan Your Week</h3>
            <p className="text-gray-600">
              Use the built-in timetable to stay organized across classes,
              tasks, and assignments.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 py-20 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Why Students Love AuraTracker
        </h2>
        <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaQuoteLeft className="text-xl text-gray-400" />
            <p className="mt-4">
              "AuraTracker turned my boring to-do list into something I actually
              enjoy completing."
            </p>
            <p className="mt-4 font-bold">- Priya Sharma</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaQuoteLeft className="text-xl text-gray-400" />
            <p className="mt-4">
              "Submitting assignments and getting points for it? Genius. I’ve
              never been more consistent!"
            </p>
            <p className="mt-4 font-bold">- Rahul Mehta</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Ready to Level Up Your Student Life?
          </h2>
          <p className="mt-4">
            Join AuraTracker today and start building your daily momentum.
          </p>
          {/* <Link to="/register">
            <button className="mt-8 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
              Sign Up Free
            </button>
          </Link> */}
          
          <p>Copyright © {new Date().getFullYear()} AuraTracker. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
