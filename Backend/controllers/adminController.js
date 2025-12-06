import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminsController = {
  // Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please fill all required fields");
    }

    // Check if admin is already registered
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      res.status(400);
      throw new Error("Admin already registered");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const adminCreated = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({
      username: adminCreated.username,
      email: adminCreated.email,
      id: adminCreated._id,
    });
  }),

  // Login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if email is valid
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Invalid email");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }

    // Generate token
    const token = jwt.sign({ id: admin._id }, "appKey", {
      expiresIn: "30d",
    });

    res.json({
      message: "Login successful",
      token,
      id: admin._id,
      email: admin.email,
      username: admin.username,
    });
  }),

  // Profile
  profile: asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user);
    if (!admin) {
      throw new Error("Admin not found");
    }

    res.json({
      username: admin.username,
      email: admin.email,
    });
  }),

  // Change Password
  changeAdminPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    const admin = await Admin.findById(req.user);
    if (!admin) {
      throw new Error("Admin not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    admin.password = hashedPassword;
    await admin.save({ validateBeforeSave: false });

    res.json({ message: "Password changed successfully" });
  }),

  // Update Admin Profile
  updateAdminProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user,
      {
        email,
        username,
      },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      updatedAdmin: {
        username: updatedAdmin.username,
        email: updatedAdmin.email,
      },
    });
  }),
};

export default adminsController;
