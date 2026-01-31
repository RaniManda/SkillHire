import React, { useState } from "react";
import { Star, X } from "lucide-react";
import "./FeedbackForm.css";

const FeedbackForm = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const feedbackData = {
      rating,
      comment,
    };

    onSubmit(feedbackData);
    onClose();
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h3>We’d Love Your Feedback 💙</h3>

        {/* ⭐ STAR RATING */}
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={28}
              onClick={() => setRating(star)}
              fill={star <= rating ? "#facc15" : "none"}
              stroke="#facc15"
              className="star"
            />
          ))}
        </div>

        {/* 📝 COMMENT */}
        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button
          className="submit-btn"
          disabled={rating === 0 || comment.trim() === ""}
          onClick={handleSubmit}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
