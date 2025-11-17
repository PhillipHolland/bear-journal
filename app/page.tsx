'use client';

import { useState, useRef, useEffect } from 'react';

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
      className="mt-3 px-3 py-1.5 text-sm font-medium text-[#e03e2f] hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors flex items-center gap-2"
    >
      {copied ? (
        <>
          <span>✓</span>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <span>📋</span>
          <span>Copy Entry</span>
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
    <div className="flex flex-col h-screen bg-white dark:bg-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] dark:border-[#3a3a3a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#e03e2f] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🐻</span>
          </div>
          <h1 className="text-xl font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">
            Bear Journal
          </h1>
        </div>
        {messages.length > 1 && (
          <button
            onClick={startNewEntry}
            className="px-4 py-2 text-sm font-medium text-[#e03e2f] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            New Entry
          </button>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
              {messages.map((message, index) => {
                const isJournalEntry = message.role === 'assistant' &&
                  (message.content.includes('# ') || message.content.includes('## ') ||
                   message.content.includes('### ') || message.content.split('\n').length > 5);

                return (
                  <div
                    key={index}
                    className={`${
                      message.role === 'user'
                        ? 'ml-auto bg-[#e03e2f] text-white'
                        : 'mr-auto bg-[#f5f5f5] dark:bg-[#2a2a2a] text-[#1a1a1a] dark:text-[#f5f5f5]'
                    } max-w-[80%] rounded-2xl px-5 py-3`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    {isJournalEntry && <CopyButton content={message.content} />}
                  </div>
                );
              })}
              {isLoading && (
                <div className="mr-auto bg-[#f5f5f5] dark:bg-[#2a2a2a] max-w-[80%] rounded-2xl px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-[#e03e2f] rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></div>
                    <div className="w-2.5 h-2.5 bg-[#e03e2f] rounded-full animate-bounce" style={{ animationDelay: '0.15s', animationDuration: '0.8s' }}></div>
                    <div className="w-2.5 h-2.5 bg-[#e03e2f] rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.8s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#e5e5e5] dark:border-[#3a3a3a] px-6 py-4">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 bg-[#f5f5f5] dark:bg-[#2a2a2a] text-[#1a1a1a] dark:text-[#f5f5f5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e03e2f] placeholder-[#999]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-[#e03e2f] text-white rounded-xl font-medium hover:bg-[#c73527] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
