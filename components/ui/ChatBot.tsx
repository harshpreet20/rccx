'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function ChatBubbleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '4px 0', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#888899',
          }}
        />
      ))}
    </div>
  );
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! I'm the RCC Assistant. Ask me anything about membership, events, or our community! 🏸",
};

function genSessionKey() {
  return 'S-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionKeyRef = useRef<string>(genSessionKey());
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const saveSession = useCallback(async (allMessages: Message[]) => {
    const userMessages = allMessages.filter(m => m.role === 'user' || m.role === 'assistant');
    const payload = {
      session_key: sessionKeyRef.current,
      messages: userMessages,
      total_messages: userMessages.length,
      page_url: window.location.href,
      user_agent: navigator.userAgent.slice(0, 200),
      last_message_at: new Date().toISOString(),
    };
    if (sessionIdRef.current) {
      await supabase.from('chat_sessions').update(payload).eq('id', sessionIdRef.current);
    } else {
      const { data } = await supabase.from('chat_sessions').insert({ ...payload, started_at: new Date().toISOString() }).select('id').single();
      if (data) sessionIdRef.current = data.id;
    }
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json() as { reply: string };
      const botMsg: Message = { role: 'assistant', content: data.reply };
      const final = [...updated, botMsg];
      setMessages(final);
      saveSession(final);
    } catch {
      const errMsg: Message = { role: 'assistant', content: "Sorry, I couldn't connect. Please try again!" };
      const final = [...updated, errMsg];
      setMessages(final);
      saveSession(final);
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 500 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            style={{
              position: 'absolute',
              bottom: '68px',
              right: 0,
              width: '400px',
              height: '500px',
              background: 'rgba(17,17,24,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(194,24,24,0.1)',
            }}
            className="chatbot-window"
          >
            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(194,24,24,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(194,24,24,0.3)',
                    border: '1px solid rgba(194,24,24,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <BotIcon />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#e8e8ec',
                      letterSpacing: '0.05em',
                    }}
                  >
                    RCC AI Assistant
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#4ade80',
                      }}
                    />
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#4ade80' }}>
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888899',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#e8e8ec'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#888899'; }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px 12px 12px 4px',
                      padding: '8px 14px',
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about RCC..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  color: '#e8e8ec',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: input.trim() && !loading ? '#C21818' : 'rgba(194,24,24,0.3)',
                  border: 'none',
                  color: '#fff',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: open
            ? 'rgba(17,17,24,0.95)'
            : 'linear-gradient(135deg, #C21818, #8b0000)',
          border: open ? '1px solid rgba(255,255,255,0.1)' : 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(194,24,24,0.5)',
          transition: 'background 0.3s',
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChatBubbleIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <style>{`
        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 40px) !important;
            right: -8px !important;
          }
        }
      `}</style>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '80%',
          padding: '10px 14px',
          borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
          background: isUser ? '#C21818' : 'rgba(255,255,255,0.06)',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--font-inter)',
          fontSize: '13px',
          color: isUser ? '#fff' : '#e8e8ec',
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  );
}
