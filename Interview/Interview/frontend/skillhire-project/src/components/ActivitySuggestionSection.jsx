import React, { useState } from "react";
import "./ActivitySuggestionSection.css";
import {
  Clock,
  BookOpen,
  Database,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ActivitySuggestionSection = ({ interviewDates = [] }) => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" }
  );

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isInterviewDay = (day) => {
    const date = new Date(currentYear, currentMonth, day).toDateString();
    return interviewDates.includes(date);
  };

  return (
    <div className="activity-grid">

      {/* RECENT ACTIVITIES */}
      <div className="activity-card">
        <h4>Recent Activities</h4>

        <ul className="activity-list">
          <li>
            <Clock size={14} />
            <span>Completed Frontend Mock Interview</span>
            <small>2h ago</small>
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
          <button><BookOpen size={16} /> Review DSA Concepts</button>
          <button><Layers size={16} /> Improve System Design</button>
          <button><Database size={16} /> Practice SQL</button>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="activity-card calendar-card">
        <div className="calendar-header">
          <button onClick={handlePrev}>‹</button>
          <h4>{monthName} {currentYear}</h4>
          <button onClick={handleNext}>›</button>
        </div>

        <div className="calendar-days">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="calendar-dates">
          {[...Array(firstDay)].map((_, i) => (
            <span key={i} />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            return (
              <span
                key={day}
                className={`
                  ${isToday(day) ? "active-day" : ""} 
                  ${isInterviewDay(day) ? "interview" : ""}`}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ActivitySuggestionSection;
