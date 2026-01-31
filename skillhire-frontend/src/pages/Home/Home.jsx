

import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar';
import Testimonials from "../../components/Testimonials";
import interviewImg from "../../assets/Skillhire_Interview.png";
import Lottie from "lottie-react";
import opportunitiesAnimation from "../../assets/social media.json";


import fullstackImg from "../../assets/fullstack.jpg.jpeg";
import backendImg from "../../assets/backend.jpg.jpeg";
import databaseImg from "../../assets/database.jpg.jpeg";
import devopsImg from "../../assets/devops.jpg.jpeg";
import systemdesignImg from "../../assets/system-design.jpg.jpeg";
import dsaImg from "../../assets/dsa.jpg.jpeg";
import mlImg from "../../assets/ml.jpg.jpeg";
import cyberImg from "../../assets/cyber.jpg.jpeg";
import osInternals from "../../assets/os-internals.jpg.jpeg";
import coding_practise from "../../assets/coding_practise.png"
import leaderboard_streak from "../../assets/leaderboards_streaks.png"
import Learning_skill from "../../assets/Learning_skill.png"
import practise_ai_interview from "../../assets/practise_ai_interviews.png"
import student_dashboard from "../../assets/student_dashboard.png"
import recruiter_dashboard from "../../assets/recruiters_dashboard.png"


import { Send, MessageCircle, InstagramIcon, LinkedinIcon } from 'lucide-react';
import { 
  ChevronRight, MessageSquare, Code, BarChart3, 
  LineChart, FileText, Zap, Globe, Video,
  Plus, Minus, Mail, User, CheckCircle, ShieldCheck,
  Facebook, Twitter, Linkedin, Instagram
} from 'lucide-react';

const Home = ({ onAuth, isDarkMode, toggleTheme }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  



  const aboutRef = useRef(null);
  useEffect(() => {
  const cards = document.querySelectorAll(".opportunity-card");



  cards.forEach(card => {
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };

    card.addEventListener("mousemove", handleMouseMove);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
    };
  });
}, []);



//   useEffect(() => {
//   const cards = document.querySelectorAll(".opportunity-card");

//   cards.forEach(card => {
//     const handleMouseMove = (e) => {
//       const rect = card.getBoundingClientRect();
//       card.style.setProperty("--x", `${e.clientX - rect.left}px`);
//       card.style.setProperty("--y", `${e.clientY - rect.top}px`);
//     };

//     card.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       card.removeEventListener("mousemove", handleMouseMove);
//     };
//   });
// }, []);

// 31/01/2026



  const scrollToAbout = (e) => {
    if (e) e.preventDefault();
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    { q: "What is SkillHire?", a: "SkillHire is an AI-powered platform designed to help students and professionals ace their dream job interviews through realistic simulations." },
    { q: "How does the AI feedback work?", a: "Our AI analyzes your speech patterns, technical accuracy, and body language to provide instant, actionable scores." },
    { q: "Is it free to use?", a: "We offer a generous free tier for daily practice, along with premium plans for unlimited mock sessions and advanced analytics." },
    { q: "Can I practice coding interviews?", a: "Yes! We have a dedicated module for technical interviews covering DSA, System Design, and specific languages." }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  const images = [
  interviewImg,
  coding_practise,
  leaderboard_streak,
  Learning_skill,
  practise_ai_interview,
  recruiter_dashboard,
  student_dashboard
];

const [activeIndex, setActiveIndex] = useState(0);
const duration = 3000; // time per image
useEffect(() => {
  const interval = setInterval(() => {
    setActiveIndex(prev => (prev + 1) % images.length);
  }, duration);

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const heroText = document.querySelector('.hero-text-side');
    heroText?.classList.add('active');
  }, []);

  return (
    <div className={`home-page-wrapper ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="nav-sticky-holder">
        <Navbar
          onAuth={onAuth}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onAboutClick={scrollToAbout}
        />
      </header>

      <main className="main-layout">
        {/* HERO SECTION */}
        {/* ASINI */}
        <section className="hero-section" id="home">
          <div className="hero-flex-container">
            <div className="hero-text-side">
              <h1 className="hero-title">
                  Prepare for Your <br />

                  <span className="animated-word dream">
                    {"Dream".split("").map((char, i) => (
                      <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                        {char}
                      </span>
                    ))}
                  </span>

                  <span className="space">&nbsp;</span>

                  <span className="animated-word job">
                    {"Job".split("").map((char, i) => (
                      <span key={i} style={{ animationDelay: `${(i + 5) * 0.08}s` }}>
                        {char}
                      </span>
                    ))}
                  </span>

                  <br />
                  with SkillHire!
                </h1>

              <p className="hero-description">
                AI-powered platform for mock interviews, coding tests, and skill analytics to help you succeed.
              </p>

              <div className="hero-actions">
                <button className="btn-get-started" onClick={() => onAuth('login')}>
                  Get Hired
                </button>
              </div>
            </div>

            <div className="hero-img-container">
              <img
                src="interview-removebg-preview.png"
                alt="SkillHire"
                className="hero-static-img"
              />
            </div>
          </div>
        </section>

        {/* WHY SKILLHIRE */}
        {/* Indu Bai */}
        <section className="why-skillhire-section" id="about" ref={aboutRef}>
          <h2 className="why-title">
            Why Choose <span className="animated-skillhire">SkillHire</span>?
          </h2>

          <p className="why-subtitle">
            Empowering you to ace interviews, sharpen skills, and land your dream job with AI-powered insights.
          </p>

          <div className="why-container-highlighted">
            {[
              { icon: <MessageSquare />, title: "AI Mock Interviews", desc: "Interactive interview simulations" },
              { icon: <Video />, title: "Body Language AI", desc: "Posture & confidence analysis" },
              { icon: <Code />, title: "Coding Tests", desc: "DSA & role-based challenges" },
              { icon: <FileText />, title: "Resume Analysis", desc: "AI-powered CV review" },
              { icon: <BarChart3 />, title: "Skill Analytics", desc: "Visual performance insights" },
              { icon: <LineChart />, title: "Progress Tracking", desc: "Measure growth over time" },
              { icon: <Zap />, title: "Real-Time Feedback", desc: "Instant improvement tips" },
              { icon: <Globe />, title: "24/7 Access", desc: "Practice anytime, anywhere" }
            ].map((feature, i) => (
              <div key={i} className="why-card-hoverable">
                <div className="feature-row">
                  {feature.icon}
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
            {/* what we offer section */}
        <Testimonials onAuth={onAuth} />


        {/* AI INTERVIEW PROMO SECTION --RANI*/}
        {/* Rani */}
        <section className="interview-promo-section">
          <div className="bubble-layer"></div>
          <div className="interview-promo-wrapper">
            
            <h2 className="interview-promo-title">
              Struggling to crack interviews?
            </h2>

            <p className="interview-promo-subtitle">
              Ready to turn interviews into offers?
            </p>


{/* <div className="image-mask-area">
  <div className="interview-preview-animation">
    <img src={interviewImg} className="slide s1" />
    <img src={coding_practise} className="slide s2" />
    <img src={leaderboard_streak} className="slide s3" />
    <img src={Learning_skill} className="slide s4" />
    <img src={practise_ai_interview} className="slide s5" />
    <img src={recruiter_dashboard} className="slide s6" />
    <img src={student_dashboard} className="slide s7" />
  </div>
  <div className="scan-lines">
    <div className="scan-bar active"></div>
    <div className="scan-bar"></div>
    <div className="scan-bar"></div>
  </div>
</div> */}


  {/* IMAGE AREA */}
  <div className="image-mask-area">
    {images.map((img, index) => (
      <img
        key={index}
        src={img}
        className={`scan-image ${index === activeIndex ? "active" : ""}`}
        alt=""
      />
    ))}
  </div>

  {/* SCAN BARS BELOW IMAGE */}
  <div className="scan-bars">
    {images.map((_, index) => (
      <div className="scan-bar" key={index}>
        <div
          className={`scan-fill ${
            index === activeIndex ? "active" : ""
          }`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    ))}
  </div>

</div>

</section>


<section className="job-ready-courses">
  <div className="floating-container">
    
    {/* Center Heading */}
    <div className="job-ready-center">
      <h2>Job Ready Courses</h2>
      <p>Join thousands of learners and gain the skills you need to succeed.</p>
    </div>
    {/* The Cards Arced Around */}
    <div className="course-card card-1">
       <img src={fullstackImg} alt="" />
        <h4>Full Stack Web Development</h4>
        <span>HTML • CSS • React • Node</span>
    </div>
    <div className="course-card card-2">
       <img src={backendImg} alt="" />
        <h4>Backend Developer Crash Course</h4>
        <span>APIs • Auth • Scaling</span>
    </div>
    <div className="course-card card-3">
       <img src={systemdesignImg} alt="" />
        <h4>System Design</h4>
        <span>HLD • LLD • Architecture</span>
    </div>
    <div className="course-card card-4">
       <img src={databaseImg} alt="" />
        <h4>Database Engineering</h4>
        <span>SQL • NoSQL • Indexing</span>
    </div>
    <div className="course-card card-5">
       <img src={osInternals} alt="" />
       <h4>OS Internals & Kernel</h4>
       <span>Memory Mgmt • Scheduling • Unix</span>
    </div>

    {/* Bottom Row Cards */}
    <div className="course-card card-6">
       <img src={devopsImg} alt="" />
        <h4>DevOps Fundamentals</h4>
        <span>Docker • CI/CD • Cloud</span>
    </div>
    <div className="course-card card-7">
       <img src={dsaImg} alt="" />
        <h4>DSA for Interviews</h4>
        <span>Arrays • Trees • Graphs</span>
    </div>
    <div className="course-card card-8">
       <img src={mlImg} alt="" />
        <h4>Machine Learning Basics</h4>
        <span>Python • Models • Metrics</span>
    </div>
    <div className="course-card card-9">
       <img src={cyberImg} alt="" />
        <h4>Cyber Security Essentials</h4>
        <span>Networks • Attacks • Defense</span>
    </div>
  </div>
</section>

{/* LATEST OPPORTUNITIES SECTION */}
{/* Rani */}
<section className="opportunities-section">
  <div className="opportunities-wrapper">
    
    {/* Left Image */}
    <div className="opportunities-image">
    <Lottie animationData={opportunitiesAnimation} loop={true} />
    </div>

    {/* Right Cards Container */}
    <div className="opportunities-cards-container">
      <h2 className="opportunities-title">
        Get the <span>Latest Opportunities</span>
      </h2>
      <p className="opportunities-subtitle">
        Stay updated with internships, jobs, hackathons & hiring alerts
      </p>

      <div className="opportunities-cards-grid">
        <a href="#" className="opportunity-card telegram">
          <Send size={36} />
          <h3>Telegram</h3>
          <p>Instant job & internship alerts</p>
        </a>

        <a href="#" className="opportunity-card whatsapp">
          <MessageCircle size={36} />
          <h3>WhatsApp</h3>
          <p>Daily curated opportunities</p>
        </a>

        <a href="#" className="opportunity-card instagram">
          <InstagramIcon size={36} />
          <h3>Instagram</h3>
          <p>Hiring posts & career tips</p>
        </a>

        <a href="#" className="opportunity-card linkedin">
          <LinkedinIcon size={36} />
          <h3>LinkedIn</h3>
          <p>Professional job updates</p>
        </a>
      </div>
    </div>

  </div>
</section>

       {/* FAQ SECTION */}
       {/* ASINI */}
        <section className="faq-section" id="faq">
        <h2 className="section-title">
  <span className="animated-word dream">
    {"Frequently".split("").map((char, i) => (
      <span key={i} style={{ animationDelay: `${i * 0.06}s` }}>
        {char}
      </span>
    ))}
  </span>

  <span className="space">&nbsp;</span>

  <span className="animated-word job">
    {"Asked".split("").map((char, i) => (
      <span key={i} style={{ animationDelay: `${(i + 11) * 0.06}s` }}>
        {char}
      </span>
    ))}
  </span>

  <span className="space">&nbsp;</span>

  <span className="animated-word dream">
    {"Questions".split("").map((char, i) => (
      <span key={i} style={{ animationDelay: `${(i + 17) * 0.06}s` }}>
        {char}
      </span>
    ))}
  </span>
</h2>

          <div className="faq-accordion">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="faq-header">
                  <span className="faq-icon-box">{activeFaq === i ? <Minus size={16} /> : <Plus size={16} />}</span>
                  <span className="faq-question">{faq.q}</span>
                  <ChevronRight className={`faq-chevron ${activeFaq === i ? 'rotate' : ''}`} />
                </div>
                {activeFaq === i && <div className="faq-content"><p>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        {/* ASINI */}
        <section className="contact-section" id="contact">
        <div className="contact-card contact-animate">
            <div className="contact-info-text">
              <h2>Contact <span>Admin</span></h2>
              <p>Send us a message and we'll get back to you shortly.</p>
            </div>
            {submitted ? (
              <div className="form-success-alert"><CheckCircle size={30} color="#22c55e" /> <p>Message sent!</p></div>
            ) : (
              <form className="contact-form-ui" onSubmit={handleContactSubmit}>
                <div className="form-input-box">
                  <label><User size={16} /> Name</label>
                  <input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-input-box">
                  <label><Mail size={16} /> Email</label>
                  <input type="email" placeholder="Your Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-input-box">
                  <label>Message</label>
                  <textarea placeholder="How can we help?" rows="3" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                </div>
                <button type="submit" className="btn-submit-form">Send Message <Send size={18} /></button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="home-footer-slim">
        <div className="footer-container">
          <div className="footer-brand-box">
            <ShieldCheck size={24} />
            <span className="logo-text-footer">SkillHire</span>
          </div>

          <p>© 2026 SkillHire AI. All rights reserved.</p>

          <div className="footer-social-links">
            <Facebook size={20} />
            <Twitter size={20} />
            <Linkedin size={20} />
            <Instagram size={20} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
