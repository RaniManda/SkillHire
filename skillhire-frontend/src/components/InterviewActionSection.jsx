import "./InterviewActionSection.css";
import { PlayCircle, BookOpen, FileText, ClipboardList } from "lucide-react";

const InterviewActionSection = () => {
  return (
    <div className="interview-action-section">

      {/* 1. Interview Preparation */}
      <div className="action-card">
        <h4>Interview Preparation</h4>

        <div className="prep-buttons">
          <button><ClipboardList size={16} /> Practice Questions</button>
          <button><BookOpen size={16} /> Tips & Guides</button>
          <button><FileText size={16} /> Study Resources</button>
        </div>
      </div>

      {/* 2. Mock Interview */}
      <div className="action-card center">
        <h4>Take a Mock Interview</h4>
        <p>Experience a real AI-powered interview.</p>

        <button className="mock-btn">
          <PlayCircle size={18} />
          Start Mock Interview
        </button>
      </div>

      {/* 3. Past Interviews */}
      <div className="action-card">
        <h4>Past Interviews</h4>

        <ul className="past-interviews">
          <li>
            <span>Frontend Developer</span>
            <span className="score">78%</span>
          </li>
          <li>
            <span>Java Backend</span>
            <span className="score">82%</span>
          </li>
          <li>
            <span>DSA Interview</span>
            <span className="score">74%</span>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default InterviewActionSection;
