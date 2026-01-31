

import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="f-card">
      <div className="f-icon">{icon}</div>
      <h3>{title}</h3>
      <p className="f-desc">{description}</p>
    </div>
  );
};

export default FeatureCard;