import MissionCompletion from '../models/missionCompletion.js';

export const completeMission = async (req, res) => {
  try {
    const { missionKey, userEmail, date } = req.body;
    if (!missionKey || !userEmail || !date) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    await MissionCompletion.findOneAndUpdate(
      { missionKey, userEmail, date },
      { missionKey, userEmail, date, completed: true },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Mission marked as completed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCompletedMissions = async (req, res) => {
  try {
    const { user, date } = req.query;
    if (!user || !date) {
      return res.status(400).json({ message: 'User and date are required.' });
    }
    const completions = await MissionCompletion.find({ userEmail: user, date });
    res.status(200).json(completions.map(c => c.missionKey));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
