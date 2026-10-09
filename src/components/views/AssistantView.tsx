import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Shield, RefreshCw } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AssistantView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Greetings. I am KAVACH Assistant, your specialized cybersecurity advisor. You can ask me to explain suspicious links, clarify attack vectors (typosquatting, Punycode, UPI reverse-charge traps), or provide incident containment guidance.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How do I spot fake SBI or HDFC netbanking portals?',
    'Explain the UPI reverse-payment / cashback scam.',
    'I clicked a suspicious link. What are my immediate emergency containment steps?',
    'What is typosquatting and how does Kavach detect it?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        sender: 'assistant',
        text: data.reply || 'Analysis completed.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Security network offline. If in immediate danger, dial 1930 for the Indian Cyber Crime Reporting Helpline.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Chat Messages Viewport */}
      <div className="flex-1 p-6 rounded-2xl glass-panel overflow-y-auto space-y-4 bg-white border border-slate-200 shadow-sm">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 border border-rose-400 flex items-center justify-center shrink-0 shadow-xs">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed space-y-1 shadow-xs ${
                m.sender === 'user'
                  ? 'bg-rose-600 text-white border border-rose-700 rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{m.text}</div>
              <div className={`text-[10px] text-right font-mono ${m.sender === 'user' ? 'text-rose-200' : 'text-slate-400'}`}>{m.time}</div>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-700" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
            <span>Consulting Kavach Cyber Intelligence Engine...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all text-[11px] font-mono cursor-pointer shadow-xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Kavach Assistant for security clarification..."
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-rose-500 text-slate-900 font-sans text-xs outline-none shadow-xs placeholder:text-slate-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputMsg.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
