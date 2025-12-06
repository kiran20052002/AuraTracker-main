import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db from "../lib/Firebase";

import "./style.css";

function SubmittedAssignments() {
  const { classId, postId } = useParams(); // Fix destructuring
  const navigate = useNavigate();
  const [submittedAssignments, setSubmittedAssignments] = useState([]);

  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      try {
        const snapshot = await db
          .collection("announcements")
          .doc(classId)
          .collection("posts")
          .doc(postId)
          .collection("assignments")
          .orderBy("timestamp", "desc")
          .get();

        setSubmittedAssignments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching submitted assignments:", error);
      }
    };
    fetchSubmittedAssignments();
  }, [classId, postId]);

  return (
    <div className="submissions-container">
      <h2>📄 Submitted Assignments</h2>

      {submittedAssignments.length === 0 ? (
        <p className="no-submissions">No submissions yet.</p>
      ) : (
        submittedAssignments.map((assignment) => (
          <div key={assignment.id} className="submission-card">
            <p>
              <strong>Submitted by:</strong> {assignment.uploaderEmail}
            </p>
            <div className="files-container">
              {assignment.fileUrls.map((fileUrl, index) => (
                <div key={index} className="file-preview">
                  {fileUrl.endsWith(".pdf") ? (
                    <a
                      href={`http://localhost:8000/${fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdf-link"
                    >
                      📑 View PDF
                    </a>
                  ) : (
                    // <img
                    //   src={`http://localhost:8000/${fileUrl}`}
                    //   alt="Submitted File"
                    //   className="submission-image"
                    // />

                    <a
                      href={`http://localhost:8000/${fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="submission-image"
                    >
                      📷 View Image
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p>
              📅 Submitted on:{" "}
              {new Date(assignment.timestamp.toDate()).toLocaleString()}
            </p>
          </div>
        ))
      )}

      <button className="back-button" onClick={() => navigate(-1)}>
        🔙 Go Back
      </button>
    </div>
  );
}

export default SubmittedAssignments;
