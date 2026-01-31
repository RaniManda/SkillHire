



// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
// } from "react-router-dom";

// import Home from "./pages/Home/Home";
// import Auth from "./pages/Auth/Auth";
// import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
// import StudentAnalytics from "./pages/StudentAnalytics/StudentAnalytics";
// import InterviewPreparationDashboard from
// "./components/InterviewPreparationDashboard"; // ✅ ADD THIS

// /* ================= APP WRAPPER ================= */
// const AppWrapper = () => {
//   const navigate = useNavigate();

//   const [authMode, setAuthMode] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const toggleTheme = () => setIsDarkMode((prev) => !prev);

//   const handleAuthSuccess = (userData) => {
//     setUser(userData);
//     setAuthMode(null);

//     if (userData.role === "student") {
//       navigate("/student/dashboard");
//     }
//   };

//   return (
//     <>
//       {/* ===== AUTH MODAL ===== */}
//       {authMode && (
//         <Auth
//           mode={authMode}
//           onClose={() => setAuthMode(null)}
//           onSwitch={() =>
//             setAuthMode(authMode === "login" ? "register" : "login")
//           }
//           onSuccess={handleAuthSuccess}
//           isDarkMode={isDarkMode}
//         />
//       )}

//       <Routes>
//         {/* ===== HOME ===== */}
//         <Route
//           path="/"
//           element={
//             <Home
//               onAuth={setAuthMode}
//               isDarkMode={isDarkMode}
//               toggleTheme={toggleTheme}
//             />
//           }
//         />

//         {/* ===== STUDENT DASHBOARD ===== */}
//         {user?.role === "student" && (
//           <>
//             <Route
//               path="/student/dashboard"
//               element={<StudentDashboard user={user} />}
//             />

//             {/* ✅ ANALYTICS PAGE */}
//             <Route
//               path="/student/analytics"
//               element={<StudentAnalytics user={user} />}
//             />

//             <Route
//   path="/student/interview-prep"
//   element={<InterviewPreparationDashboard />}
// />
//           </>
//         )}
//       </Routes>
//     </>
//   );
// };

// /* ================= ROOT APP ================= */
// function App() {
//   return (
//     <Router>
//       <AppWrapper />
//     </Router>
//   );
// }

// export default App;


// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
// } from "react-router-dom";

// import Home from "./pages/Home/Home";
// import Auth from "./pages/Auth/Auth";
// import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
// import StudentAnalytics from "./pages/StudentAnalytics/StudentAnalytics";
// import InterviewPreparationDashboard from "./components/InterviewPreparationDashboard";

// /* ================= APP WRAPPER ================= */
// const AppWrapper = () => {
//   const navigate = useNavigate();

//   const [authMode, setAuthMode] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const toggleTheme = () => setIsDarkMode((prev) => !prev);

//   const handleAuthSuccess = (userData) => {
//     setUser(userData);
//     setAuthMode(null);

//     if (userData.role === "student") {
//       navigate("/student/dashboard");
//     }
//   };

//   return (
//     <>
//       {authMode && (
//         <Auth
//           mode={authMode}
//           onClose={() => setAuthMode(null)}
//           onSwitch={() =>
//             setAuthMode(authMode === "login" ? "register" : "login")
//           }
//           onSuccess={handleAuthSuccess}
//           isDarkMode={isDarkMode}
//         />
//       )}

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Home
//               onAuth={setAuthMode}
//               isDarkMode={isDarkMode}
//               toggleTheme={toggleTheme}
//             />
//           }
//         />

//         {user?.role === "student" && (
//           <>
//             <Route
//               path="/student/dashboard"
//               element={<StudentDashboard user={user} />}
//             />
//             <Route
//               path="/student/analytics"
//               element={<StudentAnalytics user={user} />}
//             />
//             <Route
//               path="/student/interview-prep"
//               element={<InterviewPreparationDashboard />}
//             />
//           </>
//         )}
//       </Routes>
//     </>
//   );
// };

// /* ================= ROOT APP ================= */
// function App() {
//   return (
//     <Router>
//       <AppWrapper />
//     </Router>
//   );
// }

// export default App;



import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import StudentAnalytics from "./pages/StudentAnalytics/StudentAnalytics";
import InterviewPreparationDashboard from "./components/InterviewPreparationDashboard";
import Chatbot from "./components/Chatbot";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackSuccess from "./components/FeedbackSuccess";



/* ================= APP WRAPPER ================= */
const AppWrapper = () => {
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // 30/01/2026
  const [redirectAfterAuth, setRedirectAfterAuth] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);



  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthMode(null);

    if (redirectAfterAuth === "feedback") {
    setShowFeedback(true); // 🔥 OPEN FEEDBACK FORM
    setRedirectAfterAuth(null);
    return;
  }

    if (userData?.role === "student") {
      navigate("/student/dashboard");
    }
  };

  return (
    <>
      {/* AUTH MODAL */}
      {authMode && (
        <Auth
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={() =>
            setAuthMode(authMode === "login" ? "register" : "login")
          }
          onSuccess={handleAuthSuccess}
          isDarkMode={isDarkMode}
        />
      )}

       {/* ✅ FEEDBACK FORM MODAL */}
   {showFeedback && (
  <FeedbackForm
    onClose={() => setShowFeedback(false)}
    onSubmit={(data) => {
      console.log("Feedback submitted:", data);
      setShowFeedback(false);
      setShowSuccessMessage(true); // 🔥 show message
    }}
  />
)}

{showSuccessMessage && (
  <FeedbackSuccess
    onClose={() => setShowSuccessMessage(false)}
  />
)}



      {/* GLOBAL CHATBOT */}
      <Chatbot />

      {/* ROUTES */}
      <Routes>
        <Route
          path="/"
          element={
            // <Home
            //   onAuth={setAuthMode}
            //   isDarkMode={isDarkMode}
            //   toggleTheme={toggleTheme}
            // />
            <Home
  onAuth={(mode, redirectTo) => {
    setAuthMode(mode);
    setRedirectAfterAuth(redirectTo);
  }}
  isDarkMode={isDarkMode}
  toggleTheme={toggleTheme}
/>

          }
        />

        {user?.role === "student" && (
          <>
            <Route
              path="/student/dashboard"
              element={<StudentDashboard user={user} />}
            />
            <Route
              path="/student/analytics"
              element={<StudentAnalytics user={user} />}
            />
            <Route
              path="/student/interview-prep"
              element={<InterviewPreparationDashboard />}
            />
          </>
        )}
      </Routes>
    </>
  );
};

/* ================= ROOT APP ================= */
const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;

