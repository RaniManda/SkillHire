import "./AnalyticsSummary.css";

const AnalyticsSummary = () => {
  return (
    <div className="analytics-summary">
      <div className="summary-card green">
        <h4>Overall Skill Score</h4>
        <p>78 / 100</p>
        <span>↑ 6% this month</span>
      </div>

      <div className="summary-card blue">
        <h4>Interviews Taken</h4>
        <p>12</p>
        <span>Last: 2 days ago</span>
      </div>

      <div className="summary-card orange">
        <h4>Strong Area</h4>
        <p>Communication</p>
        <span>Consistent scores</span>
      </div>

      <div className="summary-card red">
        <h4>Weak Area</h4>
        <p>DSA</p>
        <span>Needs practice</span>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
