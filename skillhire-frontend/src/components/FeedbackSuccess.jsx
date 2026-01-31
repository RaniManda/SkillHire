import React from "react";
import "./FeedbackSuccess.css";

const FeedbackSuccess = ({ onClose }) => {
  return (
    <div className="success-overlay">
      <div className="success-modal">
        <h3>Thank You! 💙</h3>
        <p>Your feedback helps us improve SkillHire.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FeedbackSuccess;
