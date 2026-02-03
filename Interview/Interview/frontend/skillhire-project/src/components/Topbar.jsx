



// import React from "react";
// import { MessageSquare, Bell } from "lucide-react";
// import "./Topbar.css";

// const Topbar = ({ username }) => {
//   return (
//     <div className="topbar">
//       {/* Left: Welcome text */}
//       <div className="topbar-left">
//         <span className="greeting">Welcome back,{username}</span>
//         <span className="username">{username}</span>
//       </div>

//       {/* Right: Icons */}
//       <div className="topbar-right">
//         <div className="icon-btn" title="Chatbot">
//           <MessageSquare size={20} />
//         </div>
//         <div className="icon-btn" title="Notifications">
//           <Bell size={20} />
//           <span className="notification-badge">3</span>
//         </div>
//         <div className="profile-pic" title="Profile">
//           <img 
//             src="https://i.pravatar.cc/40" 
//             alt="Profile" 
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Topbar;



import { useState, useRef, useEffect } from "react";
import "./Topbar.css";
import { Bell, Bot, UserCircle, LogOut, Settings, User } from "lucide-react";

const Topbar = ({ username, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar">
      <h2>
        Welcome back, <span>{username}</span>
      </h2>

      <div className="topbar-actions">
        <Bot size={18} />
        <Bell size={18} />

        {/* PROFILE */}
        <div className="profile-wrapper" ref={dropdownRef}>
          <UserCircle
            size={30}
            className="profile-icon"
            onClick={() => setOpen(!open)}
          />

          {open && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <User size={18} />
                <div>
                  <p className="profile-name">{username}</p>
                  <p className="profile-role">Student</p>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button className="dropdown-item">
                <User size={16} /> My Profile
              </button>

              <button className="dropdown-item">
                <Settings size={16} /> Settings
              </button>

              <div className="dropdown-divider" />

              <button className="dropdown-item logout" onClick={onLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
