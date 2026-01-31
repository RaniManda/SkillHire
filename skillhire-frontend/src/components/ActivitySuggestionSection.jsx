import "./ActivitySuggestionSection.css";
import { Clock, BookOpen, Database, Layers } from "lucide-react";

const ActivitySuggestionSection = () => {
  return (
    <div className="activity-suggestion-section">

      {/* RECENT ACTIVITIES */}
      <div className="activity-card">
        <h4>Recent Activities</h4>

        <ul className="activity-list">
          <li>
            <Clock size={14} />
            <span>Completed Frontend Mock Interview</span>
            <small>2 hours ago</small>
          </li>

          <li>
            <Clock size={14} />
            <span>Updated Resume</span>
            <small>Yesterday</small>
          </li>

          <li>
            <Clock size={14} />
            <span>Practiced DSA Questions</span>
            <small>2 days ago</small>
          </li>
        </ul>
      </div>

      {/* SUGGESTED FOR YOU */}
      <div className="activity-card">
        <h4>Suggested For You</h4>

        <div className="suggestion-buttons">
          <button>
            <BookOpen size={16} />
            Review DSA Concepts
          </button>

          <button>
            <Layers size={16} />
            Improve System Design Skills
          </button>

          <button>
            <Database size={16} />
            Practice SQL
          </button>
        </div>
      </div>

    </div>
  );
};

export default ActivitySuggestionSection;
