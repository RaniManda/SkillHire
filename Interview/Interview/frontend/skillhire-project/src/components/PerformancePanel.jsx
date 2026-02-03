import "./PerformancePanel.css";

const PerformancePanel = () => {
  return (
    <div className="performance-grid">

      {/* LEFT PANEL */}
      <div className="panel">
        <h4>Interview Performance</h4>

        <Progress label="Communication" value={82} />
        <Progress label="Technical Skills" value={68} />
        <Progress label="Confidence" value={75} />
        <Progress label="Problem Solving" value={70} />
      </div>

      {/* RIGHT PANEL */}
      <div className="panel">
        <h4>AI Feedback</h4>

        <div className="feedback good">
          ✔ Strong communication and clarity
        </div>

        <div className="feedback warn">
          ⚠ Needs improvement in algorithm explanation
        </div>

        <div className="feedback good">
          ✔ Good confidence and body language
        </div>
      </div>
    </div>
  );
};

const Progress = ({ label, value }) => (
  <div className="progress-item">
    <div className="progress-header">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default PerformancePanel;

