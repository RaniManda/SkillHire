// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./InterviewPreparationDashboard.css";
// import {
//   Code,
//   Lightbulb,
//   BookOpen,
//   Mic,
//   History,
//   ArrowRight,
// } from "lucide-react";

// const InterviewPreparationDashboard = () => {
//   // eslint-disable-next-line no-unused-vars
//   const navigate = useNavigate();

//   return (
//     <div className="ip-dashboard">
//       <h2 className="ip-title">Interview Preparation</h2>
//       <p className="ip-subtitle">
//         Prepare smarter with practice, guidance, and mock interviews
//       </p>

//       {/* ===== TOP GRID ===== */}
//       <div className="ip-grid">
//         {/* PRACTICE QUESTIONS */}
//         <div className="ip-card">
//           <Code className="ip-icon" />
//           <h3>Practice Questions</h3>
//           <p>DSA, System Design & Technical questions</p>
//           <button onClick={() => alert("Practice Questions Coming Soon")}>
//             Start Practice <ArrowRight size={16} />
//           </button>
//         </div>

//         {/* TIPS & GUIDES */}
//         <div className="ip-card">
//           <Lightbulb className="ip-icon" />
//           <h3>Tips & Guides</h3>
//           <p>Interview strategies & best practices</p>
//           <button onClick={() => alert("Tips & Guides Coming Soon")}>
//             View Guides <ArrowRight size={16} />
//           </button>
//         </div>

//         {/* STUDY RESOURCES */}
//         <div className="ip-card">
//           <BookOpen className="ip-icon" />
//           <h3>Study Resources</h3>
//           <p>Curated learning materials</p>
//           <button onClick={() => alert("Resources Coming Soon")}>
//             Explore Resources <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>

//       {/* ===== SECOND ROW ===== */}
//       <div className="ip-grid">
//         {/* MOCK INTERVIEW */}
//         <div className="ip-card highlight">
//           <Mic className="ip-icon" />
//           <h3>Take a Mock Interview</h3>
//           <p>AI-powered real interview simulation</p>
//           <button
//             className="primary-btn"
//             onClick={() => alert("Mock Interview Coming Soon")}
//           >
//             Start Mock Interview
//           </button>
//         </div>

//         {/* PAST INTERVIEWS */}
//         <div className="ip-card">
//           <History className="ip-icon" />
//           <h3>Past Interviews</h3>
//           <p>Review your previous interview attempts</p>
//           <button onClick={() => alert("Past Interviews Coming Soon")}>
//             View History <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewPreparationDashboard;



import React, { useEffect, useState } from "react";
import "./InterviewPreparationDashboard.css";
import {
  Flame,
  Code2,
  Timer,
  PlayCircle,
  BookOpen,
  Mic,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const topics = [
  { name: "Arrays", total: 40, progress: 65 },
  { name: "Strings", total: 30, progress: 40 },
  { name: "Linked List", total: 25, progress: 55 },
  { name: "Trees", total: 35, progress: 30 },
  { name: "Graphs", total: 20, progress: 20 },
  { name: "Dynamic Programming", total: 45, progress: 10 },
];

const InterviewPreparation = () => {
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [streak, setStreak] = useState(7);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins mock timer

  /* ================= MOCK TIMER ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="prep-container">
      {/* ===== HEADER ===== */}
      <div className="prep-header">
        <h1>Interview Preparation</h1>
        <p>Practice smarter. Track progress. Crack interviews 🚀</p>
      </div>

      {/* ===== STATS BAR ===== */}
      <div className="prep-stats">
        <div className="stat-card">
          <Flame className="icon fire" />
          <div>
            <h3>{streak} Days</h3>
            <p>Daily Streak</p>
          </div>
        </div>

        <div className="stat-card">
          <Code2 className="icon blue" />
          <div>
            <h3>120+</h3>
            <p>Questions Practiced</p>
          </div>
        </div>

        <div className="stat-card">
          <BookOpen className="icon purple" />
          <div>
            <h3>6</h3>
            <p>Topics Covered</p>
          </div>
        </div>
      </div>

      {/* ===== TOPIC GRID ===== */}
      <h2 className="section-title">DSA Practice</h2>

      <div className="topic-grid">
        {topics.map((t, i) => (
          <div key={i} className="topic-card">
            <h3>{t.name}</h3>
            <p>{t.total} Questions</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${t.progress}%` }}
              />
            </div>

            <span>{t.progress}% Completed</span>

            <button
              onClick={() => navigate("/student/dsa-practice")}
              className="start-btn"
            >
              <PlayCircle size={18} />
              Start Practice
            </button>
          </div>
        ))}
      </div>

      {/* ===== MOCK INTERVIEW ===== */}
      <h2 className="section-title">Mock Interview</h2>

      <div className="mock-card">
        <div className="mock-left">
          <Timer className="timer-icon" />
          <h1>{formatTime()}</h1>
          <p>Interview Timer</p>
        </div>

        <div className="mock-right">
          <h3>AI Mock Interview</h3>
          <p>
            Answer real interview questions with voice & text.
            Get instant feedback.
          </p>

          <button
            className="mock-btn"
            onClick={() => navigate("/student/mock-interview")}
          >
            <Mic size={18} />
            Start Mock Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPreparation;
