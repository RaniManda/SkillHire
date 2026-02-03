


import React from "react";
import { Star, Heart, MessageSquare } from "lucide-react";
import "./Testimonials.css";
import Lottie from "lottie-react";





const defaultTestimonials = [
  {
    name: "Sanjana",
    role: "Recent Graduate",
    comment: "The resume builder helped me identify gaps I didn’t even know existed.",
    rating: 5,
  },
  {
    name: "Sharath Chandra",
    role: "4th Year IT Student",
    comment: "The platform helped me balance technical details with clear explanations.",
    rating: 5,
  },
  {
    name: "Karthik",
    role: "Final Year Student",
    comment: "Mock interviews made me confident before the real one.",
    rating: 4,
  },
  {
    name: "Abhiram",
    role: "Final Year ECE Student",
    comment: "AI feedback was honest and constructive.",
    rating: 5,
  },
];

const Testimonials = ({ onAuth, onGiveFeedback, testimonials = defaultTestimonials }) => {
  return (
    <section className="testimonials-section">      {/* HEADER */}
      <div className="testimonials-header">
        <h2>What Our Users Say</h2>
        <p>Real feedback from learners using SkillHire</p>
      </div>


      {/* SINGLE ROW TESTIMONIALS */}
     <div className="testimonials-row scrollable-row">
  {testimonials.map((item, index) => (
    <div className="testimonial-card" key={index}>
      <div className="stars">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} size={16} fill="#facc15" stroke="none" />
        ))}
      </div>

      <p className="testimonial-text">“{item.comment}”</p>

      <div className="testimonial-user">
        <div className="avatar">{item.name ? item.name.charAt(0) : 'U'}</div>
        <div>
          <h4>{item.name}</h4>
          <span>{item.role || ""}</span>
        </div>
      </div>
    </div>
  ))}
  <div className="testimonial-card stats-card">
    <h3>70%</h3>
    <p>Interview Success Rate</p>
  </div>
</div>


      {/* GIRL FEEDBACK SECTION */}
      <div className="feedback-girl-section">
        {/* REVIEW ANIMATION */}
        <div className="reviews-animation-wrapper">
  <Lottie
    path="/lottie/reviews.json"
    loop
    autoplay
  />
</div>


        <div className="feedback-text-card">
          <h3>We’d Love Your Feedback <span className="floating-heart">💙</span></h3>
          <p>
            Help us improve SkillHire by sharing your experience.
          </p>
          {/* <button onClick={() => onAuth("register")}>
            Give Feedback
          </button> */}
<button onClick={() => onGiveFeedback ? onGiveFeedback() : onAuth("register", "feedback")}> 
  Give Feedback
</button>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;

