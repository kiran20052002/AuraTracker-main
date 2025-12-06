import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auraController from "./auraController.js";

const usersController = {
  // Register
  register: asyncHandler(async (req, res) => {
    const {
      username,
      email,
      password,
      mobileNo,
      semester,
      DOB,
      course,
      regnum,
    } = req.body;

    // Validate required fields
    if (
      !username ||
      !email ||
      !password ||
      !mobileNo ||
      !semester ||
      !DOB ||
      !course ||
      !regnum
    ) {
      throw new Error("Please fill all required fields");
    }

    // Check if user is already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already registered");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userCreated = await User.create({
      username,
      email,
      password: hashedPassword,
      mobileNo,
      semester,
      DOB,
      course,
      regnum,
      auraPoints: 0,
      badges: [],
    });

    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
      mobileNo: userCreated.mobileNo,
      semester: userCreated.semester,
      DOB: userCreated.DOB,
      course: userCreated.course,
      regnum: userCreated.regnum,
      auraPoints: userCreated.auraPoints,
      badges: userCreated.badges,
    });
  }),

  // Login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if email is valid
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, "appKey", {
      expiresIn: "30d",
    });

    res.json({
      message: "Login successful",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
      mobileNo: user.mobileNo,
      semester: user.semester,
      DOB: user.DOB,
      course: user.course,
      regnum: user.regnum,
      auraPoints: user.auraPoints,
      badges: user.badges,
    });
  }),

  // Profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    res.json({
      username: user.username,
      email: user.email,
      mobileNo: user.mobileNo,
      semester: user.semester,
      DOB: user.DOB,
      course: user.course,
      regnum: user.regnum,
      auraPoints: user.auraPoints,
      badges: user.badges,
    });
  }),

  // Change Password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save({ validateBeforeSave: false });

    res.json({ message: "Password changed successfully" });
  }),

  // Update User Profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const {
      email,
      username,
      mobileNo,
      semester,
      DOB,
      course,
      regnum,
      auraPoints,
      badges,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        email,
        username,
        mobileNo,
        semester,
        DOB,
        course,
        regnum,
        auraPoints,
        badges,
      },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      updatedUser: {
        username: updatedUser.username,
        email: updatedUser.email,
        mobileNo: updatedUser.mobileNo,
        semester: updatedUser.semester,
        DOB: updatedUser.DOB,
        course: updatedUser.course,
        regnum: updatedUser.regnum,
        auraPoints: updatedUser.auraPoints,
        badges: updatedUser.badges,
      },
    });
  }),

  // Daily Check-in Controller
  dailyCheckIn: asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    try {
      const user = await User.findById(req.user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const today = new Date().setHours(0, 0, 0, 0);
      const lastCheckDate = user.lastCheckIn
        ? new Date(user.lastCheckIn).setHours(0, 0, 0, 0)
        : null;

      if (lastCheckDate === today) {
        return res
          .status(200)
          .json({
            message: "Daily check-in already completed",
            auraPoints: user.auraPoints,
          });
      }

      user.auraPoints += 1;
      if (user.auraPoints === 50 && !user.badges.includes("First Badge")) {
        user.badges.push("First Badge");
      }
      user.lastCheckIn = new Date();
      await user.save();

      res
        .status(200)
        .json({
          message: "Daily check-in successful!",
          auraPoints: user.auraPoints,
          badges: user.badges,
        });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }),
  updateAuraPoints: asyncHandler(async (req, res) => {
    const { pointsToAdd } = req.body;

    if (!pointsToAdd) {
      return res.status(400).json({ message: "No points to add specified." });
    }

    const updatedUser = await auraController(req.user, pointsToAdd);

    res
      .status(200)
      .json({
        message: "Points updated successfully!",
        auraPoints: updatedUser.auraPoints,
        badges: updatedUser.badges,
      });
  }),
  updateBadges: asyncHandler(async (req, res) => {
    const { badges } = req.body;
    if (!Array.isArray(badges)) {
      return res.status(400).json({ message: "Invalid badges format" });
    }
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.badges = [...new Set([...user.badges, ...badges])];
    await user.save();
    res
      .status(200)
      .json({ message: "Badges updated successfully", badges: user.badges });
  }),


  

  
};

export default usersController;
