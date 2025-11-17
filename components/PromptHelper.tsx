import { useEffect, useState } from 'react';

interface PromptSuggestion {
  text: string;
  keywords: string[];
  timeOfDay?: 'morning' | 'evening' | 'any';
}

const PROMPT_LIBRARY: PromptSuggestion[] = [
  // Time-based initial responses
  { text: 'Morning', keywords: ['time of day', 'morning, midday, or evening'], timeOfDay: 'morning' },
  { text: 'Midday', keywords: ['time of day', 'morning, midday, or evening'], timeOfDay: 'any' },
  { text: 'Evening', keywords: ['time of day', 'morning, midday, or evening'], timeOfDay: 'evening' },

  // Feeling responses
  { text: 'Energized', keywords: ['feeling', 'feel'] },
  { text: 'Tired', keywords: ['feeling', 'feel'] },
  { text: 'Calm', keywords: ['feeling', 'feel'] },
  { text: 'Stressed', keywords: ['feeling', 'feel'] },
  { text: 'Happy', keywords: ['feeling', 'feel'] },
  { text: 'Neutral', keywords: ['feeling', 'feel'] },

  // Exercise responses
  { text: 'Yes, I worked out', keywords: ['exercise', 'workout', 'physical activity'] },
  { text: 'No, rest day', keywords: ['exercise', 'workout'] },
  { text: 'Light activity', keywords: ['exercise', 'workout'] },

  // Work responses
  { text: 'Great day at work', keywords: ['work', 'job', 'office'] },
  { text: 'Challenging day', keywords: ['work', 'job', 'challenges'] },
  { text: 'Productive day', keywords: ['work', 'accomplish'] },
  { text: 'Normal day', keywords: ['work', 'job'] },

  // Reading responses
  { text: 'Yes, read today', keywords: ['reading', 'read', 'book'] },
  { text: 'No reading today', keywords: ['reading', 'read', 'book'] },
  { text: 'Finished a chapter', keywords: ['reading', 'read', 'book'] },

  // Entertainment responses
  { text: 'Yes, watched something', keywords: ['watch', 'movie', 'tv', 'entertainment'] },
  { text: 'No, nothing today', keywords: ['watch', 'movie', 'tv', 'entertainment'] },

  // Family responses
  { text: 'Quality time together', keywords: ['karen', 'wife', 'sydney', 'daxton', 'family'] },
  { text: 'Nothing special', keywords: ['karen', 'sydney', 'daxton'] },
  { text: 'Had a great moment', keywords: ['karen', 'sydney', 'daxton', 'family'] },

  // Gratitude responses
  { text: 'My family', keywords: ['grateful', 'gratitude', 'appreciate'] },
  { text: 'My health', keywords: ['grateful', 'gratitude'] },
  { text: 'Small moments', keywords: ['grateful', 'gratitude', 'pleasures'] },

  // Goals responses
  { text: 'Made progress', keywords: ['goals', 'progress', 'focus'] },
  { text: 'Stayed consistent', keywords: ['goals', 'progress'] },
  { text: 'Need to improve', keywords: ['goals', 'focus', 'tomorrow'] },

  // General positive responses
  { text: 'Yes', keywords: ['did you', 'have you', 'any'] },
  { text: 'No', keywords: ['did you', 'have you', 'any'] },
  { text: 'Not really', keywords: ['did you', 'have you', 'any'] },
];

interface PromptHelperProps {
  lastAssistantMessage: string;
  onSelectPrompt: (text: string) => void;
}

export const PromptHelper = ({ lastAssistantMessage, onSelectPrompt }: PromptHelperProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Get current hour to determine time of day
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'any' : 'evening';

    // Convert message to lowercase for matching
    const messageLower = lastAssistantMessage.toLowerCase();

    // Find matching suggestions
    const matches = PROMPT_LIBRARY.filter(prompt => {
      // Check if any keyword matches the message
      const keywordMatch = prompt.keywords.some(keyword =>
        messageLower.includes(keyword.toLowerCase())
      );

      // Check time of day relevance
      const timeMatch = !prompt.timeOfDay || prompt.timeOfDay === timeOfDay || prompt.timeOfDay === 'any';

      return keywordMatch && timeMatch;
    });

    // Take top 4 matches, prioritize time-specific ones
    const topMatches = matches
      .sort((a, b) => {
        if (a.timeOfDay && !b.timeOfDay) return -1;
        if (!a.timeOfDay && b.timeOfDay) return 1;
        return 0;
      })
      .slice(0, 4)
      .map(m => m.text);

    setSuggestions(topMatches);
  }, [lastAssistantMessage]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectPrompt(suggestion)}
          className="px-4 py-2 bg-white dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#f5f5f5] text-sm rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] hover:border-[#e03e2f] dark:hover:border-[#e03e2f] hover:bg-[#fafafa] dark:hover:bg-[#222222] transition-all button-press smooth-shadow"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
