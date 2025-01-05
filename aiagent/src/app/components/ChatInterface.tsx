"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, ChevronDown, Command } from 'lucide-react';

interface Message {
  role: string;
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome to Crustdata API Support! 👋 How can I assist you today?'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg 
                    border border-slate-200/60 flex flex-col overflow-hidden transition-all duration-200">
      {/* Enhanced Chat header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-md">
            <Command className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Crustdata API Assistant
            </h1>
            <p className="text-sm text-slate-500">Powered by Advanced AI</p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-lg">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Enhanced Messages container */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white/50 p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            }`}
          >
            {/* Enhanced Avatar */}
            <div className={`flex-shrink-0 rounded-xl p-2.5 shadow-md ${
              message.role === 'user' 
                ? 'bg-gradient-to-tr from-blue-600 to-blue-500' 
                : message.role === 'system'
                ? 'bg-gradient-to-tr from-slate-700 to-slate-600'
                : 'bg-gradient-to-tr from-violet-600 to-indigo-600'
            }`}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Enhanced Message bubble */}
            <div className={`flex flex-col space-y-1.5 max-w-[85%] md:max-w-[70%]`}>
              <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white ml-auto'
                  : message.role === 'system'
                  ? 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800'
                  : 'bg-white text-slate-800 border border-slate-200/60'
              }`}>
                <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                  {message.content}
                </pre>
              </div>
              <span className="text-xs text-slate-400 px-2 flex items-center gap-1.5">
                {message.role === 'user' ? 'You' : 'Assistant'} 
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                Just now
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input area */}
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