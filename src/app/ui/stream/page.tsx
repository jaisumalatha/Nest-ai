"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { User, Cpu, Trash2, Send, Bot, Sun, Moon } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function StreamTextPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [animatedAIText, setAnimatedAIText] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit, setInput, completion, isLoading } =
    useCompletion({
      api: "/api/stream",
      onFinish: (prompt, completion) => {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: "user",
          content: prompt,
          timestamp: time,
        };

        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: completion,
          timestamp: time,
        };

        // Animate AI text
        setAnimatedAIText("");
        animateText(completion);

        setMessages((prev) => [...prev, userMessage]);
        setTimeout(() => {
          setMessages((prev) => [...prev, aiMessage]);
        }, completion.length * 15 + 200);

        setInput("");
      },
    });

  // Theme initialization
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, animatedAIText, isLoading]);

  // Typing animation
  const animateText = (text: string) => {
    let index = 0;
    const interval = setInterval(() => {
      setAnimatedAIText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 15);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-screen transition-colors duration-300 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 transition">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            AI Chatbot
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
                <Cpu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
            )}

            <div
              className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-sm relative transition ${
                msg.role === "assistant"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  : "bg-blue-600 text-white"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <span className="absolute text-xs text-gray-400 bottom-1 right-2">
                {msg.timestamp}
              </span>
            </div>

            {msg.role === "user" && (
              <div className="bg-blue-500 rounded-full p-2">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Animated AI Message */}
        {animatedAIText && (
          <div className="flex items-start gap-2">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
              <Cpu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-2xl shadow-sm">
              <p className="whitespace-pre-wrap leading-relaxed">
                {animatedAIText}
                <span className="inline-block w-1 h-4 bg-gray-400 dark:bg-gray-500 ml-1 animate-pulse"></span>
              </p>
            </div>
          </div>
        )}

        {isLoading && !animatedAIText && (
          <div className="flex items-start gap-2">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
              <Cpu className="w-5 h-5 text-gray-700 dark:text-gray-300 animate-pulse" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-2xl shadow-sm italic">
              AI is thinking<span className="animate-pulse">...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-2 transition">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          onClick={(e) => handleSubmit(e as any)}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </footer>

      {/* FOOTER CREDIT */}
      <div className="bg-gradient-to-r from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-center text-xs text-gray-400 dark:text-gray-500 py-2">
        Made with ❤️ using Next.js + AI SDK
      </div>
    </div>
  );
}
