import React from "react";
import "./FeedbackSuccess.css";

const FeedbackSuccess = ({ onClose }) => {
  return (
    <div className="feedback-toast" role="status" aria-live="polite">
      <div className="toast-content">
        <strong>feedback sent successfully</strong>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">×</button>
    </div>
  );
};

export default FeedbackSuccess;
