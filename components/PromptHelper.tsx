import { useEffect, useState } from 'react';

interface PromptSuggestion {
  text: string;
  questionPatterns: string[]; // Specific questions this answers
  depth?: number; // 1 = initial, 2 = follow-up, 3 = deep reflection
  category?: string; // For context tracking
}

const PROMPT_LIBRARY: PromptSuggestion[] = [
  // === TIME OF DAY (Initial) ===
  { text: 'Morning', questionPatterns: ['morning, midday, or evening', 'what time', 'time of day'], depth: 1, category: 'time' },
  { text: 'Midday', questionPatterns: ['morning, midday, or evening', 'what time', 'time of day'], depth: 1, category: 'time' },
  { text: 'Evening', questionPatterns: ['morning, midday, or evening', 'what time', 'time of day'], depth: 1, category: 'time' },

  // === FEELINGS (Initial + Follow-up) ===
  { text: 'Energized', questionPatterns: ['how are you feeling', 'how do you feel', 'feeling right now'], depth: 1, category: 'feeling' },
  { text: 'Tired', questionPatterns: ['how are you feeling', 'how do you feel', 'feeling right now'], depth: 1, category: 'feeling' },
  { text: 'Calm', questionPatterns: ['how are you feeling', 'how do you feel', 'feeling right now'], depth: 1, category: 'feeling' },
  { text: 'Stressed', questionPatterns: ['how are you feeling', 'how do you feel', 'feeling right now'], depth: 1, category: 'feeling' },
  { text: 'Happy', questionPatterns: ['how are you feeling', 'how do you feel', 'feeling right now'], depth: 1, category: 'feeling' },
  { text: 'Neutral', questionPatterns: ['how are you feeling', 'how do you feel', 'feeling right now'], depth: 1, category: 'feeling' },

  // === EXERCISE (Progressive depth) ===
  // Depth 1: Initial question
  { text: 'Yes, I worked out', questionPatterns: ['did you exercise', 'exercise today', 'work out today'], depth: 1, category: 'exercise' },
  { text: 'No, rest day', questionPatterns: ['did you exercise', 'exercise today', 'work out today'], depth: 1, category: 'exercise' },
  { text: 'Light activity', questionPatterns: ['did you exercise', 'exercise today', 'work out today'], depth: 1, category: 'exercise' },

  // Depth 2: What kind?
  { text: 'Walking', questionPatterns: ['what kind', 'type of exercise', 'workout'], depth: 2, category: 'exercise' },
  { text: 'Running', questionPatterns: ['what kind', 'type of exercise', 'workout'], depth: 2, category: 'exercise' },
  { text: 'Gym workout', questionPatterns: ['what kind', 'type of exercise', 'workout'], depth: 2, category: 'exercise' },
  { text: 'Yoga', questionPatterns: ['what kind', 'type of exercise', 'workout'], depth: 2, category: 'exercise' },
  { text: 'Cycling', questionPatterns: ['what kind', 'type of exercise', 'workout'], depth: 2, category: 'exercise' },

  // Depth 3: How did it feel?
  { text: 'Great, felt energized', questionPatterns: ['how did it feel', 'how was it', 'how did that go'], depth: 3, category: 'exercise' },
  { text: 'Tired but accomplished', questionPatterns: ['how did it feel', 'how was it', 'how did that go'], depth: 3, category: 'exercise' },
  { text: 'Challenging today', questionPatterns: ['how did it feel', 'how was it', 'how did that go'], depth: 3, category: 'exercise' },

  // === READING (Progressive depth) ===
  // Depth 1: Did you read?
  { text: 'Yes, I read today', questionPatterns: ['did you read', 'read today', 'reading'], depth: 1, category: 'reading' },
  { text: 'No reading today', questionPatterns: ['did you read', 'read today', 'reading'], depth: 1, category: 'reading' },
  { text: 'Just a few pages', questionPatterns: ['did you read', 'read today', 'reading'], depth: 1, category: 'reading' },

  // Depth 2: What are you reading?
  { text: 'Fiction novel', questionPatterns: ['what are you reading', 'what book', 'reading currently'], depth: 2, category: 'reading' },
  { text: 'Non-fiction', questionPatterns: ['what are you reading', 'what book', 'reading currently'], depth: 2, category: 'reading' },
  { text: 'Technical book', questionPatterns: ['what are you reading', 'what book', 'reading currently'], depth: 2, category: 'reading' },

  // Depth 2: How long?
  { text: 'About 30 minutes', questionPatterns: ['how long', 'how much time'], depth: 2, category: 'reading' },
  { text: 'An hour or so', questionPatterns: ['how long', 'how much time'], depth: 2, category: 'reading' },
  { text: 'Quick 10-15 minutes', questionPatterns: ['how long', 'how much time'], depth: 2, category: 'reading' },

  // Depth 3: Insights/quotes?
  { text: 'Great insights', questionPatterns: ['standout', 'insights', 'quotes', 'thoughts on'], depth: 3, category: 'reading' },
  { text: 'One powerful quote', questionPatterns: ['standout', 'insights', 'quotes', 'thoughts on'], depth: 3, category: 'reading' },
  { text: 'Nothing stood out', questionPatterns: ['standout', 'insights', 'quotes', 'thoughts on'], depth: 3, category: 'reading' },
  { text: 'Really engaging', questionPatterns: ['standout', 'insights', 'quotes', 'thoughts on'], depth: 3, category: 'reading' },

  // === ENTERTAINMENT (Progressive depth) ===
  // Depth 1: Watch anything?
  { text: 'Yes, watched something', questionPatterns: ['watch anything', 'watch', 'movie', 'tv'], depth: 1, category: 'entertainment' },
  { text: 'No, nothing today', questionPatterns: ['watch anything', 'watch', 'movie', 'tv'], depth: 1, category: 'entertainment' },

  // Depth 2: What did you watch?
  { text: 'A movie', questionPatterns: ['what did you watch', 'what movie', 'what show'], depth: 2, category: 'entertainment' },
  { text: 'TV series episode', questionPatterns: ['what did you watch', 'what movie', 'what show'], depth: 2, category: 'entertainment' },
  { text: 'Documentary', questionPatterns: ['what did you watch', 'what movie', 'what show'], depth: 2, category: 'entertainment' },

  // Depth 3: What did you think?
  { text: 'Really enjoyed it', questionPatterns: ['what did you think', 'thoughts', 'how was it'], depth: 3, category: 'entertainment' },
  { text: 'It was okay', questionPatterns: ['what did you think', 'thoughts', 'how was it'], depth: 3, category: 'entertainment' },
  { text: 'Not my favorite', questionPatterns: ['what did you think', 'thoughts', 'how was it'], depth: 3, category: 'entertainment' },
  { text: 'Thought-provoking', questionPatterns: ['what did you think', 'thoughts', 'how was it'], depth: 3, category: 'entertainment' },

  // === WORK (Progressive depth) ===
  // Depth 1: How was work?
  { text: 'Great day', questionPatterns: ['how was work', 'work today', 'work go'], depth: 1, category: 'work' },
  { text: 'Productive', questionPatterns: ['how was work', 'work today', 'work go'], depth: 1, category: 'work' },
  { text: 'Challenging', questionPatterns: ['how was work', 'work today', 'work go'], depth: 1, category: 'work' },
  { text: 'Normal day', questionPatterns: ['how was work', 'work today', 'work go'], depth: 1, category: 'work' },
  { text: 'Stressful', questionPatterns: ['how was work', 'work today', 'work go'], depth: 1, category: 'work' },

  // Depth 2: Highlights or lowlights?
  { text: 'Completed a big project', questionPatterns: ['highlights', 'lowlights', 'accomplish', 'frustrate'], depth: 2, category: 'work' },
  { text: 'Good meetings', questionPatterns: ['highlights', 'lowlights', 'accomplish', 'frustrate'], depth: 2, category: 'work' },
  { text: 'Made progress on key tasks', questionPatterns: ['highlights', 'lowlights', 'accomplish', 'frustrate'], depth: 2, category: 'work' },
  { text: 'Some setbacks', questionPatterns: ['highlights', 'lowlights', 'accomplish', 'frustrate'], depth: 2, category: 'work' },

  // Depth 3: What did you learn?
  { text: 'New technical skill', questionPatterns: ['what did you learn', 'learn', 'takeaway'], depth: 3, category: 'work' },
  { text: 'Better approach to problem', questionPatterns: ['what did you learn', 'learn', 'takeaway'], depth: 3, category: 'work' },
  { text: 'Nothing major', questionPatterns: ['what did you learn', 'learn', 'takeaway'], depth: 3, category: 'work' },

  // === KAREN (Wife - Progressive depth) ===
  // Depth 1: Anything fun with Karen?
  { text: 'Quality time together', questionPatterns: ['anything fun with karen', 'karen', 'do with karen'], depth: 1, category: 'karen' },
  { text: 'Nothing special', questionPatterns: ['anything fun with karen', 'karen', 'do with karen'], depth: 1, category: 'karen' },
  { text: 'Had a nice conversation', questionPatterns: ['anything fun with karen', 'karen', 'do with karen'], depth: 1, category: 'karen' },
  { text: 'Watched something together', questionPatterns: ['anything fun with karen', 'karen', 'do with karen'], depth: 1, category: 'karen' },

  // Depth 2: Special moments?
  { text: 'Had a sweet moment', questionPatterns: ['special moments', 'memorable', 'stand out'], depth: 2, category: 'karen' },
  { text: 'Good laugh together', questionPatterns: ['special moments', 'memorable', 'stand out'], depth: 2, category: 'karen' },
  { text: 'Deep conversation', questionPatterns: ['special moments', 'memorable', 'stand out'], depth: 2, category: 'karen' },

  // === SYDNEY (Daughter - Progressive depth) ===
  // Depth 1: What did you do with Sydney?
  { text: 'Played together', questionPatterns: ['with sydney', 'sydney', 'do with sydney'], depth: 1, category: 'sydney' },
  { text: 'Helped with homework', questionPatterns: ['with sydney', 'sydney', 'do with sydney'], depth: 1, category: 'sydney' },
  { text: 'Had quality time', questionPatterns: ['with sydney', 'sydney', 'do with sydney'], depth: 1, category: 'sydney' },
  { text: 'Nothing today', questionPatterns: ['with sydney', 'sydney', 'do with sydney'], depth: 1, category: 'sydney' },

  // Depth 2: Funny or sweet moments?
  { text: 'She made me laugh', questionPatterns: ['funny', 'sweet moments', 'memorable'], depth: 2, category: 'sydney' },
  { text: 'Sweet conversation', questionPatterns: ['funny', 'sweet moments', 'memorable'], depth: 2, category: 'sydney' },
  { text: 'Proud parent moment', questionPatterns: ['funny', 'sweet moments', 'memorable'], depth: 2, category: 'sydney' },

  // === DAXTON (Son - Progressive depth) ===
  // Depth 1: What did you do with Daxton?
  { text: 'Played together', questionPatterns: ['with daxton', 'daxton', 'do with daxton'], depth: 1, category: 'daxton' },
  { text: 'Read books', questionPatterns: ['with daxton', 'daxton', 'do with daxton'], depth: 1, category: 'daxton' },
  { text: 'Had quality time', questionPatterns: ['with daxton', 'daxton', 'do with daxton'], depth: 1, category: 'daxton' },
  { text: 'Nothing today', questionPatterns: ['with daxton', 'daxton', 'do with daxton'], depth: 1, category: 'daxton' },

  // Depth 2: Funny or sweet moments?
  { text: 'He made me smile', questionPatterns: ['funny', 'sweet moments', 'memorable'], depth: 2, category: 'daxton' },
  { text: 'Sweet conversation', questionPatterns: ['funny', 'sweet moments', 'memorable'], depth: 2, category: 'daxton' },
  { text: 'Proud parent moment', questionPatterns: ['funny', 'sweet moments', 'memorable'], depth: 2, category: 'daxton' },

  // === GRATITUDE ===
  { text: 'My family', questionPatterns: ['grateful for', 'gratitude', 'thankful'], depth: 1, category: 'gratitude' },
  { text: 'My health', questionPatterns: ['grateful for', 'gratitude', 'thankful'], depth: 1, category: 'gratitude' },
  { text: 'Small moments', questionPatterns: ['grateful for', 'gratitude', 'small pleasures'], depth: 1, category: 'gratitude' },
  { text: 'Today went well', questionPatterns: ['grateful for', 'gratitude', 'thankful'], depth: 1, category: 'gratitude' },

  // === GOALS ===
  { text: 'Made progress', questionPatterns: ['progress on', 'goals', 'focus on tomorrow'], depth: 1, category: 'goals' },
  { text: 'Stayed consistent', questionPatterns: ['progress on', 'goals', 'focus on tomorrow'], depth: 1, category: 'goals' },
  { text: 'Need to refocus', questionPatterns: ['progress on', 'goals', 'focus on tomorrow'], depth: 1, category: 'goals' },

  // === SIGNIFICANT MOMENTS ===
  { text: 'A conversation that stood out', questionPatterns: ['significant moments', 'most significant', 'stood out'], depth: 1 },
  { text: 'Something unexpected', questionPatterns: ['significant moments', 'most significant', 'stood out', 'surprised'], depth: 1 },
  { text: 'A small victory', questionPatterns: ['significant moments', 'most significant', 'stood out', 'accomplish'], depth: 1 },
  { text: 'Nothing major', questionPatterns: ['significant moments', 'most significant', 'stood out'], depth: 1 },

  // === CHALLENGES ===
  { text: 'A difficult situation', questionPatterns: ['challenges', 'difficult', 'struggle'], depth: 1 },
  { text: 'Work pressure', questionPatterns: ['challenges', 'difficult', 'struggle'], depth: 1 },
  { text: 'Time management', questionPatterns: ['challenges', 'difficult', 'struggle'], depth: 1 },
  { text: 'No major challenges', questionPatterns: ['challenges', 'difficult', 'struggle'], depth: 1 },

  // === GENERIC (Last resort - very low priority) ===
  { text: 'Yes', questionPatterns: ['?'], depth: 1 },
  { text: 'No', questionPatterns: ['?'], depth: 1 },
  { text: 'Not really', questionPatterns: ['?'], depth: 1 },
  { text: 'Sort of', questionPatterns: ['?'], depth: 1 },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PromptHelperProps {
  messages: Message[]; // Full conversation history
  onSelectPrompt: (text: string) => void;
}

export const PromptHelper = ({ messages, onSelectPrompt }: PromptHelperProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Get the last assistant message (the question being asked)
    const lastAssistantMessage = messages
      .slice()
      .reverse()
      .find(m => m.role === 'assistant');

    if (!lastAssistantMessage) {
      setSuggestions([]);
      return;
    }

    const questionLower = lastAssistantMessage.content.toLowerCase();

    // Analyze conversation history to understand depth
    const conversationState = analyzeConversationState(messages);

    console.log('=== PROMPT HELPER DEBUG ===');
    console.log('AI Question:', lastAssistantMessage.content);
    console.log('Topics Discussed:', Array.from(conversationState.topicsDiscussed));
    console.log('Depth by Category:', Object.fromEntries(conversationState.depthByCategory));
    console.log('Last 5 messages:', messages.slice(-5).map(m => ({ role: m.role, content: m.content.substring(0, 50) + '...' })));

    // Find prompts that match the specific question being asked
    const scoredMatches = PROMPT_LIBRARY.map(prompt => {
      let score = 0;

      // Check if any question pattern matches the current AI question
      prompt.questionPatterns.forEach(pattern => {
        if (questionLower.includes(pattern.toLowerCase())) {
          // Exact match to specific question = high score
          score += pattern.length * 100;

          // Bonus for matching the conversation depth
          if (prompt.category && conversationState.topicsDiscussed.has(prompt.category)) {
            const depthLevel = conversationState.depthByCategory.get(prompt.category) || 1;
            // If we're at the right depth level, huge bonus
            if (prompt.depth === depthLevel) {
              score += 1000;
            }
          }
        }
      });

      return { ...prompt, score };
    }).filter(m => m.score > 0);

    if (scoredMatches.length === 0) {
      console.log('No matches found');
      setSuggestions([]);
      return;
    }

    // Sort by score (highest first)
    scoredMatches.sort((a, b) => b.score - a.score);

    console.log('Top 10 Matches:', scoredMatches.slice(0, 10).map(m => ({
      text: m.text,
      score: m.score,
      depth: m.depth,
      category: m.category,
      patterns: m.questionPatterns
    })));

    // Take top 4 suggestions
    const topSuggestions = scoredMatches
      .slice(0, 4)
      .map(m => m.text);

    console.log('Showing suggestions:', topSuggestions);
    console.log('=========================\n');

    setSuggestions(topSuggestions);
  }, [messages]);

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

// Analyze conversation history to understand what topics have been discussed and depth level
function analyzeConversationState(messages: Message[]): {
  topicsDiscussed: Set<string>;
  depthByCategory: Map<string, number>;
} {
  const topicsDiscussed = new Set<string>();
  const depthByCategory = new Map<string, number>();

  // Look at last 10 messages to understand context
  const recentMessages = messages.slice(-10);

  // Track which categories have been mentioned
  const categories = ['exercise', 'reading', 'entertainment', 'work', 'karen', 'sydney', 'daxton', 'gratitude', 'goals'];

  categories.forEach(category => {
    let mentionCount = 0;
    recentMessages.forEach(msg => {
      const contentLower = msg.content.toLowerCase();
      if (contentLower.includes(category)) {
        mentionCount++;
      }
    });

    if (mentionCount > 0) {
      topicsDiscussed.add(category);
      // More mentions = deeper into the topic
      // 1 mention = depth 1 (initial question)
      // 2-3 mentions = depth 2 (follow-up)
      // 4+ mentions = depth 3 (deep reflection)
      const depth = mentionCount === 1 ? 1 : mentionCount <= 3 ? 2 : 3;
      depthByCategory.set(category, depth);
    }
  });

  return { topicsDiscussed, depthByCategory };
}
