import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "./components/Home/HomePage";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import RegistrationForm from "./components/Users/Register";
import LoginForm from "./components/Users/Login";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import { getUserFromStorage } from "./utils/getUserFromStorage";
import { useSelector } from "react-redux";
import UserProfile from "./components/Users/UserProfile";
import AuthRoute from "./components/Auth/AuthRoute";
import AddTask from "./components/Task/AddTask";
import TasksList from "./components/Task/TasksList";
import UpdateTask from "./components/Task/UpdateTask";
import Dashboard from "./components/Users/Dashboard";
import ExamDashboard from "./components/Users/Exam";
import AssignmentHeader from "./components/Header/AssignmentHeader";
import ClassRoomLogin from "./components/ClassRoomLogin/ClassRoomLogin";
import { IsUserRedirect, ProtectedRoute } from "./routes/Routes";
import { useLocalContext } from "./context/context";
import { useState, useEffect } from "react";
import db from "./components/lib/Firebase";
import JoinedClasses from "./components/JoindedClasses/JoinedClasses";
import Main from "./components/Main/Main";
import AddSubject from "./components/Attendance/AddSubject";
import ExamList from "./components/Exam/ExamList";
import StorePage from "./components/Store/StorePage";
import { BASE_URL } from "./utils/url";
import axios from "axios";
import SubmittedAssignments from "./components/SubmittedAssignments/SubmittedAssignments";
import DisplayAssignments from "./components/DueDate/DisplayAssignments";
import QuizMission from "./components/Store/QuizMission";
import QuizMissionCS from "./components/Store/QuizMissionCS";

import AddSubjectForm from "./components/TimeTable/AddSubjectForm";
import TimetableView from "./components/TimeTable/TimetableView";
import AdminAuthRoute from "./components/Auth/AdminAuthRoute";
import AdminRegistrationForm from "./components/Admin/AdminRegister";
import AdminLoginForm from "./components/Admin/AdminLogin";
import AdminPrivateNavbar from "./components/AdminNavbar/AdminPrivateNavbar";
import AdminProfile from "./components/Admin/AdminProfile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function App() {
  const token = getUserFromStorage();
  const user = useSelector((state) => state?.auth?.user);
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const { loggedInMail } = useLocalContext();
  console.log(token);
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  // const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (loggedInMail) {
      let unsubscribe = db
        .collection("CreatedClasses")
        .doc(loggedInMail)
        .collection("classes")
        .onSnapshot((snapshot) => {
          setCreatedClasses(snapshot.docs.map((doc) => doc.data()));
        });
      return () => unsubscribe();
    }
  }, [loggedInMail]);

  console.log(createdClasses);

  useEffect(() => {
    if (loggedInMail) {
      let unsubcribe = db
        .collection("JoinedClasses")
        .doc(loggedInMail)
        .collection("classes")
        .onSnapshot((snapshot) => {
          setJoinedClasses(snapshot.docs.map((doc) => doc.data()));
        });
      return () => unsubcribe();
    }
  }, [loggedInMail]);
  console.log(joinedClasses);

  // Function to save check-in mission completion to DB
  const saveCheckInMissionCompletion = async () => {
    if (!token || !user?.email) return;
    try {
      await axios.post(
        `${BASE_URL}/missions/complete`,
        {
          missionKey: "checkin_done",
          userEmail: user.email,
          date: new Date().toISOString().slice(0, 10),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to save check-in mission completion:", err);
    }
  };

  useEffect(() => {
    const checkInUser = async () => {
      if(adminInfo) return; // Skip check-in for admin users
      if (!user || !token || !user?.email) return;

      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
      const key = `checkin_done_${user?.email || "guest"}_${today}`;

      const alreadyCheckedIn = localStorage.getItem(key);
      if (alreadyCheckedIn === "true") {
        return; // Already checked in today
      }

      try {
        // Fetch current aura points before check-in
        const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const oldAuraPoints = profileResponse.data.auraPoints;

        // Perform daily check-in
        const checkInResponse = await axios.post(
          `${BASE_URL}/users/daily-check`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newAuraPoints = checkInResponse.data.auraPoints;

        // Show alert only if points have increased
        if (newAuraPoints > oldAuraPoints) {
          toast.success(`🎉 Daily Check-in Complete! 🪙 +1 Aura point Unlocked!`);

          // Mark check-in in localStorage
          localStorage.setItem(key, "true");

          // Save notification to DB
          await axios.post(
            `${BASE_URL}/notifications`,
            { message: "🎉 Daily Check-in Complete! 🪙 +1 Aura point Unlocked!" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // Save check-in mission completion to DB
        await saveCheckInMissionCompletion();
      } catch (error) {
        console.error(
          "Daily check-in failed:",
          error.response?.data?.message || "Server error"
        );
      }
    };

    checkInUser();
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <PublicNavbar />
              <HeroSection />
            </>
          }
        />

        {/* User registartion */}
        <Route
          path="/register"
          element={
            <>
              <PublicNavbar />
              <RegistrationForm />
            </>
          }
        />

        {/* User login */}
        <Route
          path="/login"
          element={
            <>
              <PublicNavbar />
              <LoginForm />
            </>
          }
        />

        <Route
          path="/adminPage/login"
          element={
            <>
              <PublicNavbar />
              <AdminLoginForm />
            </>
          }
        />

        <Route
          path="/adminPage/register"
          element={
            <>
              <PublicNavbar />
              <AdminRegistrationForm />
            </>
          }
        />

        {/* Authenticated Routes */}
        <Route
          path="/add-task"
          element={
            <AuthRoute>
              <>
                <PrivateNavbar />
                <AddTask />
              </>
            </AuthRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <AuthRoute>
              <>
                <PrivateNavbar />
                <TasksList />
              </>
            </AuthRoute>
          }
        />
        <Route
          path="/store"
          element={
            <AuthRoute>
              <>
                <PrivateNavbar />
                <StorePage />
              </>
            </AuthRoute>
          }
        />

        <Route
          path="/update-task/:id"
          element={
            <AuthRoute>
              <>
                <PrivateNavbar />
                <UpdateTask />
              </>
            </AuthRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <AuthRoute>
              <>
                <PrivateNavbar />
                <UserProfile />
              </>
            </AuthRoute>
          }
        />

        <Route
          path="/adminPage/profile"
          element={
            <AdminAuthRoute>
              <>
                <AdminPrivateNavbar />
                <AdminProfile />
              </>
            </AdminAuthRoute>
          }
        />

        

        {/* Dashboard Route Without Private Navbar */}
        <Route
          path="/classroomlogin"
          element={
            <IsUserRedirect user={loggedInMail} loggedInPath="/assignment">
              <ClassRoomLogin />
            </IsUserRedirect>
          }
        />
        <Route
          path="/assignment"
          element={
            <ProtectedRoute user={loggedInMail}>
              {/* <PrivateNavbar /> */}
              <AssignmentHeader />
              <ol className="joined">
                {createdClasses.map((item) => (
                  <JoinedClasses classData={item} />
                ))}
                {joinedClasses.map((item) => (
                  <JoinedClasses classData={item} />
                ))}
              </ol>
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminPage/assignment"
          element={
            <ProtectedRoute user={loggedInMail}>
              {/* <AdminPrivateNavbar /> */}
              <AssignmentHeader />
              <ol className="joined">
                {createdClasses.map((item) => (
                  <JoinedClasses classData={item} />
                ))}
                {joinedClasses.map((item) => (
                  <JoinedClasses classData={item} />
                ))}
              </ol>
            </ProtectedRoute>
          }
        />

        {/* Dashboard Route Without Private Navbar */}
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />

        <Route
          path="/add-subject"
          element={
            <AuthRoute>
              <>
                {/* <PrivateNavbar /> */}
                <AddSubject />
              </>
            </AuthRoute>
          }
        />
        <Route
          path="/add-subject/:id"
          element={
            <AuthRoute>
              <>
                <PrivateNavbar />
                <AddSubject />
              </>
            </AuthRoute>
          }
        />
        <Route
          path="/exam-dashboard"
          element={
            <AuthRoute>
              <ExamList />
            </AuthRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <AuthRoute>
              <TimetableView />
            </AuthRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <AuthRoute>
              <>
                <PrivateNavbar />
                <TasksList />
              </>
            </AuthRoute>
          }
        />
        <Route
          path="/update-task/:id"
          element={
            <AuthRoute>
              <>
                <PrivateNavbar />
                <UpdateTask />
              </>
            </AuthRoute>
          }
        />

        {/* Dynamic Routes for Created Classes */}
        {createdClasses.map((item, index) => (
          <Route
            key={index}
            path={`/${item.id}`}
            element={
              <ProtectedRoute user={loggedInMail}>
                {/* <PrivateNavbar /> */}
                <Main classData={item} />
              </ProtectedRoute>
            }
          />
        ))}

        {/* Dynamic Routes for Joined Classes */}
        {joinedClasses.map((item, index) => (
          <Route
            key={index}
            path={`/${item.id}`}
            element={
              <ProtectedRoute user={loggedInMail}>
                {/* <PrivateNavbar /> */}
                <Main classData={item} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route
          path="/submissions/:classId/:postId"
          element={
            <ProtectedRoute user={loggedInMail}>
              <SubmittedAssignments />
            </ProtectedRoute>
          }
        />

        {/* {createdClasses.map((item, index) => (
            <Route
              key={index}
              path="/upcoming"
              element={
                <ProtectedRoute user={loggedInMail}>
                  
                  <DisplayAssignments classData={item} />
                </ProtectedRoute>
              }
            />
          ))} */}

        {/* only for the users due dates of the assignments are displayed(i.e joined users) */}
        {joinedClasses.map((item, index) => (
          <Route
            key={index}
            path="/upcoming"
            element={
              <ProtectedRoute user={loggedInMail}>
                <DisplayAssignments classData={item} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="/daily-math-challenge" element={<QuizMission />} />
        <Route path="/daily-cs-challenge" element={<QuizMissionCS />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        toastClassName="!w-[400px] !text-sm !break-words" 
      />
    </BrowserRouter>
  );
}

export default App;
