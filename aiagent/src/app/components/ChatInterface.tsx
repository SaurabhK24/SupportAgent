"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Bot,
  User,
  Code,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Message {
  role: string;
  content: string;
  type?: "code" | "text";
  language?: string;
  timestamp?: number;
}

const MessageContent = ({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) => {
  if (isUser) {
    return <p className="text-sm md:text-base leading-relaxed">{content}</p>;
  }

  return (
    <ReactMarkdown
      className="prose prose-sm md:prose-base prose-slate max-w-none 
                prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base 
                prose-p:leading-relaxed prose-pre:p-0 prose-pre:my-0 prose-pre:bg-transparent
                prose-code:text-blue-600 prose-code:before:content-none prose-code:after:content-none"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const code = String(children).replace(/\n$/, "");

          if (!inline && match) {
            return (
              <div className="my-3 overflow-hidden rounded-lg">
                <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800 text-slate-300 text-xs">
                  <span>{match[1].toUpperCase()}</span>
                  <Code className="w-4 h-4" />
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  showLineNumbers
                  {...props}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code
              className="px-1.5 py-0.5 rounded-md bg-slate-100 text-blue-600 text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const ChatInterface = () => {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Welcome to Crustdata API Support! 👋 How can I assist you today?",
      type: "text",
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp?: number) => {
    if (!timestamp || !mounted) return "Just now";

    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      type: "text",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
        type: data.content.includes("```") ? "code" : "text",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Sorry, I encountered an error. Please try again.",
          type: "text",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-8rem)] max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg 
                    border border-slate-200/60 flex flex-col overflow-hidden transition-all duration-200">
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white/50 p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === "user"
                ? "flex-row-reverse space-x-reverse"
                : "flex-row"
            }`}
          >
            <div
              className={`flex-shrink-0 rounded-xl p-2.5 shadow-md ${
                message.role === "user"
                  ? "bg-gradient-to-tr from-blue-600 to-blue-500"
                  : message.role === "system"
                  ? "bg-gradient-to-tr from-slate-700 to-slate-600"
                  : "bg-gradient-to-tr from-violet-600 to-indigo-600"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`flex flex-col space-y-1.5 max-w-[85%] md:max-w-[75%] ${
                message.role === "user" ? "ml-auto" : ""
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    : message.role === "system"
                    ? "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800"
                    : "bg-white text-slate-800 border border-slate-200/60"
                }`}
              >
                <MessageContent
                  content={message.content}
                  isUser={message.role === "user"}
                />
              </div>
              <span className="text-xs text-slate-400 px-2 flex items-center gap-1.5">
                {message.role === "user" ? "You" : "Assistant"}
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-4 md:p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Crustdata APIs..."
                className="w-full rounded-xl border border-slate-200/60 bg-white/80 px-4 py-3.5 
                 text-slate-800 placeholder-slate-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                 transition-all duration-200 shadow-sm"
                disabled={isLoading}
              />
              <div className="absolute right-3 bottom-3.5 text-xs text-slate-400 bg-white/80 px-2 py-0.5 rounded-md">
                ⌘ + Enter
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-6 py-3.5
               hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 
               disabled:from-slate-300 disabled:to-slate-200 disabled:cursor-not-allowed
               flex items-center space-x-2 min-w-[120px] justify-center shadow-md
               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
          <div className="mt-3 text-xs text-slate-400 text-center md:text-left flex items-center justify-center md:justify-start gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
            For general support, contact help@crustdata.com
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
