import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

// GET /api/notifications - get all notifications for user
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// POST /api/notifications - create a notification
export const createNotification = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }
  // Add this validation
  if (!req.user?._id) {
    res.status(401);
    throw new Error("User authentication failed");
  }
  const notification = new Notification({
    userId: req.user._id,
    message,
  });
  await notification.save();
  res.status(201).json(notification);
});

// DELETE /api/notifications - clear all notifications
export const clearNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });
  res.json({ message: "Notifications cleared" });
});
