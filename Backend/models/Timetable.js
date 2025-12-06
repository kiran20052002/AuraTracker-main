// models/Timetable.js
import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, required: true },
});

const timetableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true },
  schedule: [scheduleSchema],
});

export default mongoose.model('Timetable', timetableSchema);