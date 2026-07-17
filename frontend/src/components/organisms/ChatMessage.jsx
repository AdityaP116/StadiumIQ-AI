/**
 * StadiumIQ — Chat Message (Organism)
 *
 * Renders a single chat bubble (User or AI).
 * Includes Markdown parsing, code highlighting, and a copy button.
 * Supports an optional simulated typing effect.
 */

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useAuth } from '@context/AuthContext';

const ChatMessage = ({
  role = 'user', // 'user' | 'ai'
  content = '',
  isTyping = false,
  onTypingComplete,
}) => {
  const { user } = useAuth();
  const [displayedContent, setDisplayedContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const typingSpeedRef = useRef(15); // ms per character

  const isAI = role === 'ai';

  // Simulated Typing Effect
  useEffect(() => {
    if (!isTyping || !content) {
      setDisplayedContent(content);
      if (isTyping && onTypingComplete) onTypingComplete();
      return;
    }

    let i = 0;
    setDisplayedContent('');
    const timer = setInterval(() => {
      setDisplayedContent((prev) => prev + content.charAt(i));
      i++;
      if (i >= content.length) {
        clearInterval(timer);
        if (onTypingComplete) onTypingComplete();
      }
    }, typingSpeedRef.current);

    return () => clearInterval(timer);
  }, [content, isTyping, onTypingComplete]);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-4 p-5 sm:p-6 transition-all duration-300 border-b border-white/[0.02] ${isAI ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-transparent hover:bg-primary-900/10'}`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {isAI ? (
          <div className="w-8 h-8 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shadow-glow-accent">
            <Bot size={18} className="text-accent-400" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-primary-600/40 border border-primary-500/30 flex items-center justify-center">
            <span className="text-primary-300 text-xs font-semibold">
              {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? <User size={16} />}
            </span>
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-1">
          <p className="text-sm font-semibold text-white/90">
            {isAI ? 'StadiumIQ AI' : user?.displayName ?? 'You'}
          </p>
          {isAI && !isTyping && (
            <button
              onClick={handleCopy}
              className="text-white/30 hover:text-white/80 transition-colors flex items-center gap-1 text-xs"
              title="Copy response"
            >
              {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        <div className="prose prose-invert max-w-none text-[15px] prose-p:leading-relaxed prose-pre:bg-surface-950 prose-pre:border prose-pre:border-white/10 prose-pre:p-0 prose-a:text-primary-400">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg m-0 text-[13px]"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={`${className} bg-white/10 px-1.5 py-0.5 rounded-md text-[13px]`}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {displayedContent}
          </ReactMarkdown>
          {isTyping && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-accent-400 animate-pulse" />}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
