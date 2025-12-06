import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { missions } from "./Missions";
import axios from "axios";
import { BASE_URL } from "../../utils/url";

const StorePage = () => {
  const navigate = useNavigate();
  const [completedMissions, setCompletedMissions] = useState([]);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");
  const today = new Date().toISOString().slice(0, 10);

  const fetchCompletedMissions = async () => {
    if (!user || !user.email) {
      setCompletedMissions([]);
      return;
    }
    try {
      const { data } = await axios.get(
        `${BASE_URL}/missions/completed?user=${user.email}&date=${today}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedMissions(data);
    } catch (err) {
      console.error("Failed to fetch completed missions:", err);
      setCompletedMissions([]);
    }
  };

  useEffect(() => {
    fetchCompletedMissions();
    window.addEventListener("focus", fetchCompletedMissions);
    return () => window.removeEventListener("focus", fetchCompletedMissions);
  }, []);

  const handleMissionClick = (path) => {
    navigate(path);
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white py-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold">Check-in Missions</h1>
        <p className="mt-2 text-gray-500">
          Earn points by completing these missions!
        </p>
      </div>
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {missions.map((mission, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transform transition hover:-translate-y-1"
          >
            <div className="text-yellow-500 text-5xl mb-3">🪙</div>
            <p className="text-lg font-semibold">{mission.title}</p>
            <p className="text-yellow-500 font-bold text-2xl mt-2">
              {mission.points}
            </p>
            {completedMissions.includes(mission.key) ? (
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-xl cursor-default"
                disabled
              >
                
                🎉 Task Completed!
              </button>
            ) : (
              <button
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600"
                onClick={() => handleMissionClick(mission.path)}
              >
                Go to mission ➡️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;
