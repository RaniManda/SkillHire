// import React, { useState } from "react";
// import "./Auth.css";
// import {
//   X,
//   User,
//   Mail,
//   Lock,
//   Chrome,
//   Linkedin,
//   ShieldCheck,
//   Briefcase,
// } from "lucide-react";

// const Auth = ({ mode, onClose, onSwitch, isDarkMode, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   /* ✅ HANDLE LOGIN / REGISTER */
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // simulate successful auth
//     const userData = {
//       name: formData.name || "User",
//       email: formData.email,
//       role: mode === "login" ? "student" : formData.role,
//     };

//     onSuccess(userData); // 🔥 VERY IMPORTANT
//   };

//   return (
//     <div className={`auth-overlay ${isDarkMode ? "dark" : "light"}`}>
//       <div className="auth-modal">
//         <button className="close-btn" onClick={onClose}>
//           <X size={20} />
//         </button>

//         <div className="auth-header">
//           <ShieldCheck size={32} className="brand-icon" />
//           <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
//         </div>

//         <form className="auth-form" onSubmit={handleSubmit}>
//           {mode === "register" && (
//             <>
//               <div className="form-group">
//                 <label>
//                   <User size={14} /> First Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="First Name"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* ROLE */}
//               <div className="form-group">
//                 <label>
//                   <Briefcase size={14} /> Select Role
//                 </label>
//                 <select
//                   name="role"
//                   required
//                   defaultValue=""
//                   onChange={handleChange}
//                 >
//                   <option value="" disabled>
//                     Choose your role
//                   </option>
//                   <option value="student">Student</option>
//                   <option value="recruiter">Recruiter</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//             </>
//           )}

//           <div className="form-group">
//             <label>
//               <Mail size={14} /> Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           <div className="form-group">
//             <label>
//               <Lock size={14} /> Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               placeholder="••••••••"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           <button type="submit" className="auth-submit">
//             {mode === "login" ? "Login" : "Register"}
//           </button>
//         </form>

//         <div className="divider">
//           <span>OR</span>
//         </div>

//         <div className="social-group">
//           <button className="social-btn">
//             <Chrome size={16} /> Google
//           </button>
//           <button className="social-btn">
//             <Linkedin size={16} /> LinkedIn
//           </button>
//         </div>

//         <p className="auth-footer">
//           {mode === "login" ? "New here?" : "Joined already?"}{" "}
//           <span onClick={onSwitch}>
//             {mode === "login" ? "Register" : "Login"}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Auth;




// ADHISESHU
import React, { useState } from "react";
import "./Auth.css";
import { X, Eye, EyeOff, Chrome, Linkedin } from "lucide-react";

import loginGif from "../../assets/login.gif";
import registerGif from "../../assets/register.gif";
import forgotGif from "../../assets/forgot.gif";

const Auth = ({ onClose, onLoginSuccess }) => {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getGif = () => {
    if (page === "login") return loginGif;
    if (page === "forgot") return forgotGif;
    return registerGif;
  };

  /* ================= LOGIN (MOCK) ================= */
  const handleLogin = (e) => {
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

    // ✅ MOCK SUCCESS LOGIN
    onLoginSuccess({
      name: "Demo User",
      email,
      role: "student", // change to recruiter if needed
    });
  };

  /* ================= REGISTER (MOCK) ================= */
  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !email || !password || !confirmPassword) {
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

    // ✅ MOCK REGISTER SUCCESS
    setMessage("Account created successfully! Please login.");
    setPage("login");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  /* ================= FORGOT PASSWORD (MOCK) ================= */
  const handleForgot = (e) => {
    e.preventDefault();
    const emailInput = e.target.email.value;

    if (!emailInput.endsWith("@gmail.com")) {
      setMessage("Email must end with @gmail.com");
      return;
    }

    setMessage("Password reset link sent to your email!");
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        {/* LEFT SIDE GIF */}
        <div className="auth-left">
          <img src={getGif()} alt="auth" />
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

              <p className="link" onClick={() => setPage("forgot")}>
                Forgot Password?
              </p>

              <div className="divider">Register as</div>
              <div className="role-buttons">
                <button onClick={() => setPage("register-student")}>
                  Student
                </button>
                <button onClick={() => setPage("register-recruiter")}>
                  Recruiter
                </button>
              </div>

              <div className="social-login">
                <p className="divider">or continue with</p>
                <div className="social-buttons">
                  <button className="google-btn">
                    <Chrome size={18} /> Google
                  </button>
                  <button className="linkedin-btn">
                    <Linkedin size={18} /> LinkedIn
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ================= REGISTER ================= */}
          {(page === "register-student" || page === "register-recruiter") && (
            <>
              <h2>
                Register as{" "}
                {page === "register-student" ? "Student" : "Recruiter"}
              </h2>

              <form onSubmit={handleRegister}>
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
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                </div>

                <button className="primary-btn">Create Account</button>
              </form>

              <p className="link" onClick={() => setPage("login")}>
                Already have an account? Login
              </p>
            </>
          )}

          {/* ================= FORGOT PASSWORD ================= */}
          {page === "forgot" && (
            <>
              <h2>Forgot Password</h2>
              <form onSubmit={handleForgot}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
                <button className="primary-btn">Reset Password</button>
              </form>

              <p className="link" onClick={() => setPage("login")}>
                Back to Login
              </p>
            </>
          )}

          {/* ================= MESSAGE ================= */}
          {message && (
            <p
              className="success"
              style={{
                color: message.toLowerCase().includes("success")
                  ? "green"
                  : "red",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
