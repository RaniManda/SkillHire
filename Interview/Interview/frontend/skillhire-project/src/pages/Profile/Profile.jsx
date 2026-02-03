import React, { useState } from "react";
import "./Profile.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { User, Mail, Lock, Shield, Edit2, Save, X } from "lucide-react";

const Profile = ({ user, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "student",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update user in parent component and localStorage
      const updatedUser = { ...user, ...formData };
      onUpdateUser?.(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      setMessage("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      role: user?.role || "student",
    });
    setIsEditing(false);
    setMessage("");
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
    setMessage("");
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} user={user} />
      <div className="dashboard-main">
        <Topbar user={user} onLogout={onLogout} />
        
        <div className="profile-content">
          <div className="profile-header">
            <h1>Profile Settings</h1>
            <p>Manage your account information and preferences</p>
          </div>

          {message && (
            <div className={`profile-message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          {/* Profile Information Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Personal Information</h2>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSaveProfile} disabled={loading}>
                    <Save size={18} />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label>
                  <User size={20} />
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                  />
                ) : (
                  <div className="field-value">{user?.username || "N/A"}</div>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <Mail size={20} />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                ) : (
                  <div className="field-value">{user?.email || "N/A"}</div>
                )}
              </div>

              <div className="profile-field">
                <label>
                  <Shield size={20} />
                  Role
                </label>
                <div className="field-value">
                  <span className={`role-badge ${user?.role}`}>
                    {user?.role === "student" ? "Student" : "Recruiter"}
                  </span>
                </div>
              </div>

              {user?.provider && (
                <div className="profile-field">
                  <label>
                    <Shield size={20} />
                    Sign-in Provider
                  </label>
                  <div className="field-value">
                    <span className="provider-badge">{user.provider}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Security</h2>
              {!isChangingPassword ? (
                <button className="edit-btn" onClick={() => setIsChangingPassword(true)}>
                  <Lock size={18} />
                  Change Password
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleChangePassword} disabled={loading}>
                    <Save size={18} />
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                  <button className="cancel-btn" onClick={handleCancelPasswordChange}>
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {isChangingPassword && (
              <div className="profile-fields">
                <div className="profile-field">
                  <label>
                    <Lock size={20} />
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="profile-field">
                  <label>
                    <Lock size={20} />
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>

                <div className="profile-field">
                  <label>
                    <Lock size={20} />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            )}

            {!isChangingPassword && (
              <p className="security-info">
                Last password change: Never (or track this via backend)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
