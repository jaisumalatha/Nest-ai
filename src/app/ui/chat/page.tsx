"use client";
 
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
 
export default function StreamTextPage() {
  const [input, setInput] = useState("");
  const { messages, setMessages, sendMessage } = useChat();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input.trim() });
      setInput("");
    }
  };
 
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            💬 AI Chat Assistant
          </h1>
        </div>
      </header>
 
      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 italic mt-20">
              Start chatting below 👇
            </p>
          )}
 
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <p key={i} className="whitespace-pre-wrap">
                        {part.text}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
 
      {/* Input Area */}
      <footer className="bg-white border-t border-gray-300 shadow-inner">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}