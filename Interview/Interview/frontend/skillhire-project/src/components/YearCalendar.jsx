import React, { useState } from "react";
import "./YearCalendar.css";

const YearCalendar = ({ interviewDates = [] }) => {
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
    <div className="calendar-box">
      <div className="calendar-header">
        <button onClick={handlePrev}>‹</button>
        <h3>{monthName} {currentYear}</h3>
        <button onClick={handleNext}>›</button>
      </div>

      <div className="weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {[...Array(firstDay)].map((_, i) => (
          <span key={i} />
        ))}

        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          return (
            <span
              key={day}
              className={`day 
                ${isToday(day) ? "today" : ""} 
                ${isInterviewDay(day) ? "interview" : ""}`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default YearCalendar;
