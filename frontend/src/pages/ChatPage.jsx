/**
 * StadiumIQ — Fan AI Chat Page
 * Multilingual AI assistant for stadium fans.
 * ChatGPT-style interface with markdown rendering, history, and auto-scroll.
 */

import { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Trash2, Languages, Sparkles } from 'lucide-react';
import { useAIMutation } from '@hooks/useAIMutation';
import { sendFanChat } from '@services/ai.service';
import {
  PageContainer,
  SectionHeader,
  Button,
  Input,
  AIThinking,
  ErrorBoundary
} from '@components';
import ChatMessage from '@components/organisms/ChatMessage'; // Direct import to avoid circular issues

const SUGGESTED_PROMPTS = [
  "Where is the nearest food court to section 112?",
  "What is the quickest route to Gate 4?",
  "Are there accessible restrooms nearby?",
  "How long is the line for the Gold Line Metro?"
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic (العربية)' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'fr', label: 'French (Français)' },
];

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const chatMutation = useAIMutation(sendFanChat, {
    showSuccessToast: false,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'ai', content: data.response || data, isNew: true }
      ]);
      setIsTyping(true); // Trigger typing effect in ChatMessage
    },
    onError: () => {
      // On error, remove the temporary loading message
      setMessages((prev) => prev.filter(m => m.id !== 'loading'));
    }
  });

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (text) => {
    const msgText = (text || inputValue).trim();
    if (!msgText || chatMutation.isPending || isTyping) return;

    // Add user message
    const userMsg = { id: Date.now(), role: 'user', content: msgText };
    // Add temporary loading indicator
    const loadMsg = { id: 'loading', role: 'ai', content: '' };

    setMessages((prev) => [...prev, userMsg, loadMsg]);
    setInputValue('');

    chatMutation.mutate({
      message: msgText,
      language,
      userLocation: 'Unknown',
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all chat history?')) {
      setMessages([]);
    }
  };

  const handleRetry = () => {
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // Remove any trailing AI messages (including errors/loading)
      const userIndex = messages.findIndex(m => m.id === lastUserMsg.id);
      setMessages(messages.slice(0, userIndex));
      handleSend(lastUserMsg.content);
    }
  };

  return (
    <PageContainer className="h-[calc(100vh-64px)] max-h-screen pt-4 pb-0 flex flex-col md:px-8">
      <SectionHeader
        title="Fan Assistant"
        description="AI-powered help for stadium visitors."
        action={
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-white/40" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-surface-900 border border-white/10 text-white text-sm rounded-lg px-2 py-1.5 outline-none focus:border-primary-500 transition-colors"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Main Chat Area */}
      <div className="flex-1 card-glass flex flex-col overflow-hidden relative shadow-2xl border-white/[0.05]">

        {/* Action Bar (Top Right Overlay) */}
        {messages.length > 0 && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            {chatMutation.isError && (
              <Button variant="outline" size="sm" onClick={handleRetry} leftIcon={<RefreshCw size={14} />}>
                Retry
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleClear} leftIcon={<Trash2 size={14} />} className="text-white/40 hover:text-red-400 hover:bg-red-500/10">
              Clear
            </Button>
          </div>
        )}

        {/* Message List */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-6 shadow-glow-accent">
                <Sparkles size={32} className="text-accent-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">How can I help you today?</h2>
              <p className="text-white/40 text-sm max-w-md mb-8">
                I can assist with navigation, food recommendations, transport schedules, and general stadium inquiries in multiple languages.
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary-500/30 transition-all duration-300 text-[15px] text-left text-white/70 hover:text-white hover:scale-[1.01] active:scale-[0.99] shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-6">
              {messages.map((msg) => {
                if (msg.id === 'loading') {
                  return (
                    <div key="loading" className="p-6 bg-surface-900/50 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shadow-glow-accent shrink-0">
                        <Sparkles size={16} className="text-accent-400 animate-pulse" />
                      </div>
                      <AIThinking label="Thinking…" />
                    </div>
                  );
                }

                return (
                  <ErrorBoundary key={msg.id}>
                    <ChatMessage
                      role={msg.role}
                      content={msg.content}
                      isTyping={msg.isNew && msg.role === 'ai'}
                      onTypingComplete={() => {
                        setMessages((prev) =>
                          prev.map((m) => (m.id === msg.id ? { ...m, isNew: false } : m))
                        );
                        setIsTyping(false);
                      }}
                    />
                  </ErrorBoundary>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-white/[0.08] bg-surface-950/80 backdrop-blur-xl shrink-0">
          <div className="relative max-w-4xl mx-auto shadow-xl rounded-xl">
            <Input
              ref={inputRef}
              as="textarea"
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={chatMutation.isPending || isTyping}
              placeholder={isTyping ? "AI is typing..." : "Message StadiumIQ..."}
              className="pr-12 resize-none overflow-hidden max-h-[200px]"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || chatMutation.isPending || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-white/10 transition-colors"
              aria-label="Send message"
            >
              <Send size={14} className={inputValue.trim() ? "translate-x-[1px]" : ""} />
            </button>
          </div>
          <p className="text-center text-[10px] text-white/30 mt-2">
            AI can make mistakes. Consider verifying important information with stadium staff.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default ChatPage;
