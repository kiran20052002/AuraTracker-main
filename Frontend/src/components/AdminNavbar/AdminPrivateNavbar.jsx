import { Fragment, useEffect, useState } from "react";
import { Disclosure, Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { SiAuthy } from "react-icons/si";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slice/authSlice";
import { HiSun, HiMoon } from "react-icons/hi";
import { FaUserShield } from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const admin = JSON.parse(localStorage.getItem("adminInfo") || null);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };

  const logoutHandler = () => {
    dispatch(logoutAction());
    localStorage.removeItem("adminInfo");
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
                      to="/adminPage/profile"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-gray-400"
                          : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }
                    >
                      Profile
                    </Link>

                    <Link
                      to="/adminPage/assignment"
                      className={
                        darkMode
                          ? "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-gray-400"
                          : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }
                    >
                      Assignment
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
                  </Fragment>

                  <div className="flex items-center space-x-1">
                    <FaUserShield className={"text-green-600 h-12 w-11"} />

                    <span className={"text-xs font-bold text-gray-700"}>
                      Hey, Admin
                    </span>
                  </div>

                  <div className="flex-shrink-0">
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
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
