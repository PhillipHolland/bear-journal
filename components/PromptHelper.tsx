import { useEffect, useState } from 'react';

interface PromptSuggestion {
  text: string;
  category: string;
  keywords: string[];
  timeOfDay?: 'morning' | 'evening' | 'any';
  priority?: number; // Higher = more specific
}

const PROMPT_LIBRARY: PromptSuggestion[] = [
  // Time-based initial responses (very specific)
  { text: 'Morning', category: 'time', keywords: ['morning, midday, or evening', 'what time'], priority: 10, timeOfDay: 'morning' },
  { text: 'Midday', category: 'time', keywords: ['morning, midday, or evening', 'what time'], priority: 10, timeOfDay: 'any' },
  { text: 'Evening', category: 'time', keywords: ['morning, midday, or evening', 'what time'], priority: 10, timeOfDay: 'evening' },

  // Feeling responses (specific)
  { text: 'Energized', category: 'feeling', keywords: ['how are you feeling', 'how do you feel', 'feeling'], priority: 8 },
  { text: 'Tired', category: 'feeling', keywords: ['how are you feeling', 'how do you feel', 'feeling'], priority: 8 },
  { text: 'Calm', category: 'feeling', keywords: ['how are you feeling', 'how do you feel', 'feeling'], priority: 8 },
  { text: 'Stressed', category: 'feeling', keywords: ['how are you feeling', 'how do you feel', 'feeling'], priority: 8 },
  { text: 'Happy', category: 'feeling', keywords: ['how are you feeling', 'how do you feel', 'feeling'], priority: 8 },
  { text: 'Neutral', category: 'feeling', keywords: ['how are you feeling', 'how do you feel', 'feeling'], priority: 8 },

  // Exercise responses
  { text: 'Yes, I worked out', category: 'exercise', keywords: ['did you exercise', 'workout', 'exercise today'], priority: 9 },
  { text: 'No, rest day', category: 'exercise', keywords: ['did you exercise', 'exercise today'], priority: 9 },
  { text: 'Light activity', category: 'exercise', keywords: ['did you exercise', 'exercise today'], priority: 9 },
  { text: 'Walking', category: 'exercise', keywords: ['what kind', 'exercise', 'workout'], priority: 7 },
  { text: 'Gym workout', category: 'exercise', keywords: ['what kind', 'exercise', 'workout'], priority: 7 },
  { text: 'Running', category: 'exercise', keywords: ['what kind', 'exercise', 'workout'], priority: 7 },

  // Work responses
  { text: 'Great day', category: 'work', keywords: ['how was work', 'work today'], priority: 9 },
  { text: 'Challenging', category: 'work', keywords: ['how was work', 'work today'], priority: 9 },
  { text: 'Productive', category: 'work', keywords: ['how was work', 'work today'], priority: 9 },
  { text: 'Normal day', category: 'work', keywords: ['how was work', 'work today'], priority: 9 },

  // Reading responses
  { text: 'Yes, I read', category: 'reading', keywords: ['did you read', 'read today'], priority: 9 },
  { text: 'No reading today', category: 'reading', keywords: ['did you read', 'read today'], priority: 9 },
  { text: 'Finished a chapter', category: 'reading', keywords: ['did you read', 'read today'], priority: 9 },
  { text: 'About 30 minutes', category: 'reading', keywords: ['how long', 'for how long'], priority: 8 },
  { text: 'Just a few pages', category: 'reading', keywords: ['how long', 'how much'], priority: 8 },
  { text: '[Book title]', category: 'reading', keywords: ['what are you reading', 'what book'], priority: 7 },
  { text: 'Great insights', category: 'reading', keywords: ['standout', 'insights', 'quotes'], priority: 7 },
  { text: 'Nothing stood out', category: 'reading', keywords: ['standout', 'insights', 'quotes'], priority: 7 },

  // Entertainment responses
  { text: 'Yes, watched something', category: 'entertainment', keywords: ['watch anything', 'watch', 'movie', 'tv show'], priority: 9 },
  { text: 'No, nothing today', category: 'entertainment', keywords: ['watch anything', 'watch'], priority: 9 },
  { text: '[Movie/show name]', category: 'entertainment', keywords: ['what did you watch', 'what movie'], priority: 7 },
  { text: 'Really enjoyed it', category: 'entertainment', keywords: ['what did you think', 'thoughts'], priority: 7 },
  { text: 'It was okay', category: 'entertainment', keywords: ['what did you think', 'thoughts'], priority: 7 },

  // Family responses (specific names)
  { text: 'Quality time together', category: 'karen', keywords: ['anything fun with karen', 'karen'], priority: 9 },
  { text: 'Nothing special', category: 'karen', keywords: ['anything fun with karen', 'karen'], priority: 9 },
  { text: 'Had a sweet moment', category: 'karen', keywords: ['special moments', 'karen'], priority: 8 },

  { text: 'Played together', category: 'sydney', keywords: ['with sydney', 'sydney'], priority: 9 },
  { text: 'Nothing today', category: 'sydney', keywords: ['with sydney', 'sydney'], priority: 9 },
  { text: 'She made me laugh', category: 'sydney', keywords: ['funny', 'sweet moments', 'sydney'], priority: 8 },

  { text: 'Hung out together', category: 'daxton', keywords: ['with daxton', 'daxton'], priority: 9 },
  { text: 'Nothing today', category: 'daxton', keywords: ['with daxton', 'daxton'], priority: 9 },
  { text: 'He made me smile', category: 'daxton', keywords: ['funny', 'sweet moments', 'daxton'], priority: 8 },

  // Gratitude responses
  { text: 'My family', category: 'gratitude', keywords: ['grateful for', 'gratitude'], priority: 8 },
  { text: 'My health', category: 'gratitude', keywords: ['grateful for', 'gratitude'], priority: 8 },
  { text: 'Small moments', category: 'gratitude', keywords: ['grateful for', 'small pleasures'], priority: 8 },
  { text: 'Today went well', category: 'gratitude', keywords: ['grateful for', 'gratitude'], priority: 7 },

  // Goals responses
  { text: 'Made progress', category: 'goals', keywords: ['progress on', 'goals'], priority: 8 },
  { text: 'Stayed consistent', category: 'goals', keywords: ['progress on', 'goals'], priority: 8 },
  { text: 'Need to refocus', category: 'goals', keywords: ['focus on tomorrow', 'goals'], priority: 7 },

  // Generic yes/no (low priority, last resort)
  { text: 'Yes', category: 'generic', keywords: ['did you', 'have you', 'any'], priority: 1 },
  { text: 'No', category: 'generic', keywords: ['did you', 'have you', 'any'], priority: 1 },
  { text: 'Not really', category: 'generic', keywords: ['did you', 'have you', 'any'], priority: 1 },
  { text: 'Sort of', category: 'generic', keywords: ['did you', 'have you', 'any'], priority: 1 },
];

interface PromptHelperProps {
  lastAssistantMessage: string;
  lastUserMessage?: string;
  onSelectPrompt: (text: string) => void;
}

export const PromptHelper = ({ lastAssistantMessage, lastUserMessage, onSelectPrompt }: PromptHelperProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Get current hour to determine time of day
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'any' : 'evening';

    // Convert messages to lowercase for matching
    const messageLower = lastAssistantMessage.toLowerCase();
    const userMessageLower = lastUserMessage?.toLowerCase() || '';

    // Detect context from user's last response
    let contextCategory: string | null = null;
    if (userMessageLower.includes('read') || userMessageLower.includes('book') || userMessageLower.includes('chapter')) {
      contextCategory = 'reading';
    } else if (userMessageLower.includes('exercise') || userMessageLower.includes('workout') || userMessageLower.includes('gym')) {
      contextCategory = 'exercise';
    } else if (userMessageLower.includes('work')) {
      contextCategory = 'work';
    } else if (userMessageLower.includes('karen')) {
      contextCategory = 'karen';
    } else if (userMessageLower.includes('sydney')) {
      contextCategory = 'sydney';
    } else if (userMessageLower.includes('daxton')) {
      contextCategory = 'daxton';
    }

    // Find matching suggestions with scores
    const scoredMatches = PROMPT_LIBRARY.map(prompt => {
      let score = 0;

      // Check if any keyword matches the AI's message
      prompt.keywords.forEach(keyword => {
        if (messageLower.includes(keyword.toLowerCase())) {
          // Longer keywords = more specific = higher score
          score += keyword.length + (prompt.priority || 0) * 10;
        }
      });

      // Context boost - if user just talked about this category, boost related prompts
      if (contextCategory && prompt.category === contextCategory) {
        score += 50; // Strong boost for context continuity
      }

      // Time of day bonus
      if (prompt.timeOfDay === timeOfDay) {
        score += 5;
      }

      return { ...prompt, score };
    }).filter(m => m.score > 0);

    if (scoredMatches.length === 0) {
      setSuggestions([]);
      return;
    }

    // Sort by score (highest first)
    scoredMatches.sort((a, b) => b.score - a.score);

    // Get the top category (highest scoring)
    const topCategory = scoredMatches[0].category;

    // Only show suggestions from the top category (or generic as fallback)
    const categoryMatches = scoredMatches
      .filter(m => m.category === topCategory || (topCategory === 'generic' ? true : m.category === 'generic'))
      .slice(0, 4)
      .map(m => m.text);

    // If we have matches from the main category, exclude generic
    const finalMatches = categoryMatches.filter((text, idx, arr) => {
      if (topCategory !== 'generic') {
        const item = scoredMatches.find(m => m.text === text);
        return item?.category !== 'generic';
      }
      return true;
    }).slice(0, 4);

    setSuggestions(finalMatches);
  }, [lastAssistantMessage, lastUserMessage]);

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
