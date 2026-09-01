import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Same API base as AppContext — reads VITE_API_BASE_URL build-time env var
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  MessageSquare, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight,
  User,
  Info
} from 'lucide-react';

export const AiAssistant = () => {
  const { isAiOpen, setIsAiOpen, userProfile, selectedScheme, t } = useApp();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste! I am your UdyamSetu AI Assistant. I can help explain credit schemes, calculate moratorium benefits, explain required documents, or guide you to Channel Partners. How may I assist you today?",
      sources: ["UdyamSetu Knowledge Base"]
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "What is a moratorium period?",
    "Which documents do I need for Micro Finance?",
    "How do Channel Partners disburse the loan?",
    "Can I get a loan for a Dairy project under ₹2 Lakhs?"
  ];

  const handleSend = async (questionText = inputQuestion) => {
    const q = questionText.trim();
    if (!q || isLoading) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: q }];
    setMessages(newMessages);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          user_context: {
            project_type: userProfile.project_type,
            project_cost: userProfile.estimated_project_cost,
            scheme: selectedScheme?.name
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: data.answer,
            sources: data.source_topics,
            disclaimer: data.disclaimer
          }
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: "I'm temporarily unable to reach the knowledge base. Please check official scheme guidelines or try again."
          }
        ]);
      }
    } catch (err) {
      console.error("AI Assistant error:", err);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: "Connection error. Please ensure the backend service is running."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Persistent Floating Trigger Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 border-2 border-amber-400 cursor-pointer ${
          isAiOpen ? 'hidden' : 'block'
        }`}
        title="Open AI Financial Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-amber-300" />
          <span className="w-2 h-2 bg-emerald-400 rounded-full absolute -top-0.5 -right-0.5 animate-ping"></span>
        </div>
        <span className="text-xs font-bold hidden sm:inline">{t.ai.title}</span>
      </button>

      {/* Floating Chat Modal / Drawer */}
      {isAiOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-4 flex justify-between items-center border-b border-blue-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center border border-amber-400">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm">{t.ai.title}</h3>
                <p className="text-[10px] text-blue-200">{t.ai.tagline}</p>
              </div>
            </div>
            <button
              onClick={() => setIsAiOpen(false)}
              className="text-blue-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl space-y-1.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-900 text-white rounded-tr-xs shadow-sm font-medium'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-[11px] sm:text-xs">{m.text}</p>
                  {m.sources && (
                    <div className="pt-1.5 border-t border-slate-100 flex flex-wrap gap-1 text-[9px] text-slate-400 font-medium">
                      <span>Sources:</span>
                      {m.sources.map((s, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-500 text-[11px] pl-8">
                <span className="w-3 h-3 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></span>
                <span>Retrieving scheme guidelines...</span>
              </div>
            )}
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
            <span className="font-bold text-slate-400 shrink-0">Ask:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={t.ai.placeholder}
              className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-700 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white px-3.5 py-2 rounded-xl shadow cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Safety Disclaimer */}
          <div className="bg-slate-100 px-3 py-1 text-[9px] text-center text-slate-500 border-t border-slate-200">
            {t.ai.disclaimer}
          </div>
        </div>
      )}
    </>
  );
};
