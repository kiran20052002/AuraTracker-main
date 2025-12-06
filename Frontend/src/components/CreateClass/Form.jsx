import { Button, DialogActions, TextField } from "@mui/material";
import React, { useState } from "react";
import { useLocalContext } from "../../context/context";
import { v4 as uuidv4 } from "uuid";
import db from "../lib/Firebase";

const Form = () => {
  const {loggedInUser} = useLocalContext();
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");

  const { setCreateClassDialog, loggedInMail } = useLocalContext();

  const addClass = (e) => {
    e.preventDefault();

    if (!className.trim()) {
      alert("Class Name is required!");
      return;
    }

    const id = uuidv4();
    db.collection("CreatedClasses")
      .doc(loggedInMail)
      .collection("classes")
      .doc(id)
      .set({
        owner: loggedInMail,
        className: className.trim(),
        section: section.trim(),
        subject: subject.trim(),
        room: room.trim(),
        id: id,
        senderPhotoURL: loggedInUser?.photoURL || "", 
        timestamp: new Date(), 
        
      })
      .then(() => {
        setCreateClassDialog(false); 
      })
      .catch((error) => {
        console.error("Error creating class: ", error);
      });
  };

  return (
    <div className="form">
      <p className="class__title">Create Class</p>

      <div className="form__inputs">
        <TextField
          id="class-name"
          label="Class Name (required)"
          className="form__input"
          variant="filled"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <TextField
          id="section"
          label="Section"
          className="form__input"
          variant="filled"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        />
        <TextField
          id="subject"
          label="Subject"
          className="form__input"
          variant="filled"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          id="room"
          label="Room"
          className="form__input"
          variant="filled"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>

      <DialogActions>
        <Button onClick={addClass} color="primary">
          Create
        </Button>
      </DialogActions>
    </div>
  );
};

export default Form;
