import asyncHandler from "express-async-handler";
import Exam from "../models/Exam.js";
const examController = {
  //! Add a new subject
  create: asyncHandler(async (req, res) => {
    const { subject, date,roomNo } = req.body;
    if (!subject || !date || !roomNo) {
      throw new Error("Subject name, date,room number are required");
    }
    // Convert the subject name to lowercase
    const normalizedSubject = subject.toLowerCase();
    
    //! Check if the subject already exists for the user
    const subjectExists = await Exam.findOne({
      subject: normalizedSubject,
      user: req.user,
    });
    if (subjectExists) {
      throw new Error(
        `Subject ${subjectExists.subject} already exists in the database`
      );
    }
    //! Create the subject
    const newSubject = await Exam.create({
      subject: normalizedSubject,
      user: req.user,
      date,
      roomNo,
    });
    res.status(201).json(newSubject);
  }),

  //! List all subjects for the user
  lists: asyncHandler(async (req, res) => {
    const subjects = await Exam.find({ user: req.user });
    res.status(200).json(subjects);
  }),

  //! Get a specific subject by ID
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subject = await Exam.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    if (subject.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "User not authorized to view this subject" });
    }
    res.status(200).json(subject);
  }),

  //! Update a subject by ID
  update: asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const { date,roomNo } = req.body;
    const subjectToUpdate = await Exam.findById(subjectId);

    if (!subjectToUpdate) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (subjectToUpdate.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "User not authorized to update this subject" });
    }

    //! Update subject properties
    subjectToUpdate.date = date ?? subjectToUpdate.date;
    subjectToUpdate.roomNo = roomNo ?? subjectToUpdate.roomNo;

    const updatedSubject = await subjectToUpdate.save();
    res.status(200).json(updatedSubject);
  }),

  //! Delete a subject by ID
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params; // Capture the ID from the URL
    console.log("Subject ID to delete:", id); // Log the ID to verify it's being passed correctly

    const subject = await Exam.findById(id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (subject.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "User not authorized to delete this subject" });
    }

    try {
      await Exam.findByIdAndDelete(id);
      res.status(200).json({ message: "Subject removed successfully" });
    } catch (error) {
      console.error("Error deleting subject:", error); // Log the error for debugging
      res.status(500).json({ message: "An error occurred while deleting the subject" });
    }
  }),
};

export default examController;