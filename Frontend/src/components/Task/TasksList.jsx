import React from "react";
import { FaTrash } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteTaskAPI, listTasksAPI, updateTaskAPI } from "../../services/task/taskService";
import AlertMessage from "../Alert/AlertMessage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; 
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import badgeImage from "../../assets/newBie.jpg";
import striver from "../../assets/striver.jpg";
import risingStar from "../../assets/risingStar.jpg";
import paceseter from "../../assets/paceseter.jpg";
import legend from "../../assets/legend.jpg";
import trailBlind from "../../assets/trailBlind.jpg";
import trailBlozer from "../../assets/trailBlozer.jpg";
import masterMind from "../../assets/masterMind.jpg";
import axios from "axios";
import { BASE_URL } from "../../utils/url";

const TasksList = () => {

  const updateAuraPointsAndBadge = async () => {
    const badgeThresholds = [
      { points: 50, name: "Newbie", image: badgeImage },
      { points: 100, name: "Striver", image: striver },
      { points: 150, name: "Achiever", image: risingStar },
      { points: 200, name: "Expert", image: paceseter },
      { points: 500, name: "Master", image: legend },
      { points: 1000, name: "Trailblazer", image: trailBlind },
      { points: 2000, name: "Pioneer", image: trailBlozer },
      { points: 5000, name: "Mastermind", image: masterMind },
    ];

    const token = localStorage.getItem("token");
    try {
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      // // 1. Get updated Aura points
      // await axios.post(
      //   `${BASE_URL}/users/update-points`,
      //   {
      //     pointsToAdd: 10,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      toast.success("🎉 Task marked as Complete! 🪙 +10 Aura points");

      // Save notification to DB
      await axios.post(
        `${BASE_URL}/notifications`,
        { message: "🎉 Task marked as Complete! 🪙 +10 Aura points" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Get updated user profile
      const { data: userData } = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const points = userData.auraPoints || 0;
      const serverBadges = userData.badges || [];

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("userInfo")) || {};
      storedUser.auraPoints = points;
      storedUser.badges = serverBadges;
      localStorage.setItem("userInfo", JSON.stringify(storedUser));

      // 3. Get updated Badge
      const earnedBadge = badgeThresholds
        .slice()
        .reverse()
        .find(
          (badge) =>
            points >= badge.points && !serverBadges.includes(badge.name)
        );

      if (earnedBadge) {
        const updatedBadges = [...new Set([...serverBadges, earnedBadge.name])];

        // Save to MongoDB
        await axios.put(
          `${BASE_URL}/users/update-badges`,
          { badges: updatedBadges },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Optional: Send badge email
        await axios.post(`${BASE_URL}/send-badge-email`, {
          email: storedUser.email,
          badgeName: earnedBadge.name,
        });

        // Save notification to DB
        await axios.post(
          `${BASE_URL}/notifications`,
          { message: `🎉 You earned a new badge: ${earnedBadge.name}!` },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(`🏅 You just unlocked a badge: ${earnedBadge.name}`);
      }
    } catch (err) {
      console.error("Aura update or badge check failed:", err);
    }
  };

  const { data, isError, isLoading, error, refetch } = useQuery({
    queryFn: listTasksAPI,
    queryKey: ["list-tasks"],
  });

  // Calculate progress percentages
  const calculateTaskProgress = (tasks) => {
    if (!Array.isArray(tasks)) return { completed: 0, incomplete: 0 };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.type === "complete").length;
    const incompleteTasks = totalTasks - completedTasks;

    const completedPercentage = (completedTasks / totalTasks) * 100;
    const incompletePercentage = 100 - completedPercentage;

    return {
      completed: completedPercentage,
      incomplete: incompletePercentage
    };
  };

  const { completed, incomplete } = calculateTaskProgress(data);

  // Determine motivational message
  const getMotivationalMessage = () => {
    if (completed === 0) {
      return "Let's get started! You're capable of completing these tasks!";
    }
    if (completed <= 50) {
      return "Great progress! Keep going to complete more tasks!";
    }
    if (completed < 100) {
      return "You're almost there! Finish strong!";
    }
    return "Add Tasks to know your progress!";
  };

  // Navigate
  const navigate = useNavigate();

  // Mutation for delete
  const { mutateAsync: deleteTask } = useMutation({mutationFn:deleteTaskAPI});
  const { mutateAsync: updateTask } = useMutation({ mutationFn: updateTaskAPI });

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      refetch();
    } catch (e) {
      console.log("Error deleting task:", e);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (task) => {
    try {
      const newType = task.type === "complete" ? "complete" : "complete";
      const { updatedTask, updatedUser } = await updateTask({
        name: task.name,
        type: newType,
        id: task._id,
      });
  
      // Update localStorage with the new user data
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        userInfo.auraPoints = updatedUser.auraPoints;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
  
      
      updateAuraPointsAndBadge();
      refetch(); // Refresh task list
    } catch (e) {
      console.log("Error updating task:", e);
    }
  };
  
  // Sort tasks: incomplete first, then completed tasks
  const sortedTasks = Array.isArray(data)
    ? [
        ...data.filter((task) => task.type !== "complete"),
        ...data.filter((task) => task.type === "complete"),
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white p-10 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Tasks</h2>

      {/* Display motivational message */}
      <div className="bg-blue-100 p-4 rounded-md text-center mb-6">
        <p className="text-lg font-semibold text-blue-700">{getMotivationalMessage()}</p>
      </div>

      {/* Display alert message */}
      {isLoading && (
        <AlertMessage type="loading" message={"Loading Tasks..."} />
      )}
      {isError && (
        <AlertMessage
          type="error"
          message={
            error?.response?.data?.message ||
            "Something happened, please try again later"
          }
        />
      )}

      {/* Task Progress Section */}
      {Array.isArray(data) && data.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Task Completion Progress
          </h3>
          <div className="flex space-x-16 items-center justify-center">
            {/* Completed Tasks Donut Progress */}
            <div className="w-40 h-40">
              <CircularProgressbar
                value={completed}
                text={`${Math.round(completed)}%`}
                styles={{
                  path: {
                    stroke: "#4caf50", // Green for completed tasks
                    strokeLinecap: "round",
                  },
                  trail: {
                    stroke: "#e0e0e0", // Grey background for the circle
                  },
                  text: {
                    fill: "#4caf50", // Green text for percentage
                    fontSize: "30px", 
                  },
                }}
              />
              <span className="block text-center text-lg">Completed</span>
            </div>
            
            {/* Incomplete Tasks Donut Progress */}
            <div className="w-40 h-40">
              <CircularProgressbar
                value={incomplete}
                text={`${Math.round(incomplete)}%`}
                styles={{
                  path: {
                    stroke: "#f44336", // Red for incomplete tasks
                    strokeLinecap: "round",
                  },
                  trail: {
                    stroke: "#e0e0e0", // Grey background for the circle
                  },
                  text: {
                    fill: "#f44336", // Red text for percentage
                    fontSize: "30px", 
                  },
                }}
              />
              <span className="block text-center text-lg">Incomplete</span>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <ul className="space-y-6">
        {sortedTasks.map((task) => (
          <li
            key={task?._id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-md"
          >
            <div>
              <span className="text-gray-800 text-xl">{task?.name}</span>
              <span
                className={`ml-2 px-3 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  task.type === "complete"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {task?.type?.charAt(0).toUpperCase() + task?.type?.slice(1)}
              </span>
            </div>
            <div className="flex space-x-4">
              {/* Show Toggle button for all tasks */}
              <Switch
                checked={task.type === "complete"}
                onChange={() => task.type !== "complete" && handleToggleComplete(task)}
                className={`${task.type === "complete" ? "bg-green-500" : "bg-gray-200"} relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Toggle Task Completion</span>
                <span
                  className={`inline-block h-4 w-4 transform ${
                    task.type === "complete" ? "translate-x-6 bg-green-600" : "translate-x-1 bg-blue-500"
                  } rounded-full transition-transform`}
                />
              </Switch>
              <button
                onClick={() => handleDelete(task?._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
