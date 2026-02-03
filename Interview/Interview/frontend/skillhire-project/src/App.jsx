import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import FeedbackForm from './components/FeedbackForm';
import FeedbackSuccess from './components/FeedbackSuccess';
import Auth from './pages/Auth/Auth';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import StudentAnalytics from './pages/StudentAnalytics/StudentAnalytics';
import RecruiterDashboard from './pages/RecruiterDashboard/RecruiterDashboard';
import InterviewPreparationDashboard from './components/InterviewPreparationDashboard';
import Profile from './pages/Profile/Profile';


function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const [showFeedback, setShowFeedback] = useState(false); // to show feedback form
  const [feedbackIntent, setFeedbackIntent] = useState(false); // tracks if user wants to give feedback
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false); // optional success modal
  const [topFeedbacks, setTopFeedbacks] = useState([]);
  const [preventRedirect, setPreventRedirect] = useState(false);

  // fetch top feedbacks from backend
  const fetchTopFeedbacks = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/api/feedback/top/');
      if (!res.ok) return setTopFeedbacks([]);
      const data = await res.json();
      setTopFeedbacks(data);
    } catch (err) {
      setTopFeedbacks([]);
    }
  };

  React.useEffect(() => {
    fetchTopFeedbacks();
  }, []);


  // Restore user from localStorage on app mount
  useEffect(() => {
    // Check for OAuth callback first
    const params = new URLSearchParams(window.location.search);
    const oauthStatus = params.get('oauth');

    if (oauthStatus === 'success') {
      const userData = {
        username: params.get('username') || '',
        email: params.get('email') || '',
        role: params.get('role') || 'student',
        provider: params.get('provider') || '',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // Clean URL and redirect will happen automatically via Navigate component
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (oauthStatus === 'error') {
      // Show error and open auth modal
      const errorMessage = params.get('message') || 'Social login failed';
      console.error('OAuth error:', errorMessage);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // No OAuth callback, restore user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          // If feedback intent persisted across a previous redirect, open feedback
          if (localStorage.getItem('feedbackIntent')) {
            setPreventRedirect(true);
            setShowFeedback(true);
            localStorage.removeItem('feedbackIntent');
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Apply the theme class to the body tag
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  const handleAuth = (mode, intent) => {
    setAuthMode(mode);
    if (intent === 'feedback') setFeedbackIntent(true);
    setShowAuth(true);
  };

  const handleLoginSuccess = (userData) => {
    // if feedback intention persisted (for OAuth full-page flows) or in-memory, open feedback
    const persistedIntent = localStorage.getItem('feedbackIntent');
    if (persistedIntent || feedbackIntent) {
      setPreventRedirect(true); // make sure Home stays visible while we open feedback
      setShowFeedback(true);
      setFeedbackIntent(false);
      localStorage.removeItem('feedbackIntent');
    }

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuth(false);
  };

  // submit feedback to backend
  const submitFeedback = async (payload) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const body = { ...payload, name: user.username || payload.name || '', email: user.email || payload.email || '' };

      const res = await fetch('http://127.0.0.1:8000/auth/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit');
      }

      // refresh top feedbacks and show success
      await fetchTopFeedbacks();
      setShowFeedback(false);
      setPreventRedirect(true); // keep user on Home briefly so they see the toast
      setShowFeedbackSuccess(true);

      setTimeout(() => {
        setShowFeedbackSuccess(false);
        setPreventRedirect(false);
      }, 2500);
    } catch (err) {
      console.error('Submit feedback error', err);
      alert(err.message || 'Failed to submit feedback');
    }
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleGiveFeedback = () => {
  if (user) {
    setPreventRedirect(true); // prevent immediate dashboard redirect
    setShowFeedback(true); // user logged in → open feedback form
  } else {
    // persist intent across full-page OAuth redirects
    localStorage.setItem('feedbackIntent', '1');
    setFeedbackIntent(true); // user not logged in → open login
    setAuthMode("login");
    setShowAuth(true);
  }
};



useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && feedbackIntent) {
    setShowFeedback(true); // open feedback form after login
    setFeedbackIntent(false);
  }
}, [feedbackIntent]);


  return (
    <Router>
      <div className="App">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Loading...</p>
          </div>
        ) : (
          <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              (user && !showFeedback && !preventRedirect) ? (
                <Navigate to={user.role === 'student' ? '/student/dashboard' : '/recruiter/dashboard'} replace />
              ) : (
                <>
                  <Home onAuth={handleAuth} isDarkMode={isDarkMode} toggleTheme={toggleTheme} onGiveFeedback={() => handleGiveFeedback()} topFeedbacks={topFeedbacks} />

                  {showFeedback && (
                    <React.Suspense fallback={null}>
                      <FeedbackForm
                        onClose={() => { setShowFeedback(false); setPreventRedirect(false); localStorage.removeItem('feedbackIntent'); }}
                        onSubmit={submitFeedback}
                        user={user}
                      />
                    </React.Suspense>
                  )}

                  {showFeedbackSuccess && (
                    <FeedbackSuccess onClose={() => setShowFeedbackSuccess(false)} />
                  )}
                  {showAuth && (
                    <Auth 
                      onClose={() => setShowAuth(false)} 
                      onLoginSuccess={handleLoginSuccess}
                      initialPage={authMode}
                    />
                  )}
                </>
              )
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              user && user.role === 'student' ? (
                <StudentDashboard user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/student/analytics" 
            element={
              user && user.role === 'student' ? (
                <StudentAnalytics user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/student/interview-prep" 
            element={
              user && user.role === 'student' ? (
                <InterviewPreparationDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/student/mock-interview" 
            element={
              user && user.role === 'student' ? (
                <div style={{ padding: '50px', textAlign: 'center' }}>
                  <h1>Mock Interview</h1>
                  <p>Mock interview feature coming soon...</p>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/student/history" 
            element={
              user && user.role === 'student' ? (
                <div style={{ padding: '50px', textAlign: 'center' }}>
                  <h1>Past Interviews</h1>
                  <p>Interview history feature coming soon...</p>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/student/resume" 
            element={
              user && user.role === 'student' ? (
                <div style={{ padding: '50px', textAlign: 'center' }}>
                  <h1>Resume & Cover Letter</h1>
                  <p>Resume builder feature coming soon...</p>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              user && user.role === 'student' ? (
                <Profile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Recruiter Routes */}
          <Route 
            path="/recruiter/dashboard" 
            element={
              user && user.role === 'recruiter' ? (
                <RecruiterDashboard user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/recruiter/profile" 
            element={
              user && user.role === 'recruiter' ? (
                <Profile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;