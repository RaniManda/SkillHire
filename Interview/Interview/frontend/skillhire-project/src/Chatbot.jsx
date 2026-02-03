// import React, { useState } from "react";
// import { MessageSquare, X, Send } from "lucide-react";
// import "./Chatbot.css";
// import Lottie from "lottie-react";
// import opportunitiesAnimation from "../assets/chatbot.json";


// const Chatbot = () => {
  
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hi 👋 I’m SkillHire AI. How can I help you?" }
//   ]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg = { sender: "user", text: input };
//     setMessages(prev => [...prev, userMsg]);
//     setInput("");

//     try {
//       const res = await fetch("http://localhost:5000/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMsg.text })
//       });

//       const data = await res.json();

//       setMessages(prev => [
//         ...prev,
//         { sender: "bot", text: data.reply }
//       ]);
//     } catch {
//       setMessages(prev => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Server error" }
//       ]);
//     }
//   };

//   return (
//     <>
    
//       {/* Floating Button */}
//       <button className="chat-fab" onClick={() => setOpen(!open)}>
//         {open ? <X /> : <MessageSquare />}
//       </button>

//       {/* Chat Window */}
//       {open && (
//         <div className="chat-window">
//           <div className="chat-header">SkillHire AI 🤖</div>

//           <div className="chat-body">
//             {messages.map((m, i) => (
//               <div key={i} className={`msg ${m.sender}`}>
//                 {m.text}
//               </div>
//             ))}
//           </div>
//           <div className="opportunities-image">
//   <Lottie animationData={opportunitiesAnimation} loop={true} />
// </div>

//           <div className="chat-input">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button onClick={sendMessage}>
//               <Send size={18} />
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Chatbot;

import React, { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import "./Chatbot.css";

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
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I’m SkillHire AI. How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      // Try backend API with conversation history
      console.log("🔄 Trying backend API at:", BACKEND_URL);
      const backendRes = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          message: userInput,
          history: messages  // Send conversation history for context
        })
      });

      console.log("📊 Backend Status:", backendRes.status);

      if (backendRes.ok) {
        const data = await backendRes.json();
        const botReply = data.reply || data.message || "Response received";
        console.log("✅ Backend API Success!");
        setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
        setLoading(false);
        return;
      } else {
        const errorText = await backendRes.text();
        console.error("❌ Backend Error:", backendRes.status, errorText);
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
    }

    // Fallback to demo mode
    console.log("📝 Using demo mode");
    const demoReply = getDemoResponse(userInput);
    setMessages(prev => [...prev, { sender: "bot", text: demoReply }]);
    setLoading(false);
  };

  return (
    <>
    
      {/* Floating Button */}
      <button className="chat-fab" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">SkillHire AI 🤖</div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="msg bot">
                <div className="typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-section">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              disabled={loading}
              className="chat-input-field"
            />
            <button 
              onClick={sendMessage}
              disabled={loading}
              className="chat-send-btn"
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

