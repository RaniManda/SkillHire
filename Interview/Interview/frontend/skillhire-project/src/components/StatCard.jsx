import "./StatCard.css";

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="stat-card">
      <div className="icon">{icon}</div>
      <span>{title}</span>
      <h3>{value}</h3>
    </div>
  );
};

export default StatCard;

// import "./StatCard.css";

// const StatCard = ({ title, value, note }) => {
//   return (
//     <div className="stat-card">
//       <h4>{title}</h4>
//       <p>{value}</p>
//       <span>{note}</span>
//     </div>
//   );
// };

// export default StatCard;

