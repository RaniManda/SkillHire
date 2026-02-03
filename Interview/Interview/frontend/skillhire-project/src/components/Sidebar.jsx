// import "./Sidebar.css";
// import { NavLink } from "react-router-dom";

// import {
//   LayoutDashboard,
//   BarChart3,
//   Mic,
//   FileText,
//   HelpCircle,
//   History,
//   User,
//   LogOut
// } from "lucide-react";

// const Sidebar = ({ onLogout }) => {
//   return (
//     <aside className="sidebar">
//       <h2 className="logo">SkillHire</h2>

//       <nav className="sidebar-nav">
//         <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
//         <SidebarItem icon={<BarChart3 />} label="Analytics" />
//         <SidebarItem icon={<HelpCircle />} label="Interview Preparation" />
//         <SidebarItem icon={<Mic />} label="Take Interview" />
//         <SidebarItem icon={<History />} label="Past Interviews" />
//         <SidebarItem icon={<FileText />} label="Resume & Cover Letter" />
//         <SidebarItem icon={<User />} label="Profile" />
//       </nav>

//       <button className="logout" onClick={onLogout}>
//         <LogOut size={18} /> Logout
//       </button>
//     </aside>
//   );
// };

// const SidebarItem = ({ icon, label, active }) => (
//   <div className={`sidebar-item ${active ? "active" : ""}`}>
//     {icon}
//     <span>{label}</span>
//   </div>
// );

// export default Sidebar;

import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Mic,
  FileText,
  HelpCircle,
  History,
  User,
  LogOut
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="sidebar">
      <h2 className="logo">SkillHire</h2>

      <nav className="sidebar-nav">
        <SidebarItem
          to="/student/dashboard"
          icon={<LayoutDashboard />}
          label="Dashboard"
        />

        <SidebarItem
          to="/student/analytics"
          icon={<BarChart3 />}
          label="Analytics"
        />

        {/* <SidebarItem
          to="/student/preparation"
          icon={<HelpCircle />}
          label="Interview Preparation"
        /> */}
        <SidebarItem
  to="/student/interview-prep"
  icon={<HelpCircle />}
  label="Interview Preparation"
/>


        <SidebarItem
          to="/student/mock-interview"
          icon={<Mic />}
          label="Take Interview"
        />

        <SidebarItem
          to="/student/history"
          icon={<History />}
          label="Past Interviews"
        />

        <SidebarItem
          to="/student/resume"
          icon={<FileText />}
          label="Resume & Cover Letter"
        />

        <SidebarItem
          to="/student/profile"
          icon={<User />}
          label="Profile"
        />
      </nav>

      <button className="logout" onClick={onLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "active" : ""}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
