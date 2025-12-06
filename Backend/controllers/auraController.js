import User from "../models/User.js";

const badgeThresholds = [
  { points: 50, name: "Newbie" },
  { points: 100, name: "Striver" },
  { points: 150, name: "Achiever" },
  { points: 200, name: "Expert" },
  { points: 500, name: "Master" },
  { points: 1000, name: "Legend" },
];

const auraController = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.auraPoints += points;

      // Assign badges based on updated points
      badgeThresholds.forEach((badge) => {
        if (user.auraPoints >= badge.points && !user.badges.includes(badge.name)) {
          user.badges.push(badge.name);
        }
      });

      await user.save();
      console.log(`Added ${points} Aura Points to user: ${user.username}`);
      return user;
    }
  } catch (error) {
    console.error("Error updating Aura Points:", error);
  }
};

export default auraController;
