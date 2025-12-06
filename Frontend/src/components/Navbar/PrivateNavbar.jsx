import { Fragment, useEffect, useState } from "react";
import { Disclosure, Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { SiAuthy } from "react-icons/si";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slice/authSlice";
import { HiSun, HiMoon } from "react-icons/hi";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
import axios from "axios";
import { BASE_URL } from "../../utils/url";
import badgeImage from "../../assets/newBie.jpg";
import striver from "../../assets/striver.jpg";
import risingStar from "../../assets/risingStar.jpg";
import paceseter from "../../assets/paceseter.jpg";
import legend from "../../assets/legend.jpg";
import trailBlind from "../../assets/trailBlind.jpg";
import trailBlozer from "../../assets/trailBlozer.jpg";
import masterMind from "../../assets/masterMind.jpg";
import { IoNotificationsOutline } from "react-icons/io5";
import { use } from "react";

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo") || null);
  const [auraPoints, setAuraPoints] = useState(user?.auraPoints || 0);
  const [badges, setBadges] = useState([]);
  const [latestBadge, setLatestBadge] = useState(null);
  const [badgePopupVisible, setBadgePopupVisible] = useState(false);
  const [earnedBadgesModal, setEarnedBadgesModal] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
    
  };

  const logoutHandler = () => {
    dispatch(logoutAction());
    localStorage.removeItem("userInfo");
    
    
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.style.backgroundColor = "#1a202c";
      document.body.style.color = "#e2e8f0";
    } else {
      document.body.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#1a202c";
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchAuraPoints = async () => {
      const token = getUserFromStorage();
      try {
        const response = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const points = response.data.auraPoints || 0;
        const serverBadges = response.data.badges || [];
        setAuraPoints(points);
        setBadges(serverBadges);

        // Update local storage for consistency
        const userData = JSON.parse(localStorage.getItem("userInfo")) || {};

        if (userData) {
          userData.auraPoints = points;
          userData.badges = serverBadges;
          localStorage.setItem("userInfo", JSON.stringify(userData));
        }
        updateBadge(points, serverBadges);
      } catch (error) {
        console.error("Error fetching Aura Points:", error);
      }
    };

    fetchAuraPoints();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const userData = JSON.parse(localStorage.getItem("userInfo"));
      setAuraPoints(userData?.auraPoints || 0);
      updateBadge(userData?.auraPoints || 0);

      // Reload notifications from localStorage
      const stored = JSON.parse(
        localStorage.getItem("auraNotifications") || "[]"
      );
      setNotifications(stored);
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const updateBadge = async (points, serverBadges = []) => {
    const earnedBadge = badgeThresholds
      .slice()
      .reverse()
      .find((badge) => points >= badge.points);

    const userData = JSON.parse(localStorage.getItem("userInfo")) || {};
    const storedBadges = userData.badges || [];

    if (earnedBadge && !storedBadges.includes(earnedBadge.name)) {
      setLatestBadge(earnedBadge);
      setBadgePopupVisible(true);

      // Update local storage and state
      const updatedBadges = [...new Set([...storedBadges, earnedBadge.name])];
      setBadges(updatedBadges);
      userData.badges = updatedBadges;
      localStorage.setItem("userInfo", JSON.stringify(userData));

      // Save earned badges to MongoDB
      try {
        const token = getUserFromStorage();
        await axios.put(
          `${BASE_URL}/users/update-badges`,
          { badges: updatedBadges },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Send email notification
        await axios.post(`${BASE_URL}/send-badge-email`, {
          email: userData.email, // Ensure email is available in localStorage
          badgeName: earnedBadge.name,
        });
      } catch (error) {
        console.error("Error updating badges or sending email:", error);
      }

      // Add badge notification
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const notifKey = user
        ? `auraNotifications_${user.email}`
        : "auraNotifications_guest";
      const stored = JSON.parse(localStorage.getItem(notifKey) || "[]");
      stored.unshift(`🎉 You earned a new badge: ${earnedBadge.name}!`);
      localStorage.setItem(notifKey, JSON.stringify(stored));
      setNotifications(stored);
    }
  };

  // Ensure latest badge persists on refresh
  const fetchLatestBadge = async () => {
    const userData = JSON.parse(localStorage.getItem("userInfo")) || {};
    const storedBadges = userData.badges || [];
    if (storedBadges.length > 0) {
      const latestEarnedBadge = badgeThresholds.find(
        (b) => b.name === storedBadges[storedBadges.length - 1]
      );
      setLatestBadge(latestEarnedBadge);
    }
  };

  


   // Fetch notifications from DB
  const fetchNotifications = async () => {
    const token = getUserFromStorage();
    if (!token) return;
    try {
      const response = await axios.get(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Clear notifications in DB
  const clearNotificationsHandler = async () => {
    const token = getUserFromStorage();
    if (!token) return;
    try {
      await axios.delete(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };


  useEffect(() => {
    fetchLatestBadge();
    fetchNotifications();
  }, []);

  return (
    <div>
      <Disclosure as="nav" className={darkMode ? "bg-gray-900" : "bg-white"}>
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-start items-center">
                <div className="flex justify-center flex-row w-full">
                  <div className="-ml-2 mr-2 flex items-left md:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                    <SiAuthy
                      className={
                        darkMode
                          ? "h-8 w-auto text-green-300"
                          : "h-8 w-auto text-green-500"
                      }
                    />
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <Link
                      to="/"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-300"
                          : "inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                      }
                    >
                      AuraTracker
                    </Link>
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <Link
                      to="/add-task"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-gray-400"
                          : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }
                    >
                      Add Tasks
                    </Link>
                    <Link
                      to="/tasks"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-gray-400"
                          : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }
                    >
                      Tasks
                    </Link>
                    <Link
                      to="/profile"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-gray-400"
                          : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-gray-400"
                          : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/assignment"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-gray-400"
                          : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }
                    >
                      Assignment
                    </Link>
                    <Link
                      to="/store"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-gray-400"
                          : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }
                    >
                      Store
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <Fragment>
                    <style>{`
                    @keyframes spin {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(360deg); }
                    }
                    .coin {
                    height: 24px;
                    width: 24px;
                    background: radial-gradient(circle, gold, orange);
                    border-radius: 50%;
                    display: inline-block;
                    animation: spin 2s linear infinite;
                    }
                  `}</style>
                    <div className="flex items-center ml-6 space-x-2">
                      <div className="coin"></div>
                      <span
                        className={
                          darkMode
                            ? "text-sm font-medium text-gray-300"
                            : "text-sm font-medium text-gray-900"
                        }
                      >
                        Aura Points: {auraPoints}
                      </span>
                    </div>
                  </Fragment>

                  {/* Notification Bell */}
                  
                  <div className="relative">
                    <button
                      className="relative"
                      onClick={() => setShowNotifications(!showNotifications)}
                      aria-label="Notifications"
                    >
                      <IoNotificationsOutline size={24} />
                      {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md z-50 max-h-96 overflow-y-auto">
                        <div className="p-4">
                          <h4 className="font-bold mb-2">Notifications</h4>
                          {notifications.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              No notifications.
                            </p>
                          ) : (
                            <ul>
                              {notifications.map((note, idx) => (
                                <li key={note._id || idx} className="mb-2 text-sm border-b pb-2 last:border-b-0">
                                  {note.message}
                                  <span className="block text-xs text-gray-400 mt-1">
                                    {note.createdAt
                                      ? new Date(note.createdAt).toLocaleString()
                                      : ""}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                          <button
                            className="mt-2 text-xs text-blue-600"
                            onClick={clearNotificationsHandler}
                            disabled={notifications.length === 0}
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {/* Display Aura Points */}

                    <button
                      onClick={logoutHandler}
                      type="button"
                      className={
                        darkMode
                          ? "relative m-2 inline-flex items-center gap-x-1.5 rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700"
                          : "relative m-2 inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                      }
                    >
                      <IoLogOutOutline className="h-5 w-5" aria-hidden="true" />
                      <span>Logout</span>
                    </button>
                  </div>
                  {/* <button
                    onClick={toggleTheme}
                    className="ml-4 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {darkMode ? (
                      <HiSun className="h-6 w-6" />
                    ) : (
                      <HiMoon className="h-6 w-6" />
                    )}
                  </button> */}
                  {latestBadge && (
                    <div className="relative">
                      <button
                        onClick={() => setEarnedBadgesModal(true)}
                        className="h-10 w-10 rounded-full bg-yellow-400 border-2 border-gray-800"
                        title="View Earned Badges"
                      >
                        <img
                          src={latestBadge.image}
                          alt="Badge"
                          className="rounded-full h-full w-full"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      {/* Badge Popup */}
      {badgePopupVisible && (
        <Dialog
          open={badgePopupVisible}
          onClose={() => setBadgePopupVisible(false)}
        >
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white p-6 rounded-lg shadow-md max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
                <p className="text-lg mb-4">
                  You have earned the "{latestBadge?.name}" badge!
                </p>
                <img
                  src={latestBadge?.image}
                  alt="Badge"
                  className="mx-auto w-32 h-32 rounded-full border border-gray-300 shadow-md"
                />
                <button
                  className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => setBadgePopupVisible(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Earned Badges Modal */}
      {earnedBadgesModal && (
        <Dialog
          open={earnedBadgesModal}
          onClose={() => setEarnedBadgesModal(false)}
        >
          <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 text-center relative"
              style={{
                backgroundImage: "url('/congratulation.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Your Earned Badges
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {badges.length > 0 ? (
                  badges.map((badgeName, index) => {
                    const badge = badgeThresholds.find(
                      (b) => b.name === badgeName
                    );
                    return (
                      <li
                        key={index}
                        className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setLatestBadge(badge)}
                      >
                        <img
                          src={badge?.image}
                          alt={badgeName}
                          className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-gray-300 shadow-lg"
                        />
                        <span className="text-lg text-gray-700 mt-2 font-semibold">
                          {badgeName}
                        </span>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-gray-600 text-lg">
                    No badges earned yet.
                  </li>
                )}
              </ul>
              <button
                className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg"
                onClick={() => setEarnedBadgesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
