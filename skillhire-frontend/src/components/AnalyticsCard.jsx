import "./AnalyticsCard.css";

const AnalyticsCard = ({ title }) => {
  return (
    <div className="analytics-card">
      <h4>{title}</h4>
      <div className="chart-placeholder">
        Chart goes here
      </div>
    </div>
  );
};

export default AnalyticsCard;
