// import React, { useEffect, useState } from "react";
// import "./Auth.css";
// import { X, Eye, EyeOff, Chrome, Linkedin } from "lucide-react";
// import Lottie from "lottie-react";

// import loginAnimation from "../../assets/login.json";
// import registerAnimation from "../../assets/register.json";
// import forgotAnimation from "../../assets/forgot.json";

// import { loginApi, registerApi, sendOtpApi, verifyOtpApi, resetPasswordApi } from "./api";

// const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// const Auth = ({ onClose, onLoginSuccess, initialPage = 'login' }) => {
//   const [page, setPage] = useState(initialPage);

//   useEffect(() => {
//     setPage(initialPage);
//   }, [initialPage]);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [socialRole, setSocialRole] = useState("student");

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const oauthStatus = params.get("oauth");

//     if (oauthStatus === "success") {
//       const user = {
//         username: params.get("username") || "",
//         email: params.get("email") || "",
//         role: params.get("role") || "student",
//         provider: params.get("provider") || "",
//       };
//       onLoginSuccess?.(user);
//       setMessage("Login successful");
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     if (oauthStatus === "error") {
//       const errorMessage = params.get("message") || "Social login failed";
//       setMessage(errorMessage);
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, [onLoginSuccess]);

//   const handleSocialLogin = (provider) => {
//     // Redirect to home page where App.jsx will handle OAuth callback and redirect to dashboard
//     const nextUrl = window.location.origin + '/';
//     window.location.href = `${BACKEND_BASE_URL}/auth/oauth/${provider}/?role=${socialRole}&next=${encodeURIComponent(nextUrl)}`;
//   };

//   // Reset states when page changes
//   const resetStates = () => {
//     setMessage("");
//     setOtpSent(false);
//     setOtpVerified(false);
//     setOtp("");
//     setLoading(false);
//   };

//   const getAnimation = () => {
//     if (page === "login") return loginAnimation;
//     if (page === "forgot") return forgotAnimation;
//     return registerAnimation;
//   };

//   /* ================= LOGIN ================= */
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     if (!email || !password) {
//       setMessage("Please fill all fields");
//       return;
//     }
//     if (!email.endsWith("@gmail.com")) {
//       setMessage("Email must end with @gmail.com");
//       return;
//     }
//     if (password.length < 8) {
//       setMessage("Password must be at least 8 characters");
//       return;
//     }

//     const res = await loginApi(email, password);

//     if (res?.message) {
//       if (res.message.toLowerCase().includes("login successful") && res.user) {
//         onLoginSuccess(res.user); // Redirect or handle role-based navigation
//       } else {
//         setMessage(res.message);
//       }
//     } else {
//       setMessage(res?.error || "Invalid email or password");
//     }
//   };

//   /* ================= SEND OTP FOR REGISTRATION ================= */
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     if (!email) {
//       setMessage("Please enter email");
//       setLoading(false);
//       return;
//     }

//     const res = await sendOtpApi(email);

//     if (res?.message) {
//       setMessage("OTP sent to your email");
//       setOtpSent(true);
//     } else {
//       setMessage(res?.error || "Failed to send OTP");
//     }
//     setLoading(false);
//   };

//   /* ================= VERIFY OTP ================= */
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     if (!otp) {
//       setMessage("Please enter OTP");
//       setLoading(false);
//       return;
//     }

//     const res = await verifyOtpApi(email, otp);

//     if (res?.message) {
//       setMessage("OTP verified successfully");
//       setOtpVerified(true);
//     } else {
//       setMessage(res?.error || "Invalid OTP");
//     }
//     setLoading(false);
//   };

//   /* ================= REGISTER ================= */
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     if (!username || !email || !password || !confirmPassword || !otp) {
//       setMessage("Please fill all fields");
//       return;
//     }
//     if (!email.endsWith("@gmail.com")) {
//       setMessage("Email must end with @gmail.com");
//       return;
//     }
//     if (password.length < 8) {
//       setMessage("Password must be at least 8 characters");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setMessage("Passwords do not match");
//       return;
//     }

//     const role = page === "register-student" ? "student" : "recruiter";
//     const res = await registerApi({ username, email, password, role, otp });

//     if (res?.message) {
//       setMessage("Account created successfully! Redirecting to login...");
//       setTimeout(() => {
//         setPage("login");
//         setUsername("");
//         setEmail("");
//         setPassword("");
//         setConfirmPassword("");
//         setOtp("");
//         setOtpSent(false);
//         setOtpVerified(false);
//         setMessage(""); // Clear message after redirect
//       }, 1500);
//     } else {
//       setMessage(res?.error || "Registration failed");
//     }
//   };

//   /* ================= SEND OTP FOR FORGOT PASSWORD ================= */
//   const handleSendForgotOtp = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     const emailInput = email;

//     if (!emailInput) {
//       setMessage("Please enter email");
//       setLoading(false);
//       return;
//     }

//     const res = await sendOtpApi(emailInput);

//     if (res?.message) {
//       setMessage("OTP sent to your email");
//       setOtpSent(true);
//     } else {
//       setMessage(res?.error || "Failed to send OTP");
//     }
//     setLoading(false);
//   };

//   /* ================= VERIFY OTP FOR FORGOT PASSWORD ================= */
//   const handleVerifyForgotOtp = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     if (!otp) {
//       setMessage("Please enter OTP");
//       setLoading(false);
//       return;
//     }

//     const res = await verifyOtpApi(email, otp);

//     if (res?.message) {
//       setMessage("OTP verified. Enter new password");
//       setOtpVerified(true);
//     } else {
//       setMessage(res?.error || "Invalid OTP");
//     }
//     setLoading(false);
//   };

//   /* ================= RESET PASSWORD ================= */
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     if (!newPassword || !confirmNewPassword) {
//       setMessage("Please fill all fields");
//       setLoading(false);
//       return;
//     }

//     if (newPassword.length < 8) {
//       setMessage("Password must be at least 8 characters");
//       setLoading(false);
//       return;
//     }

//     if (newPassword !== confirmNewPassword) {
//       setMessage("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     const res = await resetPasswordApi(email, otp, newPassword);

//     if (res?.message) {
//       setMessage("Password reset successfully! Redirecting to login...");
//       setTimeout(() => {
//         setPage("login");
//         setEmail("");
//         setOtp("");
//         setNewPassword("");
//         setConfirmNewPassword("");
//         setOtpSent(false);
//         setOtpVerified(false);
//         setMessage(""); // Clear message after redirect
//       }, 1500);
//     } else {
//       setMessage(res?.error || "Password reset failed");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="auth-overlay">
//       <div className="auth-box">
//         {/* LEFT SIDE ANIMATION */}
//         <div className="auth-left">
//           <Lottie animationData={getAnimation()} loop={true} />
//         </div>

//         {/* RIGHT SIDE FORM */}
//         <div className="auth-right">
//           <button className="close-x" onClick={onClose}>
//             <X />
//           </button>

//           {/* ================= LOGIN ================= */}
//           {page === "login" && (
//             <>
//               <h2>Welcome back!</h2>

//               {message && (
//                 <p
//                   className="message-box"
//                   style={{ color: message.toLowerCase().includes("success") ? "green" : "red", marginBottom: "15px", fontSize: "0.9rem" }}
//                 >
//                   {message}
//                 </p>
//               )}

//               <form onSubmit={handleLogin}>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <div className="password-box">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <span
//                     className="eye-icon"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </span>
//                 </div>

//                 <button className="primary-btn">Login</button>
//               </form>

//               <p className="link" onClick={() => { setPage("forgot"); resetStates(); }}>
//                 Forgot Password?
//               </p>

//               <div className="divider">Register as</div>
//               <div className="role-buttons">
//                 <button onClick={() => { setPage("register-student"); resetStates(); }}>
//                   Student
//                 </button>
//                 <button onClick={() => { setPage("register-recruiter"); resetStates(); }}>
//                   Recruiter
//                 </button>
//               </div>

//               <div className="social-login">
//                 <p className="divider">or continue with</p>

//                 <div className="role-buttons social-role-buttons">
//                   <button
//                     className={socialRole === "student" ? "active" : ""}
//                     onClick={() => setSocialRole("student")}
//                     type="button"
//                   >
//                     Continue as Student
//                   </button>
//                   <button
//                     className={socialRole === "recruiter" ? "active" : ""}
//                     onClick={() => setSocialRole("recruiter")}
//                     type="button"
//                   >
//                     Continue as Recruiter
//                   </button>
//                 </div>

//                 <div className="social-buttons">
//                   <button
//                     className="google-btn"
//                     type="button"
//                     onClick={() => handleSocialLogin("google")}
//                   >
//                     <Chrome size={18} /> Google
//                   </button>
//                   <button
//                     className="linkedin-btn"
//                     type="button"
//                     onClick={() => handleSocialLogin("linkedin")}
//                   >
//                     <Linkedin size={18} /> LinkedIn
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* ================= REGISTER ================= */}
//           {(page === "register-student" || page === "register-recruiter") && (
//             <div className={`register-form ${page === 'register-recruiter' ? 'flip-to-back' : ''}`}>
//               <div className="register-form-inner">
//                 {/* Student Registration */}
//                 <div className="register-front">
//                   <div className="switch-role">
//                     <p className="link" onClick={() => setPage("register-recruiter")}>
//                       Switch to Recruiter →
//                     </p>
//                   </div>

//                   <h2>Register as Student</h2>

//                   {message && (
//                     <p
//                       className="message-box"
//                       style={{ color: message.toLowerCase().includes("success") ? "green" : "red", marginBottom: "15px", fontSize: "0.9rem" }}
//                     >
//                       {message}
//                     </p>
//                   )}

//                   {!otpSent ? (
//                     <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(e); }}>
//                       <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                       />
//                       <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />

//                       <div className="password-box">
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           required
//                         />
//                         <span
//                           className="eye-icon"
//                           onClick={() => setShowPassword(!showPassword)}
//                         >
//                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </span>
//                       </div>

//                       <div className="password-box">
//                         <input
//                           type={showConfirmPassword ? "text" : "password"}
//                           placeholder="Re-Type Password"
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                           required
//                         />
//                         <span
//                           className="eye-icon"
//                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         >
//                           {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </span>
//                       </div>

//                       <button className="primary-btn" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
//                     </form>
//                   ) : !otpVerified ? (
//                     <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(e); }}>
//                       <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "10px" }}>
//                         OTP has been sent to {email}
//                       </p>
//                       <input
//                         type="text"
//                         placeholder="Enter 6-digit OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         required
//                         maxLength="6"
//                       />
//                       <button className="primary-btn" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
//                     </form>
//                   ) : (
//                     <form onSubmit={handleRegister}>
//                       <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                         disabled
//                       />
//                       <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         disabled
//                       />
//                       <input
//                         type="text"
//                         placeholder="OTP (Verified)"
//                         value={otp}
//                         disabled
//                       />
//                       <button className="primary-btn">Create Account</button>
//                     </form>
//                   )}

//                   <p className="link" onClick={() => { setPage("login"); setOtpSent(false); setOtpVerified(false); }}>
//                     Already have an account? Login
//                   </p>
//                 </div>

//                 {/* Recruiter Registration */}
//                 <div className="register-back">
//                   <div className="switch-role">
//                     <p className="link" onClick={() => setPage("register-student")}>
//                       Switch to Student →
//                     </p>
//                   </div>

//                   <h2>Register as Recruiter</h2>

//                   {message && (
//                     <p
//                       className="message-box"
//                       style={{ color: message.toLowerCase().includes("success") ? "green" : "red", marginBottom: "15px", fontSize: "0.9rem" }}
//                     >
//                       {message}
//                     </p>
//                   )}

//                   {!otpSent ? (
//                     <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(e); }}>
//                       <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                       />
//                       <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />

//                       <div className="password-box">
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           required
//                         />
//                         <span
//                           className="eye-icon"
//                           onClick={() => setShowPassword(!showPassword)}
//                         >
//                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </span>
//                       </div>

//                       <div className="password-box">
//                         <input
//                           type={showConfirmPassword ? "text" : "password"}
//                           placeholder="Re-Type Password"
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                           required
//                         />
//                         <span
//                           className="eye-icon"
//                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         >
//                           {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </span>
//                       </div>

//                       <button className="primary-btn" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
//                     </form>
//                   ) : !otpVerified ? (
//                     <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(e); }}>
//                       <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "10px" }}>
//                         OTP has been sent to {email}
//                       </p>
//                       <input
//                         type="text"
//                         placeholder="Enter 6-digit OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         required
//                         maxLength="6"
//                       />
//                       <button className="primary-btn" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
//                     </form>
//                   ) : (
//                     <form onSubmit={handleRegister}>
//                       <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                         disabled
//                       />
//                       <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         disabled
//                       />
//                       <input
//                         type="text"
//                         placeholder="OTP (Verified)"
//                         value={otp}
//                         disabled
//                       />
//                       <button className="primary-btn">Create Account</button>
//                     </form>
//                   )}

//                   <p className="link" onClick={() => { setPage("login"); resetStates(); setUsername(""); setEmail(""); setPassword(""); setConfirmPassword(""); }}>
//                     Already have an account? Login
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ================= FORGOT PASSWORD ================= */}
//           {page === "forgot" && (
//             <>
//               <h2>Reset Password</h2>

//               {message && (
//                 <p
//                   className="message-box"
//                   style={{ color: message.toLowerCase().includes("success") ? "green" : "red", marginBottom: "15px", fontSize: "0.9rem" }}
//                 >
//                   {message}
//                 </p>
//               )}

//               {!otpSent ? (
//                 <form onSubmit={handleSendForgotOtp}>
//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                   <button className="primary-btn" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
//                 </form>
//               ) : !otpVerified ? (
//                 <form onSubmit={handleVerifyForgotOtp}>
//                   <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "15px" }}>
//                     OTP has been sent to {email}
//                   </p>
//                   <input
//                     type="text"
//                     placeholder="Enter 6-digit OTP"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     required
//                     maxLength="6"
//                   />
//                   <button className="primary-btn" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
//                 </form>
//               ) : (
//                 <form onSubmit={handleResetPassword}>
//                   <div className="password-box">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="New Password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       required
//                     />
//                     <span
//                       className="eye-icon"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </span>
//                   </div>

//                   <div className="password-box">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm Password"
//                       value={confirmNewPassword}
//                       onChange={(e) => setConfirmNewPassword(e.target.value)}
//                       required
//                     />
//                     <span
//                       className="eye-icon"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </span>
//                   </div>

//                   <button className="primary-btn" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
//                 </form>
//               )}

//               <p className="link" onClick={() => { setPage("login"); resetStates(); setEmail(""); setNewPassword(""); setConfirmNewPassword(""); }}>
//                 Back to Login
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;

import React, { useEffect, useState } from "react";
import "./Auth.css";
import { X, Eye, EyeOff, Chrome, Linkedin } from "lucide-react";
import Lottie from "lottie-react";

import loginAnimation from "../../assets/login.json";
import registerAnimation from "../../assets/register.json";
import forgotAnimation from "../../assets/forgot.json";

import { loginApi, registerApi, sendOtpApi, verifyOtpApi, resetPasswordApi } from "./api";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const Auth = ({ onClose, onLoginSuccess, initialPage = 'login' }) => {
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialRole, setSocialRole] = useState("student");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthStatus = params.get("oauth");

    if (oauthStatus === "success") {
      const user = {
        username: params.get("username") || "",
        email: params.get("email") || "",
        role: params.get("role") || "student",
        provider: params.get("provider") || "",
      };
      onLoginSuccess?.(user);
      setMessage("Login successful");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (oauthStatus === "error") {
      const errorMessage = params.get("message") || "Social login failed";
      setMessage(errorMessage);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onLoginSuccess]);

  const handleSocialLogin = (provider) => {
    // Default: after social login redirect to student dashboard
    let nextUrl = window.location.origin + '/student/dashboard';

    // If feedback intent persisted (user clicked Give Feedback), redirect to home
    // and let App.jsx open the feedback modal after OAuth completes
    if (localStorage.getItem('feedbackIntent')) {
      nextUrl = window.location.origin + '/';
    }

    window.location.href = `${BACKEND_BASE_URL}/auth/oauth/${provider}/?role=${socialRole}&next=${encodeURIComponent(nextUrl)}`;
  };

  // Reset states when page changes
  const resetStates = () => {
    setMessage("");
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setLoading(false);
  };

  const getAnimation = () => {
    if (page === "login") return loginAnimation;
    if (page === "forgot") return forgotAnimation;
    return registerAnimation;
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      setMessage("Email must end with @gmail.com");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    const res = await loginApi(email, password);

    if (res?.message) {
      if (res.message.toLowerCase().includes("login successful") && res.user) {
        onLoginSuccess(res.user); // Redirect or handle role-based navigation
      } else {
        setMessage(res.message);
      }
    } else {
      setMessage(res?.error || "Invalid email or password");
    }
  };

  /* ================= SEND OTP FOR REGISTRATION ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!email) {
      setMessage("Please enter email");
      setLoading(false);
      return;
    }

    const res = await sendOtpApi(email);

    if (res?.message) {
      setMessage("OTP sent to your email");
      setOtpSent(true);
    } else {
      setMessage(res?.error || "Failed to send OTP");
    }
    setLoading(false);
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!otp) {
      setMessage("Please enter OTP");
      setLoading(false);
      return;
    }

    const res = await verifyOtpApi(email, otp);

    if (res?.message) {
      setMessage("OTP verified successfully");
      setOtpVerified(true);
    } else {
      setMessage(res?.error || "Invalid OTP");
    }
    setLoading(false);
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !email || !password || !confirmPassword || !otp) {
      setMessage("Please fill all fields");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      setMessage("Email must end with @gmail.com");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const role = page === "register-student" ? "student" : "recruiter";
    const res = await registerApi({ username, email, password, role, otp });

    if (res?.message) {
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        setPage("login");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
        setMessage(""); // Clear message after redirect
      }, 1500);
    } else {
      setMessage(res?.error || "Registration failed");
    }
  };

  /* ================= SEND OTP FOR FORGOT PASSWORD ================= */
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const emailInput = email;

    if (!emailInput) {
      setMessage("Please enter email");
      setLoading(false);
      return;
    }

    const res = await sendOtpApi(emailInput);

    if (res?.message) {
      setMessage("OTP sent to your email");
      setOtpSent(true);
    } else {
      setMessage(res?.error || "Failed to send OTP");
    }
    setLoading(false);
  };

  /* ================= VERIFY OTP FOR FORGOT PASSWORD ================= */
  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!otp) {
      setMessage("Please enter OTP");
      setLoading(false);
      return;
    }

    const res = await verifyOtpApi(email, otp);

    if (res?.message) {
      setMessage("OTP verified. Enter new password");
      setOtpVerified(true);
    } else {
      setMessage(res?.error || "Invalid OTP");
    }
    setLoading(false);
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!newPassword || !confirmNewPassword) {
      setMessage("Please fill all fields");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    const res = await resetPasswordApi(email, otp, newPassword);

    if (res?.message) {
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        setPage("login");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setOtpSent(false);
        setOtpVerified(false);
        setMessage(""); // Clear message after redirect
      }, 1500);
    } else {
      setMessage(res?.error || "Password reset failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        {/* LEFT SIDE ANIMATION */}
        <div className="auth-left">
          <Lottie animationData={getAnimation()} loop={true} />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="auth-right">
          <button className="close-x" onClick={onClose}>
            <X />
          </button>

          {/* ================= LOGIN ================= */}
          {page === "login" && (
            <>
              <h2>Welcome back!</h2>

              {message && (
                <p
                  className="message-box"
                  style={{ color: message.toLowerCase().includes("success") ? "green" : "red", marginBottom: "15px", fontSize: "0.9rem" }}
                >
                  {message}
                </p>
              )}

              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                <button className="primary-btn">Login</button>
              </form>

              <p className="link" onClick={() => { setPage("forgot"); resetStates(); }}>
                Forgot Password?
              </p>

              <div className="divider">Register as</div>
              <div className="role-buttons">
                <button onClick={() => { setPage("register-student"); resetStates(); }}>
                  Student
                </button>
                <button onClick={() => { setPage("register-recruiter"); resetStates(); }}>
                  Recruiter
                </button>
              </div>

              <div className="social-login">
                <p className="divider">or continue with</p>

                <div className="role-buttons social-role-buttons">
                  <button
                    className={socialRole === "student" ? "active" : ""}
                    onClick={() => setSocialRole("student")}
                    type="button"
                  >
                    Continue as Student
                  </button>
                  <button
                    className={socialRole === "recruiter" ? "active" : ""}
                    onClick={() => setSocialRole("recruiter")}
                    type="button"
                  >
                    Continue as Recruiter
                  </button>
                </div>

                <div className="social-buttons">
                  <button
                    className="google-btn"
                    type="button"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <Chrome size={18} /> Google
                  </button>
                  <button
                    className="linkedin-btn"
                    type="button"
                    onClick={() => handleSocialLogin("linkedin")}
                  >
                    <Linkedin size={18} /> LinkedIn
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ================= REGISTER ================= */}
          {(page === "register-student" || page === "register-recruiter") && (
            <div className={`register-form ${page === 'register-recruiter' ? 'flip-to-back' : ''}`}>
              <div className="register-form-inner">
                {/* Student Registration */}
                <div className="register-front">
                  <div className="switch-role">
                    <p className="link" onClick={() => setPage("register-recruiter")}>
                      Switch to Recruiter →
                    </p>
                  </div>

                  <h2>Register as Student</h2>

                  {message && (
                    <p
                      className="message-box"
                      style={{ color: message.toLowerCase().includes("success") ? "green" : "red", marginBottom: "15px", fontSize: "0.9rem" }}
                    >
                      {message}
                    </p>
                  )}

                  {!otpSent ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(e); }}>
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />

                      <div className="password-box">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span
                          className="eye-icon"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>

                      <div className="password-box">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-Type Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <span
                          className="eye-icon"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>

                      <button className="primary-btn" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
                    </form>
                  ) : !otpVerified ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(e); }}>
                      <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "10px" }}>
                        OTP has been sent to {email}
                      </p>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength="6"
                      />
                      <button className="primary-btn" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister}>
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled
                      />
                      <input
                        type="text"
                        placeholder="OTP (Verified)"
                        value={otp}
                        disabled
                      />
                      <button className="primary-btn">Create Account</button>
                    </form>
                  )}

                  <p className="link" onClick={() => { setPage("login"); setOtpSent(false); setOtpVerified(false); }}>
                    Already have an account? Login
                  </p>
                </div>

                {/* Recruiter Registration */}
                <div className="register-back">
                  <div className="switch-role">
                    <p className="link" onClick={() => setPage("register-student")}>
                      Switch to Student →
                    </p>
                  </div>

                  <h2>Register as Recruiter</h2>

                  {message && (
                    <p
                      className="message-box"
                      style={{ color: message.toLowerCase().includes("success") ? "green" : "red", marginBottom: "15px", fontSize: "0.9rem" }}
                    >
                      {message}
                    </p>
                  )}

                  {!otpSent ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(e); }}>
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />

                      <div className="password-box">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span
                          className="eye-icon"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>

                      <div className="password-box">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-Type Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <span
                          className="eye-icon"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                      </div>

                      <button className="primary-btn" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
                    </form>
                  ) : !otpVerified ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(e); }}>
                      <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "10px" }}>
                        OTP has been sent to {email}
                      </p>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength="6"
                      />
                      <button className="primary-btn" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister}>
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled
                      />
                      <input
                        type="text"
                        placeholder="OTP (Verified)"
                        value={otp}
                        disabled
                      />
                      <button className="primary-btn">Create Account</button>
                    </form>
                  )}

                  <p className="link" onClick={() => { setPage("login"); resetStates(); setUsername(""); setEmail(""); setPassword(""); setConfirmPassword(""); }}>
                    Already have an account? Login
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= FORGOT PASSWORD ================= */}
          {page === "forgot" && (
            <>
              <h2>Reset Password</h2>

              {message && (
                <p
                  className="message-box"
                  style={{ color: message.toLowerCase().includes("success") ? "green" : "red", marginBottom: "15px", fontSize: "0.9rem" }}
                >
                  {message}
                </p>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendForgotOtp}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="primary-btn" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
                </form>
              ) : !otpVerified ? (
                <form onSubmit={handleVerifyForgotOtp}>
                  <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "15px" }}>
                    OTP has been sent to {email}
                  </p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="6"
                  />
                  <button className="primary-btn" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="password-box">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>

                  <div className="password-box">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>

                  <button className="primary-btn" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
                </form>
              )}

              <p className="link" onClick={() => { setPage("login"); resetStates(); setEmail(""); setNewPassword(""); setConfirmNewPassword(""); }}>
                Back to Login
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;