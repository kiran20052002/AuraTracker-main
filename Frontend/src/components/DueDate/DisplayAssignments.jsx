import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import db from "../lib/Firebase";
import "./style.css";

function DisplayAssignments({ classData }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [weekFilter, setWeekFilter] = useState("thisWeek");
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [loadingSubmitted, setLoadingSubmitted] = useState(false); // NEW

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!classData || !classData.id) return;

      try {
        const assignmentsRef = db
          .collection("announcements")
          .doc("classes")
          .collection(classData.id);

        const snapshot = await assignmentsRef.get();

        if (snapshot.empty) {
          setAssignments([]);
          return;
        }

        const fetchedAssignments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAssignments(fetchedAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [classData?.id]);

  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      if (!classData || !classData.id) return;

      setLoadingSubmitted(true); // START LOADING

      try {
        let submitted = [];
        for (const assignment of assignments) {
          const submittedRef = db
            .collection("announcements")
            .doc(classData.id)
            .collection("posts")
            .doc(assignment.id)
            .collection("assignments")
            .orderBy("timestamp", "desc");

          const snapshot = await submittedRef.get();
          if (!snapshot.empty) {
            snapshot.docs.forEach((doc) => {
              submitted.push({
                postId: assignment.id,
                id: doc.id,
                ...doc.data(),
              });
            });
          }
        }

        setSubmittedAssignments(submitted);
      } catch (error) {
        console.error("Error fetching submitted assignments:", error);
      }

      setLoadingSubmitted(false); // END LOADING
    };

    fetchSubmittedAssignments();
  }, [classData?.id, assignments]);

  const toDate = (timestampOrDate) => {
    if (!timestampOrDate) return null;
    if (timestampOrDate instanceof Date) return timestampOrDate;
    if (timestampOrDate.seconds) return new Date(timestampOrDate.seconds * 1000);
    return new Date(timestampOrDate);
  };

  useEffect(() => {
    const filterAssignments = () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const submittedIds = new Set(submittedAssignments.map((s) => s.postId));

      let filtered = [];

      if (tabIndex === 0) {
        filtered = assignments.filter((assignment) => {
          const dueDate = toDate(assignment.dueDate);
          const isSubmitted = submittedIds.has(assignment.id);
          const isPastDue = dueDate && dueDate < today;

          if (!dueDate || isSubmitted || isPastDue) return false;

          if (weekFilter === "thisWeek") {
            return dueDate >= startOfWeek && dueDate <= endOfWeek;
          } else if (weekFilter === "laterWeek") {
            return dueDate > endOfWeek;
          }
          return false;
        });
      } else if (tabIndex === 1) {
        filtered = assignments.filter((assignment) => {
          const dueDate = toDate(assignment.dueDate);
          const isSubmitted = submittedIds.has(assignment.id);
          const isPastDue = dueDate && dueDate < today;

          if (!dueDate || isSubmitted || !isPastDue) return false;

          if (weekFilter === "thisWeek") {
            return dueDate >= startOfWeek && dueDate < today;
          } else if (weekFilter === "earlier") {
            return dueDate < startOfWeek;
          }
          return false;
        });
      } else if (tabIndex === 2) {
        filtered = assignments.filter((assignment) => {
          const isSubmitted = submittedIds.has(assignment.id);
          if (!isSubmitted) return false;

          const submission = submittedAssignments.find(
            (s) => s.postId === assignment.id
          );
          if (!submission || !submission.timestamp) return false;

          const submittedDate = toDate(submission.timestamp);

          if (weekFilter === "thisWeek") {
            return submittedDate >= startOfWeek && submittedDate <= endOfWeek;
          } else if (weekFilter === "earlier") {
            return submittedDate < startOfWeek;
          }

          return false;
        });
      }

      setFilteredAssignments(filtered);
    };

    filterAssignments();
  }, [assignments, weekFilter, tabIndex, submittedAssignments]);

  return (
    <div className="assignments-container">
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingSubmitted}
      >
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Fetching assignments...</Typography>
        </div>
      </Backdrop>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(e, newIndex) => setTabIndex(newIndex)}
        className="tabs"
      >
        <Tab label="Assigned" />
        <Tab label="Missing" />
        <Tab label="Done" />
      </Tabs>

      {/* Filter Buttons */}
      <div className="assignments-section">
        <div className="toggle-buttons">
          <Button
            variant={weekFilter === "thisWeek" ? "contained" : "outlined"}
            onClick={() => setWeekFilter("thisWeek")}
          >
            This Week
          </Button>
          <Button
            variant={
              weekFilter === "earlier" || weekFilter === "laterWeek"
                ? "contained"
                : "outlined"
            }
            onClick={() =>
              setWeekFilter(tabIndex === 0 ? "laterWeek" : "earlier")
            }
          >
            {tabIndex === 0 ? "Later Weeks" : "Earlier"}
          </Button>
        </div>

        {/* Assignment Cards */}
        <div className="assignments-list">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="assignment-card">
                <CardContent>
                  <div className="assignment-header">
                    <Avatar
                      src={assignment.senderPhotoURL}
                      alt={assignment.sender}
                    />
                    <Typography variant="h6">{assignment.sender}</Typography>
                  </div>
                  <Typography variant="h6">{assignment.text}</Typography>
                  <Typography variant="body2">
                    {assignment.description}
                  </Typography>

                  {/* Date Labels */}
                  {tabIndex === 2 &&
                  submittedAssignments.some(
                    (s) => s.postId === assignment.id
                  ) ? (
                    submittedAssignments
                      .filter((s) => s.postId === assignment.id)
                      .map((sub) => {
                        const dueDate = toDate(assignment.dueDate);
                        const submittedDate = toDate(sub.timestamp);
                        const diffMs = dueDate - submittedDate;
                        const diffDays = Math.floor(
                          diffMs / (1000 * 60 * 60 * 24)
                        );
                        const diffHours = Math.floor(
                          (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                        );
                        const diffMinutes = Math.floor(
                          (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                        );
                        return (
                          <Typography
                            key={sub.id}
                            variant="caption"
                            className="success-text"
                          >
                            <CheckCircleOutline style={{ color: "green" }} />{" "}
                            Successfully Submitted {diffDays} days, {diffHours}{" "}
                            hours, and {diffMinutes} minutes before due date.
                          </Typography>
                        );
                      })
                  ) : tabIndex === 1 ? (
                    <Typography variant="caption" className="overdue-text">
                      Overdue: {toDate(assignment.dueDate).toLocaleString()}
                    </Typography>
                  ) : (
                    <Typography variant="caption">
                      Due: {toDate(assignment.dueDate).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No assignments found.</Typography>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayAssignments;
