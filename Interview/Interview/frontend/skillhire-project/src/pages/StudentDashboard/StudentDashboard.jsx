import "./StudentDashboard.css";
import YearCalendar from "../../components/YearCalendar";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import SkillScorePanel from "../../components/SkillScorePanel";
import DashboardGrids from "../../components/DashboardGrids";
import AnalyticsOverview from "../../components/AnalyticsOverview";
import InterviewActionSection from "../../components/InterviewActionSection";
import ActivitySuggestionSection from "../../components/ActivitySuggestionSection";
const interviewDates = [
  new Date(2026, 1, 12).toDateString(),
  new Date(2026, 1, 18).toDateString(),
];


const StudentDashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <Sidebar onLogout={onLogout} user={user} />

      {/* MAIN CONTENT */}
      <main className="content">
        {/* TOP BAR */}
        <Topbar
          username={user?.name || "Student"}
          onLogout={onLogout}
        />

        {/* SPACE BELOW TOPBAR */}
        <div className="dashboard-body">
          {/* SKILL SCORE PANEL */}
          <SkillScorePanel />

          {/* RESUME / INTERVIEW / STREAK / WEAK AREA */}
          <DashboardGrids />

          {/* ANALYTICS OVERVIEW CONTAINER */}
          <AnalyticsOverview />

          <InterviewActionSection />
          <ActivitySuggestionSection interviewDates={interviewDates} />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
