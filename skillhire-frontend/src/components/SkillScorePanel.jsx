import React, { useState } from "react";
import "./SkillScorePanel.css";

const SkillScorePanel = ({ readiness = 78, metrics = [
  { name: "DSA", score: 85 },
  { name: "System Design", score: 72 },
  { name: "Communication", score: 90 },
  { name: "Aptitude", score: 65 },
]}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="skill-score-panel" onClick={() => setExpanded(!expanded)}>
      {/* Badge */}
      <div className="panel-badge">Skill Score</div>

      {/* Main horizontal line */}
      <div className="readiness-container">
        <div className="readiness-number">{readiness}%</div>
        <div className="readiness-bar">
          <div
            className="readiness-bar-fill"
            style={{ width: `${readiness}%` }}
          ></div>
        </div>
        <div className="readiness-label">Almost Job Ready</div>
      </div>

      {/* Expanded metrics */}
      {expanded && (
        <div className="expanded-metrics">
          {metrics.map((metric, idx) => (
            <div key={idx} className="metric-row">
              <span className="metric-name">{metric.name}</span>
              <span className="metric-score">{metric.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillScorePanel;
