import "./RecruiterDashboard.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const RecruiterDashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard recruiter-dashboard">
      {/* SIDEBAR */}
      <Sidebar onLogout={onLogout} user={user} />

      {/* MAIN CONTENT */}
      <main className="content">
        {/* TOP BAR */}
        <Topbar username={user?.name || "Recruiter"} onLogout={onLogout} />

        {/* BODY */}
        <div className="dashboard-body">
          <section className="recruiter-hero">
            <h1>Recruiter Dashboard</h1>
            <p>Manage candidates, interviews, and hiring pipelines in one place.</p>
          </section>

          <section className="recruiter-stats">
            <div className="stat-card">
              <h3>Open Roles</h3>
              <span>12</span>
            </div>
            <div className="stat-card">
              <h3>Applicants</h3>
              <span>248</span>
            </div>
            <div className="stat-card">
              <h3>Interviews</h3>
              <span>36</span>
            </div>
            <div className="stat-card">
              <h3>Offers</h3>
              <span>8</span>
            </div>
          </section>

          <section className="recruiter-grid">
            <div className="recruiter-panel">
              <h2>Upcoming Interviews</h2>
              <p>Track and schedule candidate interviews for this week.</p>
            </div>
            <div className="recruiter-panel">
              <h2>Top Candidates</h2>
              <p>Review high-potential candidates matched to your roles.</p>
            </div>
            <div className="recruiter-panel">
              <h2>Pipeline Health</h2>
              <p>Monitor stage-wise conversion and time-to-hire metrics.</p>
            </div>
            <div className="recruiter-panel">
              <h2>Recent Activity</h2>
              <p>See latest applications, feedback, and status updates.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;

