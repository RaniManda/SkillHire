import React from "react";
import "./DetailedAnalytics.css";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const scoreData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Skill Score",
      data: [65, 70, 75, 80],
      fill: true,
      backgroundColor: "rgba(37, 99, 235, 0.2)",
      borderColor: "#2563eb",
      tension: 0.4,
    },
  ],
};

const interviewData = {
  labels: ["Technical", "Behavioral", "Problem Solving"],
  datasets: [
    {
      label: "Interview Scores",
      data: [80, 70, 60],
      backgroundColor: ["#2563eb", "#10b981", "#f59e0b"],
      borderRadius: 6,
    },
  ],
};

const strengthsData = [
  { type: "Problem Solving", value: "Strong" },
  { type: "Communication", value: "Average" },
  { type: "DSA Knowledge", value: "Strong" },
  { type: "Time Management", value: "Needs Improvement" },
];

const DetailedAnalytics = () => {
  return (
    <div className="detailed-analytics">
      <div className="analytics-grid">
        {/* 1. Score Overview */}
        <div className="analytics-card hover-card">
          <h4>Score Overview</h4>
          <Line data={scoreData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        {/* 2. Interview Performance */}
        <div className="analytics-card hover-card">
          <h4>Interview Performance</h4>
          <Bar
            data={interviewData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, max: 100 },
              },
            }}
          />
        </div>

        {/* 3. Strength & Areas to Improve */}
        <div className="analytics-card hover-card">
          <h4>Strengths & Weak Areas</h4>
          <ul className="strengths-list">
            {strengthsData.map((item, idx) => (
              <li key={idx} className={item.value === "Strong" ? "strong" : item.value === "Average" ? "average" : "weak"}>
                <span>{item.type}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;
