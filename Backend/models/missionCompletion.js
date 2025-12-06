import mongoose from "mongoose";
const missionCompletionSchema = new mongoose.Schema({
  missionKey: { type: String, required: true },
  userEmail: { type: String, required: true },
  date: { type: String, required: true },
  completed: { type: Boolean, default: true }
}, { timestamps: true });

missionCompletionSchema.index({ missionKey: 1, userEmail: 1, date: 1 }, { unique: true });

export default mongoose.model("MissionCompletion", missionCompletionSchema);    