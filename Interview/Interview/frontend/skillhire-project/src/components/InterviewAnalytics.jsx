import "./InterviewAnalytics.css";

const InterviewAnalytics = () => {
  return (
    <div className="interview-analytics">
      <div className="analytics-box">
        <h4>Interview Performance Breakdown</h4>
        <ul>
          <li>Communication: <b>82%</b></li>
          <li>Technical Skills: <b>68%</b></li>
          <li>Confidence: <b>75%</b></li>
          <li>Problem Solving: <b>70%</b></li>
        </ul>
      </div>

      <div className="analytics-box">
        <h4>Recent Interview Feedback</h4>
        <p>✔ Strong introduction and clarity</p>
        <p>⚠ Improve algorithm explanation</p>
        <p>✔ Good eye contact & tone</p>
      </div>
    </div>
  );
};

export default InterviewAnalytics;
