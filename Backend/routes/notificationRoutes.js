import express from "express";
import isProtected from "../middlewares/protected.js";
import * as notificationController from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get('/api/v1/notifications', isProtected, notificationController.getNotifications);
notificationRouter.post('/api/v1/notifications', isProtected, notificationController.createNotification);
notificationRouter.delete('/api/v1/notifications', isProtected, notificationController.clearNotifications);

export default notificationRouter;

