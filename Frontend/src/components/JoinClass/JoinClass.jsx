import React, { useState } from "react";
import { Button, Dialog, Slide, TextField, Avatar } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useLocalContext } from "../../context/context";
import db from "../lib/Firebase";
import "./style.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JoinClass = () => {
  const { joinClassDialog, setJoinClassDialog, loggedInUser } = useLocalContext();

  const [classCode, setClassCode] = useState("");
  const [email, setEmail] = useState("");
  const [classError, setClassError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!classCode.trim() || !email.trim()) {
      setClassError(!classCode.trim());
      setEmailError(!email.trim());
      return;
    }

    try {
      // Check if the class exists
      const classDoc = await db
        .collection("CreatedClasses")
        .doc(email)
        .collection("classes")
        .doc(classCode)
        .get();

      if (!classDoc.exists || classDoc.data().owner === loggedInUser.email) {
        setClassError(true);
        return;
      }

      const joinedData = classDoc.data();

      // Check if the class is already joined
      const alreadyJoined = await db
        .collection("JoinedClasses")
        .doc(loggedInUser.email)
        .collection("classes")
        .doc(classCode)
        .get();

      if (alreadyJoined.exists) {
        alert("You have already joined this class!");
        return;
      }

      // Join the class
      await db
        .collection("JoinedClasses")
        .doc(loggedInUser.email)
        .collection("classes")
        .doc(classCode)
        .set(joinedData);

      setJoinClassDialog(false); // Close dialog on success
    } catch (error) {
      console.error("Error joining class:", error);
    }
  };

  return (
    <Dialog
      fullScreen
      open={joinClassDialog}
      onClose={() => setJoinClassDialog(false)}
      TransitionComponent={Transition}
    >
      <div className="joinClass">
        <div className="joinClass__wrapper">
          <div
            className="joinClass__wraper2"
            onClick={() => setJoinClassDialog(false)}
          >
            <Close className="joinClass__svg" />
            <div className="joinClass__topHead">Join Class</div>
          </div>
          <div>
            <Button
              className="joinClass__btn"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Join
            </Button>
          </div>
        </div>
        <div className="joinClass__form">
          <p className="joinClass__formText">
            You're currently signed in as {loggedInUser?.email}
          </p>
          <div className="joinClass__loginInfo">
            <div className="joinClass__classLeft">
              <Avatar src={loggedInUser?.photoURL} />
              <div className="joinClass__loginText">
                <div className="joinClass__loginName">{loggedInUser?.displayName}</div>
                <div className="joinClass__loginEmail">{loggedInUser?.email}</div>
              </div>
            </div>
            <Button variant="outlined" color="primary">
              Logout
            </Button>
          </div>
        </div>
        <div className="joinClass__form">
          <div
            style={{ fontSize: "1.25rem", color: "#3c4043" }}
            className="joinClass__formText"
          >
            Class Code
          </div>
          <div
            style={{ color: "#3c4043", marginTop: "-5px" }}
            className="joinClass__formText"
          >
            Ask your teacher for the class code, then enter it here.
          </div>
          <div className="joinClass__loginInfo">
            <TextField
              id="class-code"
              label="Class Code"
              variant="outlined"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              error={classError}
              helperText={classError && "Invalid class code"}
            />
            <TextField
              id="owner-email"
              label="Owner's email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError && "Invalid email"}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default JoinClass;
