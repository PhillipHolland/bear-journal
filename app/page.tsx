'use client';

import { useState, useRef, useEffect } from 'react';
import { BearIcon, CopyIcon, ShareIcon, CheckIcon, PlusIcon, SendIcon } from '@/components/Icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-4 px-4 py-2.5 text-sm font-medium text-[#e03e2f] hover:bg-white dark:hover:bg-[#222222] rounded-xl transition-all flex items-center gap-2 button-press smooth-shadow border border-[#e5e5e5] dark:border-[#2a2a2a]"
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <CopyIcon className="w-4 h-4" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

const ShareButton = ({ content }: { content: string }) => {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          text: content,
          title: 'Journal Entry',
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  };

  if (!navigator.share) {
    return null;
  }

  return (
    <button
      onClick={handleShare}
      className="mt-4 px-4 py-2.5 text-sm font-medium text-[#e03e2f] hover:bg-white dark:hover:bg-[#222222] rounded-xl transition-all flex items-center gap-2 button-press smooth-shadow border border-[#e5e5e5] dark:border-[#2a2a2a]"
    >
      {shared ? (
        <>
          <CheckIcon className="w-4 h-4" />
          <span>Shared!</span>
        </>
      ) : (
        <>
          <ShareIcon className="w-4 h-4" />
          <span>Share</span>
        </>
      )}
    </button>
  );
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ready to journal? Morning, midday, or evening?',
    },
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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from API');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${errorMessage}\n\nPlease make sure the GROK_API_KEY is set in your Vercel environment variables.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewEntry = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Ready to journal? Morning, midday, or evening?',
      },
    ]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] dark:bg-[#0f0f0f]">
      {/* Header with glassmorphism */}
      <header className="glass dark:glass-dark px-8 py-5 flex items-center justify-between sticky top-0 z-10 smooth-shadow">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#e03e2f] to-[#c73527] rounded-2xl flex items-center justify-center smooth-shadow-lg transform hover:scale-105 transition-transform">
            <BearIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-[#f5f5f5] tracking-tight">
            Bear Journal
          </h1>
        </div>
        {messages.length > 1 && (
          <button
            onClick={startNewEntry}
            className="px-5 py-2.5 text-sm font-semibold text-[#e03e2f] hover:bg-white dark:hover:bg-[#1a1a1a] rounded-xl transition-all button-press flex items-center gap-2 border border-[#e5e5e5] dark:border-[#2a2a2a]"
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        )}
      </header>

      {/* Messages with improved spacing */}
      <div className="flex-1 overflow-y-auto px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
              {messages.map((message, index) => {
                const isJournalEntry = message.role === 'assistant' &&
                  (message.content.includes('# ') || message.content.includes('## ') ||
                   message.content.includes('### ') || message.content.split('\n').length > 5);

                return (
                  <div
                    key={index}
                    className={`${
                      message.role === 'user'
                        ? 'ml-auto animate-fade-in-up'
                        : 'mr-auto animate-fade-in-up'
                    } max-w-[85%]`}
                  >
                    <div
                      className={`${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-[#e03e2f] to-[#c73527] text-white'
                          : 'bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#f5f5f5] border border-[#e5e5e5] dark:border-[#2a2a2a]'
                      } rounded-2xl px-6 py-4 smooth-shadow`}
                    >
                      <div className="whitespace-pre-wrap break-words leading-relaxed text-base">
                        {message.content}
                      </div>
                      {isJournalEntry && (
                        <div className="flex gap-3 mt-2">
                          <CopyButton content={message.content} />
                          <ShareButton content={message.content} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="mr-auto max-w-[85%] animate-fade-in-up">
                  <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl px-6 py-5 smooth-shadow border border-[#e5e5e5] dark:border-[#2a2a2a]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#e03e2f] rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-[#e03e2f] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-3 h-3 bg-[#e03e2f] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
        </div>
      </div>

      {/* Input with improved design */}
      <div className="glass dark:glass-dark px-8 py-6 border-t border-[#e5e5e5] dark:border-[#2a2a2a]">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 px-6 py-4 bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#f5f5f5] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e03e2f] placeholder-[#999] text-base smooth-shadow border border-[#e5e5e5] dark:border-[#2a2a2a] transition-all"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-8 py-4 bg-gradient-to-br from-[#e03e2f] to-[#c73527] text-white rounded-2xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all button-press smooth-shadow-lg flex items-center gap-2 min-w-[120px] justify-center"
            >
              <SendIcon className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
