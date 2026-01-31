import React, { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import "./Chatbot.css";
import Lottie from "lottie-react";
import opportunitiesAnimation from "../assets/chatbot.json";


const Chatbot = () => {
  
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I’m SkillHire AI. How can I help you?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error" }
      ]);
    }
  };

  return (
    <>
    
      {/* Floating Button */}
      <button className="chat-fab" onClick={() => setOpen(!open)}>
        {open ? <X /> : <MessageSquare />}
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
          </div>
          <div className="opportunities-image">
  <Lottie animationData={opportunitiesAnimation} loop={true} />
</div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
