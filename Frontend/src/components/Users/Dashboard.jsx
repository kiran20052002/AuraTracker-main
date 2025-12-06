// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../Alert/AlertMessage";
import { AiOutlinePlus, AiOutlineUpload } from "react-icons/ai";
import {
  listSubjectsAPI,
  deleteSubjectAPI,
  updateSubjectAPI,
} from "../../services/attendance/attendanceService";
import DashboardNavbar from "../Navbar/DashboardNavbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await listSubjectsAPI();
        setSubjects(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
      }
    };

    fetchSubjects();
  }, []);

  const handleDelete = (id) => {
    if (id) {
      deleteSubjectAPI(id)
        .then(() => {
          setSubjects(subjects.filter((subject) => subject._id !== id));
        })
        .catch(() => {
          alert("Error deleting subject");
        });
    } else {
      alert("Invalid subject ID");
    }
  };

  const handleEdit = (subject) => {
    if (!subject || !subject._id) {
      alert("Subject data is missing or invalid.");
      return;
    }
    navigate(`/add-subject/${subject._id}`);
  };

  const user = JSON.parse(localStorage.getItem("userInfo") || null);

  return (
    <div className="bg-white text-black min-h-screen flex flex-col font-sans">
      <DashboardNavbar user={user} />

      <div className="flex gap-6 pt-16 px-6 pb-8 flex-1">
        <aside className="w-72 bg-gray-100 p-6 rounded-xl shadow-xl">
          <div className="text-center">
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-blue-500">
              <span style={{ fontSize: "80px" }}>👤</span>
              
            </div>
            <h2 className="mt-4 text-xl font-bold">
              Hey, <span className="text-blue-600">{user.username}</span>
            </h2>
            <p className="text-sm text-gray-500">{user.regnum}</p>
          </div>

          <div className="mt-8 space-y-4 text-sm">
            <div>
              <h5 className="font-semibold text-gray-700">Course</h5>
              <p className="text-gray-600">{user.course}</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700">Semester</h5>
              <p className="text-gray-600">{user.semester}</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700">DOB</h5>
              <p className="text-gray-600">
                {new Date(user.DOB).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700">Contact</h5>
              <p className="text-gray-600">{user.mobileNo}</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700">Email</h5>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-6">
            📊 Your Attendance Overview
          </h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="bg-white text-black p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full">
                    {subject.credit} Credits
                  </span>
                  <span className="text-sm text-gray-500">
                    {subject.subjectCode}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold">{subject.subject}</h3>
                <h2 className="text-xl font-semibold mt-2">
                  {`${subject.attendedClasses}/${subject.totalClasses}`} Classes
                </h2>

                <div className="relative mt-4 w-20 h-20 mx-auto">
                  <svg className="w-full h-full text-blue-500">
                    <circle
                      cx="38"
                      cy="38"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        36 *
                        ((100 -
                          (subject.attendedClasses / subject.totalClasses) *
                            100) /
                          100)
                      }
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <p className="text-lg font-bold">
                      {(
                        (subject.attendedClasses / subject.totalClasses) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 justify-center">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded-lg shadow"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <p className="text-xs text-center mt-2 text-gray-500">
                  Last Updated
                </p>
              </div>
            ))}

            <div
              className="bg-white text-gray-700 border border-dashed border-gray-400 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={() => navigate("/add-subject")}
            >
              <AiOutlinePlus className="text-4xl mb-2" />
              <h3 className="text-lg font-medium">Add Subject</h3>
            </div>
          </div>
        </main>
      </div>

      <AlertMessage />
    </div>
  );
};

export default Dashboard;
