import express from "express";
import isProtected from "../middlewares/protected.js";
import {completeMission, getCompletedMissions} from "../controllers/missionController.js";

const missionRouter = express.Router();

missionRouter.post("/api/v1/missions/complete",isProtected, completeMission);
missionRouter.get("/api/v1/missions/completed",isProtected, getCompletedMissions);

export default missionRouter;