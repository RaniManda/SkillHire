import React, { useState } from "react";
import { Star, X } from "lucide-react";
import "./FeedbackForm.css";

const FeedbackForm = ({ onClose, onSubmit, user }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    const feedbackData = {
      rating,
      comment,
      name,
      email,
    };

    onSubmit(feedbackData);
    onClose();
  };

  const handleStarKey = (e, star) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setRating(star);
    }
    if (e.key === 'ArrowRight') setRating((prev) => Math.min(5, prev + 1));
    if (e.key === 'ArrowLeft') setRating((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h3>We’d Love Your Feedback 💙</h3>

        {/* ⭐ STAR RATING */}
        <div className="stars" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="star-btn"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onKeyDown={(e) => handleStarKey(e, star)}
              aria-label={`${star} star`}
              aria-checked={rating === star}
              role="radio"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <Star
                size={28}
                fill={star <= (hoverRating || rating) ? "#facc15" : "none"}
                stroke="#facc15"
                className="star"
              />
            </button>
          ))}
        </div>

        {/* NAME / EMAIL */}
        {!user && (
          <>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </>
        )}

        {/* 📝 COMMENT */}
        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button
          className="submit-btn"
          disabled={rating === 0 || comment.trim() === "" || (!user && (!name || !email))}
          onClick={handleSubmit}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
