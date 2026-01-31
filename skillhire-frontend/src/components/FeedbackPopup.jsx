import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./FeedbackPopup.css";

const FeedbackPopup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    onClose();
    navigate("/register"); // OR trigger auth modal
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-popup">
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Animated Girl */}
        <div className="girl-animation">
          <img src="/girl-feedback.png" alt="Feedback Girl" />
        </div>

        <h3>Enjoying SkillHire?</h3>
        <p>Your feedback helps us improve & help more students 🚀</p>

        <button className="feedback-btn" onClick={handleFeedbackClick}>
          Give Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackPopup;
