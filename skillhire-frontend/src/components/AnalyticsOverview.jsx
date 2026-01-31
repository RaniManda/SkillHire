import React from "react";
import "./AnalyticsOverview.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const AnalyticsOverview = () => {
  const scoreData = {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [
      {
        data: [60, 68, 74, 82],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const interviewData = {
    labels: ["Technical", "Behavioral", "Problem Solving"],
    datasets: [
      {
        data: [78, 72, 65],
        backgroundColor: ["#2563eb", "#10b981", "#f59e0b"],
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="analytics-container">

      {/* HEADER */}
      <div className="analytics-header">
        <h3>Analytics Overview</h3>
        <p>Performance summary based on your activity</p>
      </div>

      <div className="analytics-divider" />

      {/* INNER GRID */}
      <div className="analytics-grid">

        {/* Score Overview */}
        <div className="analytics-box">
          <h4>Score Overview</h4>
          <Line
            data={scoreData}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, max: 100 } }
            }}
          />
        </div>

        {/* Interview Performance */}
        <div className="analytics-box">
          <h4>Interview Performance</h4>
          <Bar
            data={interviewData}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, max: 100 } }
            }}
          />
        </div>

        {/* Strengths */}
        <div className="analytics-box">
          <h4>Strengths & Areas to Improve</h4>

          <div className="strength strong">
            <span>DSA</span>
            <span>Strong</span>
          </div>

          <div className="strength average">
            <span>Communication</span>
            <span>Average</span>
          </div>

          <div className="strength weak">
            <span>System Design</span>
            <span>Needs Improvement</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsOverview;

