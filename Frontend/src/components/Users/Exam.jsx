import React from "react";
import { Link } from "react-router-dom";

const ExamDashboard = () => {
  return (
    <div>
      <header>
        <Link to="/dashboard">
          
          <h3>Home</h3>
        </Link>
        <Link to="/timetable" className="active" onClick={() => timeTableAll()}>
          
          <h3>Time Table</h3>
        </Link>
        <Link to="/examdashboard">
          
          <h3>Examination</h3>
        </Link>
        <Link to="/password">
          
          <h3>Change Password</h3>
        </Link>
        <Link to="/logout">
          
          <h3>Logout</h3>
        </Link>
        <div id="profile-btn" style={{ display: "none" }}>
          <span className="material-icons-sharp">person</span>
        </div>
        <div className="theme-toggler">
          <span className="material-icons-sharp active">light_mode</span>
          <span className="material-icons-sharp">dark_mode</span>
        </div>
      </header>

      <main>
        <div className="exam timetable">
          <h2>Exam Available</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Room no.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>13 May 2022</td>
                <td>09-12 AM</td>
                <td>CS200</td>
                <td>38-718</td>
              </tr>
              <tr>
                <td>16 May 2022</td>
                <td>09-12 AM</td>
                <td>DBMS130</td>
                <td>38-718</td>
              </tr>
              <tr>
                <td>18 May 2022</td>
                <td>09-12 AM</td>
                <td>MTH166</td>
                <td>38-718</td>
              </tr>
              <tr>
                <td>20 May 2022</td>
                <td>09-12 AM</td>
                <td>NS200</td>
                <td>38-718</td>
              </tr>
              <tr>
                <td>23 May 2022</td>
                <td>09-12 AM</td>
                <td>CS849</td>
                <td>38-718</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <script src="./services/dashboard/app.js"></script>
    </div>
  );
};

// Helper function (mock)
const timeTableAll = () => {
  console.log("Time Table Button Clicked");
};

export default ExamDashboard;
