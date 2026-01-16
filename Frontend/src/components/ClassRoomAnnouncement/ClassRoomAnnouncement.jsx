import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, IconButton, Menu, MenuItem, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./style.css";
import db from "../lib/Firebase";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useLocalContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/url";

import badgeImage from "../../assets/newBie.jpg";
import striver from "../../assets/striver.jpg";
import risingStar from "../../assets/risingStar.jpg";
import paceseter from "../../assets/paceseter.jpg";
import legend from "../../assets/legend.jpg";
import trailBlind from "../../assets/trailBlind.jpg";
import trailBlozer from "../../assets/trailBlozer.jpg";
import masterMind from "../../assets/masterMind.jpg";
import { toast } from "react-toastify";

const ClassRoomAnnouncement = ({ classData, onEdit, onSubmissionChange }) => {
  const navigate = useNavigate();
  const { loggedInMail } = useLocalContext();
  const [announcement, setAnnouncement] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const isAdmin = loggedInMail === classData?.owner;

  
  const handleMenuOpen = (event, announcement) => {
    setAnchorEl(event.currentTarget);
    setSelectedAnnouncement(announcement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAnnouncement(null);
  };

  const handleDelete = () => {
    if (selectedAnnouncement?.id) {
      db.collection("announcements")
        .doc("classes")
        .collection(classData.id)
        .doc(selectedAnnouncement.id)
        .delete()
        .then(() => console.log("Announcement deleted"))
        .catch((error) => console.error("Error deleting announcement:", error));
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedAnnouncement) {
      onEdit(selectedAnnouncement);
    }
    handleMenuClose();
  };

  const checkSubmission = async (postId) => {
    try {
      const snapshot = await db
        .collection("announcements")
        .doc(classData.id)
        .collection("posts")
        .doc(postId)
        .collection("assignments")
        .where("uploaderEmail", "==", loggedInMail)
        .get();

      const isSubmitted = !snapshot.empty;
      setSubmittedAssignments((prev) => ({
        ...prev,
        [postId]: isSubmitted,
      }));
      if (onSubmissionChange) {
        onSubmissionChange(postId, isSubmitted);
      }
    } catch (error) {
      console.error("Error checking submission:", error);
    }
  };

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

      // 1. Get updated Aura points
      await axios.post(
        `${BASE_URL}/users/update-points`,
        {
          pointsToAdd: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("🪙 +10 Aura Points Unlocked!");

      // Save notification to DB
      await axios.post(
        `${BASE_URL}/notifications`,
        { message: "🎉 Assignment Submission Complete! 🪙 +10 Aura Points Unlocked!" },
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

        alert(`🏅 You just unlocked a badge: ${earnedBadge.name}`);
      }
    } catch (err) {
      console.error("Aura update or badge check failed:", err);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUploadAssignment = async (postId) => {
    if (selectedFiles.length === 0) {
      alert("Please select a file first.");
      return;
    }

    try {
      let fileUrls = [];
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));

      const response = await axios.post(
        `${BASE_URL}/upload`,
        formData
      );

      if (!response.data.fileUrls || response.data.fileUrls.length === 0) {
        alert("File upload failed! Please check the server.");
        return;
      }

      fileUrls = response.data.fileUrls;

      await db
        .collection("announcements")
        .doc(classData.id)
        .collection("posts")
        .doc(postId)
        .collection("assignments")
        .add({
          fileUrls: fileUrls,
          uploaderEmail: loggedInMail,
          timestamp: new Date(),
        });

      setSubmittedAssignments((prev) => ({
        ...prev,
        [postId]: true,
      }));
      if (onSubmissionChange) {
        onSubmissionChange(postId, true);
      }

      setSelectedFiles([]);
      toast.success("🎊 Assignment Upload: SUCCESS!");

      // Update Aura points and badge
      updateAuraPointsAndBadge();
    } catch (error) {
      console.error("Error uploading assignment:", error);
      alert("Failed to upload assignment. Please try again.");
    }
  };

  useEffect(() => {
    if (classData) {
      const unsubscribe = db
        .collection("announcements")
        .doc("classes")
        .collection(classData.id)
        .orderBy("timestamp", "desc")
        .onSnapshot(
          (snap) => {
            const newAnnouncements = snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setAnnouncement(newAnnouncements);
            newAnnouncements.forEach((item) => {
              if (!(item.id in submittedAssignments)) {
                checkSubmission(item.id);
              }
            });
          },
          (error) => console.error("Error fetching announcements:", error)
        );
      return () => unsubscribe();
    }
  }, [classData]);

  return (
    <div>
      {announcement.map((item) => {
        const currentDate = new Date();
        const dueDate = item.dueDate ? new Date(item.dueDate) : null;
        const isOverdue = dueDate && currentDate > dueDate;
        const admin = classData?.owner;
        const isAdmin = loggedInMail === admin;
        return (
          <div className="amt" key={item.id}>
            <div className="amt__Cnt">
              <div className="amt__top">
                <Avatar src={item.senderPhotoURL} alt={item.sender} />
                <div>{item.sender}</div>
                <IconButton
                  aria-controls="announcement-menu"
                  aria-haspopup="true"
                  onClick={(e) => handleMenuOpen(e, item)}
                >
                  <MoreVertIcon />
                </IconButton>

                {/* {item.sender === loggedInMail  && (
                  <IconButton
                    aria-controls="announcement-menu"
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )} */}
              </div>
              <p className="amt__txt">{item.text}</p>
              {item.fileUrls && item.fileUrls.length > 0 && (
                <div className="amt__files">
                  {item.fileUrls.map((fileUrl, index) => {
                    const fileExtension = fileUrl
                      .split(".")
                      .pop()
                      .toLowerCase();
                    //const filePath = `${import.meta.env.VITE_BACKEND_URL}/${fileUrl}`;
                    const filePath = fileUrl;
                    if (["jpg", "jpeg", "png"].includes(fileExtension)) {
                      return (
                        <img
                          key={index}
                          className="amt__img"
                          src={filePath}
                          alt={`Announcement file ${index}`}
                        />
                      );
                    } else if (fileExtension === "pdf") {
                      return (
                        <div key={index} className="amt__pdf">
                          <a
                            href={filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <PictureAsPdfIcon
                              style={{ color: "red", fontSize: "5rem" }}
                            />
                          </a>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              )}
              {isAdmin && item.sender === loggedInMail && (
                <button
                  className="view-submissions-btn"
                  onClick={() =>
                    navigate(`/submissions/${classData.id}/${item.id}`)
                  }
                >
                  View Submitted Assignments
                </button>
              )}

              {isAdmin && item.sender !== loggedInMail && <></>}

              {!isAdmin && item.sender !== loggedInMail && (
                <div className="amt__upload">
                  {submittedAssignments[item.id] ? (
                    <p className="submission-success">
                      🎯 Submission Successful! 
                    </p>
                  ) : isOverdue ? (
                    <p className="overdue-message">
                      ⏰ Cannot submit. The due date has passed.
                    </p>
                  ) : (
                    <>
                      <input type="file" multiple onChange={handleFileChange} />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUploadAssignment(item.id)}
                      >
                        Upload Assignment
                      </Button>
                    </>
                  )}
                </div>
              )}
              <div className="amt__time">
                {new Date(item.timestamp?.toDate()).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
      <Menu
        id="announcement-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default ClassRoomAnnouncement;