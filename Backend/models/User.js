import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNo: { type: String, required: true },
  semester: { type: Number, required: true },
  DOB: { type: Date, required: true },
  course: { type: String, required: true },
  regnum: { type: String, required: true, unique: true },
  auraPoints: { type: Number, default: 0 },
  lastCheckIn: { type: Date, default: null },
  badges: { type: [String], default: [] },
  
});

export default mongoose.model("User", userSchema);
