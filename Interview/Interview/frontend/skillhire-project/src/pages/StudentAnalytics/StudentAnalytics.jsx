import "./StudentAnalytics.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const StudentAnalytics = ({ user, onLogout }) => {

  // 🔹 Dummy Data (replace with backend later)
  const scoreTrend = [
    { date: "Week 1", score: 60 },
    { date: "Week 2", score: 68 },
    { date: "Week 3", score: 72 },
    { date: "Week 4", score: 78 },
  ];

  const interviewPerformance = [
    { name: "Technical", score: 75 },
    { name: "Behavioral", score: 82 },
    { name: "Problem Solving", score: 70 },
  ];

  const skillRadar = [
    { skill: "DSA", value: 70 },
    { skill: "System Design", value: 60 },
    { skill: "SQL", value: 65 },
    { skill: "Java", value: 80 },
    { skill: "Communication", value: 78 },
  ];

  return (
    <div className="analytics-layout">
      <Sidebar onLogout={onLogout} user={user} />

      <main className="analytics-content">
        <Topbar username={user?.name || "Student"} onLogout={onLogout} />

        <div className="analytics-body">
          <h2>Detailed Performance Analytics</h2>

          {/* GRID 1 */}
          <div className="analytics-grid">

            {/* SCORE TREND */}
            <div className="analytics-card">
              <h4>Overall Score Trend</h4>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={scoreTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* INTERVIEW PERFORMANCE */}
            <div className="analytics-card">
              <h4>Interview Performance</h4>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={interviewPerformance}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* GRID 2 */}
          <div className="analytics-grid">

            {/* SKILL RADAR */}
            <div className="analytics-card">
              <h4>Skill Distribution</h4>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={skillRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <Radar
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* STRENGTHS & WEAK AREAS */}
            <div className="analytics-card">
              <h4>Strengths & Areas to Improve</h4>
              <ul className="strength-list">
                <li>✅ Java Fundamentals</li>
                <li>✅ Communication Skills</li>
                <li>⚠️ System Design</li>
                <li>⚠️ SQL Optimization</li>
              </ul>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default StudentAnalytics;
