// ASINI
import React from "react";
import "./Navbar.css";
import { Sun, Moon } from "lucide-react";

const Navbar = ({ onAuth, isDarkMode, toggleTheme, onAboutClick }) => {
  return (
    <nav className="navbar-container">
      {/* Brand */}
      <div className="nav-brand">
        <div className="logo-symbol">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <span className="logo-name">SkillHire</span>
      </div>

      {/* Nav Links */}
      <div className="nav-menu">
        <a href="#home" className="nav-link">Home</a>
        <a href="#about" className="nav-link" onClick={onAboutClick}>About</a>
        <a href="#contact" className="nav-link">Contact</a>
      </div>

      {/* Actions */}
      <div className="nav-actions">
        {/* THEME TOGGLE */}
        <div
        className={`theme-toggle ${isDarkMode ? "active" : ""}`}
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        >
        <span className="toggle-knob">
            {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
          </span>
        </div>

        <button className="btn-login" onClick={() => onAuth("login")}>
          Login
        </button>

        <button className="btn-register" onClick={() => onAuth("register")}>
          Join Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;