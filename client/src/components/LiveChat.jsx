import { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";

const autoReplies = [
  "Hello! How can we help you today?",
  "Thanks for reaching out! Our team will be with you shortly.",
  "You can also email us at support@hiromart.com or call +250 798 388 890.",
  "Is there anything specific you're looking for? I'm happy to help!",
];

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! Welcome to Hiromart. How can we assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: input.trim() }]);
    setInput("");
    setTyping(true);
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text: reply }]);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark hover:scale-110 transition-all flex items-center justify-center"
      >
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>
      {open && (
        <div className="fixed bottom-40 right-6 z-50 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-primary text-white px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">H</div>
            <div>
              <p className="text-sm font-semibold">Hiromart Chat</p>
              <p className="text-[10px] text-white/70">We typically reply in minutes</p>
            </div>
          </div>
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.from === "user" ? "bg-primary text-white rounded-br-md" : "bg-white text-gray-700 rounded-bl-md shadow-sm border border-gray-100"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 text-xs px-3 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-1">
                  <span className="animate-bounce">.</span><span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span><span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Type a message..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary transition" />
            <button onClick={handleSend} className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition"><FiSend size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
