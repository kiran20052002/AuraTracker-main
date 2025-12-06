// controllers/timetableController.js
import Timetable from '../models/Timetable.js';

// Get timetable for a specific user and day
export const getTimetableByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const userId = req.user._id;

    const timetable = await Timetable.findOne({ user: userId, day });
    if (!timetable) return res.status(404).json({ message: 'No timetable found for this day' });
    // Sort schedule by startTime
    timetable.schedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update timetable for a day
export const updateTimetable = async (req, res) => {
  try {
    const { day, schedule } = req.body;
    const userId = req.user._id;

    const updatedTimetable = await Timetable.findOneAndUpdate(
      { user: userId, day },
      { schedule },
      { new: true, upsert: true }
    );
    res.json(updatedTimetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a subject to the timetable
export const addSubject = async (req, res) => {
  try {
    const { day } = req.params; // ✅ correctly read from URL
    const { startTime, endTime, room, subject, type } = req.body;
    const userId = req.user._id;

    let timetable = await Timetable.findOne({ user: userId, day });

    // If no timetable exists yet for this day, create one
    if (!timetable) {
      timetable = new Timetable({
        user: userId,
        day,
        schedule: [],
      });
    }

    timetable.schedule.push({ startTime, endTime, room, subject, type });
    await timetable.save();

    timetable.schedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.status(201).json(timetable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete a subject from the timetable
// Delete a subject from the timetable
export const deleteSubject = async (req, res) => {
  try {
    const { day, subjectId } = req.params; // ✅ correct: both from URL
    const userId = req.user._id;

    const timetable = await Timetable.findOne({ user: userId, day });
    if (!timetable) return res.status(404).json({ message: "Timetable not found." });

    const index = timetable.schedule.findIndex(subject => subject._id == subjectId);
    if (index > -1) {
      timetable.schedule.splice(index, 1);
      await timetable.save();
      return res.json({ message: "Subject deleted successfully." });
    }

    return res.status(404).json({ message: "Subject not found." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
