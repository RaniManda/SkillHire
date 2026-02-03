import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Maximize2, Minimize2 } from "lucide-react";
import "./Chatbot.css";
import Lottie from "lottie-react";
import opportunitiesAnimation from "../assets/chatbot.json";

// ⭐ BACKEND API CONFIGURATION
// Make sure your Django backend is running on http://localhost:8000
const BACKEND_URL = "http://localhost:8000/api/chat";

// Demo responses for when backend is not available
const DEMO_RESPONSES = {
  "interview": "Great! I can help you prepare for interviews. What type of interview are you preparing for? Technical, HR, or behavioral?",
  "hello": "Hello! 👋 I'm SkillHire AI. How can I help you prepare for your interview?",
  "hi": "Hi there! 😊 I'm here to help you ace your interviews!",
  "help": "I can help with:\n• Technical interview prep\n• System design questions\n• Behavioral questions\n• DSA practice\n• Communication tips\n\nWhat would you like to work on?",
  "default": "I'm ready to help. Please make sure the backend is running at http://localhost:8000"
};

const getDemoResponse = (text) => {
  const lower = text.toLowerCase();
  for (const [key, response] of Object.entries(DEMO_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return DEMO_RESPONSES.default;
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm SkillHire AI. How can I help you prepare for your interview?" }
  ]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking"); // checking, connected, failed
  const [showAnimation, setShowAnimation] = useState(true);
  const [userSentMessage, setUserSentMessage] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Hide animation when user sends first message
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === "user") {
      setShowAnimation(false);
      setUserSentMessage(true);
    }
  }, [messages]);
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check API status when component mounts
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "test" })
        });
        setApiStatus(response.ok ? "connected" : "failed");
      } catch (error) {
        setApiStatus("failed");
      }
    };
    
    if (open) {
      checkBackend();
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      // Try backend API with conversation history
      console.log("🔄 Sending message to backend API:", BACKEND_URL);
      const backendRes = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          message: userInput,
          history: messages  // Send conversation history for context
        }),
        timeout: 15000
      });
      

      console.log("📊 Backend Status:", backendRes.status);

      if (backendRes.ok) {
        const data = await backendRes.json();
        const botReply = data.reply || data.message || "I couldn't generate a response.";
        console.log("✅ Backend API Success!");
        setApiStatus("connected");
        setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
        setLoading(false);
        return;
      } else {
        const errorText = await backendRes.text();
        console.error("❌ Backend Error:", backendRes.status, errorText);
        setApiStatus("failed");
      }
    } catch (error) {
      console.error("❌ Connection Error:", error.message);
      setApiStatus("failed");
    }

    // Fallback to demo mode
    console.log("📝 Using demo/fallback mode");
    const demoReply = getDemoResponse(userInput);
    setMessages(prev => [...prev, { sender: "bot", text: demoReply }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button className="chat-fab" onClick={() => setOpen(!open)} title="Open chat assistant">
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className={`chat-window ${fullscreen ? "fullscreen" : ""}`}>
          <div className="chat-header">
            <span>SkillHire AI 🤖</span>
            <div className="header-controls">
              <span className={`status-indicator ${apiStatus}`} title={apiStatus === "connected" ? "Connected to backend" : "Running in demo mode"}></span>
              <button 
                onClick={() => setFullscreen(!fullscreen)}
                className="header-btn"
                title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                onClick={() => setOpen(false)}
                className="header-btn"
                title="Minimize"
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
          

          <div className="chat-body">
            {messages.map((m, i) => (
              <React.Fragment key={i}>
                <div className={`msg ${m.sender}`}>
                  {m.text}
                </div>
                {i === 0 && showAnimation && !userSentMessage && (
                  <div className="opportunities-image">
                    <Lottie animationData={opportunitiesAnimation} loop={true} />
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {loading && (
              <div className="msg bot">
                <div className="typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-section">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about interview prep..."
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              disabled={loading}
              className="chat-input-field"
            />
            <button 
              onClick={sendMessage}
              disabled={loading}
              className="chat-send-btn"
              title="Send message (Enter)"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;