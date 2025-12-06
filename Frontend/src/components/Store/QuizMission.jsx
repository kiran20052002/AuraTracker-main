import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/url";
import badgeImage from "../../assets/newBie.jpg";
import striver from "../../assets/striver.jpg";
import risingStar from "../../assets/risingStar.jpg";
import paceseter from "../../assets/paceseter.jpg";
import legend from "../../assets/legend.jpg";
import trailBlind from "../../assets/trailBlind.jpg";
import trailBlozer from "../../assets/trailBlozer.jpg";
import masterMind from "../../assets/masterMind.jpg";
import { toast } from "react-toastify";
const QuizMission = () => {
  const badgeThresholds = [
    { points: 50, name: "Newbie", image: badgeImage },
    { points: 100, name: "Striver", image: striver },
    { points: 150, name: "Achiever", image: risingStar },
    { points: 200, name: "Expert", image: paceseter },
    { points: 500, name: "Master", image: legend },
    { points: 1000, name: "Trailblazer", image: trailBlind },
    { points: 2000, name: "Pioneer", image: trailBlozer },
    { points: 5000, name: "Mastermind", image: masterMind },
  ];

  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  const userKey = user?.email || "guest";
  const today = new Date().toISOString().slice(0, 10);
  const quizStorageKey = `quiz_${userKey}_${today}`;
  const completionKey = `daily_challenge_done_${userKey}_${today}`;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quiz_" + today));
    if (saved) {
      setQuestion(saved);
    } else {
      axios
        .get("https://opentdb.com/api.php?amount=1&type=multiple&category=19")
        .then((res) => {
          const q = res.data.results[0];
          const answers = [q.correct_answer, ...q.incorrect_answers].sort(
            () => Math.random() - 0.5
          );
          const formatted = { ...q, answers };
          localStorage.setItem(quizStorageKey, JSON.stringify(formatted));
          setQuestion(formatted);
        })
        .catch((err) => {
          if (err.response?.status === 429) {
            alert("⚠️ Too many requests to quiz API. Try again later.");
          } else {
            console.error("Quiz fetch failed", err);
          }
        });
    }
  }, [quizStorageKey]);

   const saveMissionCompletion = async () => {
    if (!user || !user.email) return;
    try {
      await axios.post(
        `${BASE_URL}/missions/complete`,
        { missionKey: "daily_math_challenge_done", userEmail: user.email, date: today },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Mission save failed:", err);
    }
  };

  const check = async () => {
    localStorage.setItem(completionKey, "true");

    if (userAnswer === question.correct_answer) {
      setFeedback("🎉 Correct!");

      try {
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        // 1. Get updated Aura points
        await axios.post(
          `${BASE_URL}/users/update-points`,
          {
            pointsToAdd: 10,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Save notification to DB
        await axios.post(
          `${BASE_URL}/notifications`,
          { message: "🎉 Daily-Challenge Complete! 🪙 +10 Aura points Unlocked!" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(" 🎉 Daily-Challenge Complete! +10 Aura points Unlocked!");

        // 2. Get updated user profile
        const { data: userData } = await axios.get(
          `${BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const points = userData.auraPoints || 0;
        const serverBadges = userData.badges || [];

        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem("userInfo")) || {};
        storedUser.auraPoints = points;
        storedUser.badges = serverBadges;
        localStorage.setItem("userInfo", JSON.stringify(storedUser));

        // 3. Get updated Badge
        const earnedBadge = badgeThresholds
          .slice()
          .reverse()
          .find(
            (badge) =>
              points >= badge.points && !serverBadges.includes(badge.name)
          );

        if (earnedBadge) {
          const updatedBadges = [
            ...new Set([...serverBadges, earnedBadge.name]),
          ];

          // Save to MongoDB
          await axios.put(
            `${BASE_URL}/users/update-badges`,
            { badges: updatedBadges },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Optional: Send badge email
          await axios.post(`${BASE_URL}/send-badge-email`, {
            email: storedUser.email,
            badgeName: earnedBadge.name,
          });

          
          // Save notification to DB
          await axios.post(
            `${BASE_URL}/notifications`,
            { message: `🎉 You earned a new badge: ${earnedBadge.name}!` },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert(`🏅 You just unlocked a badge: ${earnedBadge.name}`);
        }

        await saveMissionCompletion();
      } catch (err) {
        console.error("Aura update or badge check failed:", err);
      }
    } else {
      setFeedback(`❌ Nope! Correct: ${question.correct_answer}`);
    }

    setTimeout(() => {
      navigate("/store", { replace: true });
    }, 1500);
  };

  return question ? (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="font-bold text-xl mb-2">Daily Quiz</h2>
      <p dangerouslySetInnerHTML={{ __html: question.question }} />
      <div className="mt-4 space-y-2">
        {question.answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => setUserAnswer(ans)}
            className={`block w-full text-left px-4 py-2 rounded ${
              ans === userAnswer ? "bg-blue-200" : "bg-gray-100"
            }`}
          >
            <span dangerouslySetInnerHTML={{ __html: ans }} />
          </button>
        ))}
      </div>

      <button
        onClick={check}
        disabled={!userAnswer || feedback}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit Answer
      </button>

      {feedback && <p className="mt-3">{feedback}</p>}
    </div>
  ) : (
    <p>Loading today's quiz...</p>
  );
};

export default QuizMission;
