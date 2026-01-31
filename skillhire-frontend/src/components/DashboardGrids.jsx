import React from "react";
import "./DashboardGrids.css";
import { FileText, MessageSquare, Zap, AlertCircle } from "lucide-react";

const grids = [
  { title: "Resume Score", icon: <FileText size={24} />, value: 85, type: "progress" },
  { title: "Interview Score", icon: <MessageSquare size={24} />, value: 78, type: "progress" },
  { title: "Practice Streak", icon: <Zap size={24} />, value: 60, type: "progress" },
  { title: "Weak Area", icon: <AlertCircle size={24} />, value: "System Design", type: "static" },
];

const DashboardGrids = () => {
  return (
    <div className="dashboard-grids">
      {grids.map((grid, idx) => (
        <div key={idx} className="grid-card">
          <div className="grid-icon">{grid.icon}</div>
          <div className="grid-info">
            <h4>{grid.title}</h4>
            {grid.type === "progress" ? (
              <>
                <div className="progress-line">
                  <div className="progress-fill" style={{ width: `${grid.value}%` }}></div>
                </div>
                <p>{grid.value}%</p>
              </>
            ) : (
              <p>{grid.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardGrids;

