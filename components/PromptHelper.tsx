import { useEffect, useState } from 'react';

interface PromptSuggestion {
  text: string;
  questionPatterns: string[]; // Specific questions this answers
  followsUserResponse?: string[]; // User responses that lead to this prompt
  category?: string;
}

const PROMPT_LIBRARY: PromptSuggestion[] = [
  // === TIME OF DAY (Initial) ===
  { text: 'Morning', questionPatterns: ['morning, midday, or evening', 'what time'], category: 'time' },
  { text: 'Midday', questionPatterns: ['morning, midday, or evening', 'what time'], category: 'time' },
  { text: 'Evening', questionPatterns: ['morning, midday, or evening', 'what time'], category: 'time' },

  // === FEELINGS ===
  { text: 'Energized', questionPatterns: ['how are you feeling', 'how do you feel'], category: 'feeling' },
  { text: 'Tired', questionPatterns: ['how are you feeling', 'how do you feel'], category: 'feeling' },
  { text: 'Calm', questionPatterns: ['how are you feeling', 'how do you feel'], category: 'feeling' },
  { text: 'Stressed', questionPatterns: ['how are you feeling', 'how do you feel'], category: 'feeling' },
  { text: 'Happy', questionPatterns: ['how are you feeling', 'how do you feel'], category: 'feeling' },
  { text: 'Neutral', questionPatterns: ['how are you feeling', 'how do you feel'], category: 'feeling' },

  // === EXERCISE FLOW ===
  // Step 1: Did you exercise?
  { text: 'Yes, I worked out', questionPatterns: ['did you exercise', 'exercise today', 'work out'], category: 'exercise' },
  { text: 'No, rest day', questionPatterns: ['did you exercise', 'exercise today', 'work out'], category: 'exercise' },
  { text: 'Light activity', questionPatterns: ['did you exercise', 'exercise today', 'work out'], category: 'exercise' },

  // Step 2: What kind? (only if user said yes/they exercised)
  { text: 'Walking', questionPatterns: ['what kind of exercise', 'what type of workout', 'what did you do for exercise'], followsUserResponse: ['yes', 'worked out', 'exercised', 'light activity'], category: 'exercise' },
  { text: 'Running', questionPatterns: ['what kind of exercise', 'what type of workout', 'what did you do for exercise'], followsUserResponse: ['yes', 'worked out', 'exercised', 'light activity'], category: 'exercise' },
  { text: 'Gym workout', questionPatterns: ['what kind of exercise', 'what type of workout', 'what did you do for exercise'], followsUserResponse: ['yes', 'worked out', 'exercised', 'light activity'], category: 'exercise' },
  { text: 'Yoga', questionPatterns: ['what kind of exercise', 'what type of workout', 'what did you do for exercise'], followsUserResponse: ['yes', 'worked out', 'exercised', 'light activity'], category: 'exercise' },
  { text: 'Cycling', questionPatterns: ['what kind of exercise', 'what type of workout', 'what did you do for exercise'], followsUserResponse: ['yes', 'worked out', 'exercised', 'light activity'], category: 'exercise' },

  // Step 3: How did it feel? (only if they mentioned a specific exercise type)
  { text: 'Great, felt energized', questionPatterns: ['how did it feel', 'how did the exercise feel', 'how was your workout'], followsUserResponse: ['walking', 'running', 'gym', 'yoga', 'cycling', 'lifted'], category: 'exercise' },
  { text: 'Tired but accomplished', questionPatterns: ['how did it feel', 'how did the exercise feel', 'how was your workout'], followsUserResponse: ['walking', 'running', 'gym', 'yoga', 'cycling', 'lifted'], category: 'exercise' },
  { text: 'Challenging today', questionPatterns: ['how did it feel', 'how did the exercise feel', 'how was your workout'], followsUserResponse: ['walking', 'running', 'gym', 'yoga', 'cycling', 'lifted'], category: 'exercise' },

  // === READING FLOW ===
  // Step 1: Did you read?
  { text: 'Yes, I read today', questionPatterns: ['did you read'], category: 'reading' },
  { text: 'No reading today', questionPatterns: ['did you read'], category: 'reading' },
  { text: 'Just a few pages', questionPatterns: ['did you read'], category: 'reading' },

  // Step 2: What are you reading? (if they said yes)
  { text: 'Fiction novel', questionPatterns: ['what are you reading', 'what book'], followsUserResponse: ['yes', 'read', 'pages', 'chapter'], category: 'reading' },
  { text: 'Non-fiction', questionPatterns: ['what are you reading', 'what book'], followsUserResponse: ['yes', 'read', 'pages', 'chapter'], category: 'reading' },
  { text: 'Technical book', questionPatterns: ['what are you reading', 'what book'], followsUserResponse: ['yes', 'read', 'pages', 'chapter'], category: 'reading' },

  // Step 2 Alternative: How long?
  { text: 'About 30 minutes', questionPatterns: ['how long did you read', 'how much time'], followsUserResponse: ['yes', 'read', 'pages', 'chapter'], category: 'reading' },
  { text: 'An hour or so', questionPatterns: ['how long did you read', 'how much time'], followsUserResponse: ['yes', 'read', 'pages', 'chapter'], category: 'reading' },
  { text: 'Quick 10-15 minutes', questionPatterns: ['how long did you read', 'how much time'], followsUserResponse: ['yes', 'read', 'pages', 'chapter'], category: 'reading' },

  // Step 3: Insights? (if they mentioned a book or reading time)
  { text: 'Great insights', questionPatterns: ['any standout', 'any insights', 'any quotes', 'what did you think'], followsUserResponse: ['fiction', 'non-fiction', 'technical', 'minutes', 'hour', 'book'], category: 'reading' },
  { text: 'One powerful quote', questionPatterns: ['any standout', 'any insights', 'any quotes', 'what did you think'], followsUserResponse: ['fiction', 'non-fiction', 'technical', 'minutes', 'hour', 'book'], category: 'reading' },
  { text: 'Nothing stood out', questionPatterns: ['any standout', 'any insights', 'any quotes', 'what did you think'], followsUserResponse: ['fiction', 'non-fiction', 'technical', 'minutes', 'hour', 'book'], category: 'reading' },
  { text: 'Really engaging', questionPatterns: ['any standout', 'any insights', 'any quotes', 'what did you think'], followsUserResponse: ['fiction', 'non-fiction', 'technical', 'minutes', 'hour', 'book'], category: 'reading' },

  // === ENTERTAINMENT FLOW ===
  // Step 1: Watch anything?
  { text: 'Yes, watched something', questionPatterns: ['watch anything', 'did you watch'], category: 'entertainment' },
  { text: 'No, nothing today', questionPatterns: ['watch anything', 'did you watch'], category: 'entertainment' },

  // Step 2: What did you watch? (if yes)
  { text: 'A movie', questionPatterns: ['what did you watch'], followsUserResponse: ['yes', 'watched', 'something'], category: 'entertainment' },
  { text: 'TV series episode', questionPatterns: ['what did you watch'], followsUserResponse: ['yes', 'watched', 'something'], category: 'entertainment' },
  { text: 'Documentary', questionPatterns: ['what did you watch'], followsUserResponse: ['yes', 'watched', 'something'], category: 'entertainment' },

  // Step 3: What did you think? (if they mentioned what they watched)
  { text: 'Really enjoyed it', questionPatterns: ['what did you think', 'thoughts on', 'how was it'], followsUserResponse: ['movie', 'series', 'documentary', 'show', 'film'], category: 'entertainment' },
  { text: 'It was okay', questionPatterns: ['what did you think', 'thoughts on', 'how was it'], followsUserResponse: ['movie', 'series', 'documentary', 'show', 'film'], category: 'entertainment' },
  { text: 'Not my favorite', questionPatterns: ['what did you think', 'thoughts on', 'how was it'], followsUserResponse: ['movie', 'series', 'documentary', 'show', 'film'], category: 'entertainment' },
  { text: 'Thought-provoking', questionPatterns: ['what did you think', 'thoughts on', 'how was it'], followsUserResponse: ['movie', 'series', 'documentary', 'show', 'film'], category: 'entertainment' },

  // === WORK FLOW ===
  // Step 1: How was work?
  { text: 'Great day', questionPatterns: ['how was work'], category: 'work' },
  { text: 'Productive', questionPatterns: ['how was work'], category: 'work' },
  { text: 'Challenging', questionPatterns: ['how was work'], category: 'work' },
  { text: 'Normal day', questionPatterns: ['how was work'], category: 'work' },
  { text: 'Stressful', questionPatterns: ['how was work'], category: 'work' },

  // Step 2: Highlights or challenges? (after they described work)
  { text: 'Completed a big project', questionPatterns: ['any highlights', 'accomplish at work', 'what frustrated'], followsUserResponse: ['great', 'productive', 'challenging', 'normal', 'stressful'], category: 'work' },
  { text: 'Good meetings', questionPatterns: ['any highlights', 'accomplish at work', 'what frustrated'], followsUserResponse: ['great', 'productive', 'challenging', 'normal', 'stressful'], category: 'work' },
  { text: 'Made progress on key tasks', questionPatterns: ['any highlights', 'accomplish at work', 'what frustrated'], followsUserResponse: ['great', 'productive', 'challenging', 'normal', 'stressful'], category: 'work' },
  { text: 'Some setbacks', questionPatterns: ['any highlights', 'accomplish at work', 'what frustrated'], followsUserResponse: ['great', 'productive', 'challenging', 'normal', 'stressful'], category: 'work' },

  // Step 3: What did you learn? (after highlights/challenges)
  { text: 'New technical skill', questionPatterns: ['what did you learn', 'any takeaways'], followsUserResponse: ['completed', 'project', 'meetings', 'progress', 'setbacks', 'tasks'], category: 'work' },
  { text: 'Better approach to problem', questionPatterns: ['what did you learn', 'any takeaways'], followsUserResponse: ['completed', 'project', 'meetings', 'progress', 'setbacks', 'tasks'], category: 'work' },
  { text: 'Nothing major', questionPatterns: ['what did you learn', 'any takeaways'], followsUserResponse: ['completed', 'project', 'meetings', 'progress', 'setbacks', 'tasks'], category: 'work' },

  // === KAREN (Wife) ===
  // Step 1: Anything with Karen?
  { text: 'Quality time together', questionPatterns: ['anything fun with karen', 'do with karen'], category: 'karen' },
  { text: 'Nothing special', questionPatterns: ['anything fun with karen', 'do with karen'], category: 'karen' },
  { text: 'Had a nice conversation', questionPatterns: ['anything fun with karen', 'do with karen'], category: 'karen' },
  { text: 'Watched something together', questionPatterns: ['anything fun with karen', 'do with karen'], category: 'karen' },

  // Step 2: Special moments? (if they did something)
  { text: 'Had a sweet moment', questionPatterns: ['any special moments', 'anything memorable'], followsUserResponse: ['quality time', 'conversation', 'watched', 'together'], category: 'karen' },
  { text: 'Good laugh together', questionPatterns: ['any special moments', 'anything memorable'], followsUserResponse: ['quality time', 'conversation', 'watched', 'together'], category: 'karen' },
  { text: 'Deep conversation', questionPatterns: ['any special moments', 'anything memorable'], followsUserResponse: ['quality time', 'conversation', 'watched', 'together'], category: 'karen' },

  // === SYDNEY (Daughter) ===
  // Step 1: What with Sydney?
  { text: 'Played together', questionPatterns: ['do with sydney', 'anything with sydney'], category: 'sydney' },
  { text: 'Helped with homework', questionPatterns: ['do with sydney', 'anything with sydney'], category: 'sydney' },
  { text: 'Had quality time', questionPatterns: ['do with sydney', 'anything with sydney'], category: 'sydney' },
  { text: 'Nothing today', questionPatterns: ['do with sydney', 'anything with sydney'], category: 'sydney' },

  // Step 2: Moments? (if they did something)
  { text: 'She made me laugh', questionPatterns: ['any funny', 'any sweet moments', 'anything memorable'], followsUserResponse: ['played', 'homework', 'quality time', 'together'], category: 'sydney' },
  { text: 'Sweet conversation', questionPatterns: ['any funny', 'any sweet moments', 'anything memorable'], followsUserResponse: ['played', 'homework', 'quality time', 'together'], category: 'sydney' },
  { text: 'Proud parent moment', questionPatterns: ['any funny', 'any sweet moments', 'anything memorable'], followsUserResponse: ['played', 'homework', 'quality time', 'together'], category: 'sydney' },

  // === DAXTON (Son) ===
  // Step 1: What with Daxton?
  { text: 'Played together', questionPatterns: ['do with daxton', 'anything with daxton'], category: 'daxton' },
  { text: 'Read books', questionPatterns: ['do with daxton', 'anything with daxton'], category: 'daxton' },
  { text: 'Had quality time', questionPatterns: ['do with daxton', 'anything with daxton'], category: 'daxton' },
  { text: 'Nothing today', questionPatterns: ['do with daxton', 'anything with daxton'], category: 'daxton' },

  // Step 2: Moments? (if they did something)
  { text: 'He made me smile', questionPatterns: ['any funny', 'any sweet moments', 'anything memorable'], followsUserResponse: ['played', 'books', 'quality time', 'together'], category: 'daxton' },
  { text: 'Sweet conversation', questionPatterns: ['any funny', 'any sweet moments', 'anything memorable'], followsUserResponse: ['played', 'books', 'quality time', 'together'], category: 'daxton' },
  { text: 'Proud parent moment', questionPatterns: ['any funny', 'any sweet moments', 'anything memorable'], followsUserResponse: ['played', 'books', 'quality time', 'together'], category: 'daxton' },

  // === GRATITUDE ===
  { text: 'My family', questionPatterns: ['grateful for', 'what are you thankful'], category: 'gratitude' },
  { text: 'My health', questionPatterns: ['grateful for', 'what are you thankful'], category: 'gratitude' },
  { text: 'Small moments', questionPatterns: ['grateful for', 'small pleasures'], category: 'gratitude' },
  { text: 'Today went well', questionPatterns: ['grateful for', 'what are you thankful'], category: 'gratitude' },

  // === GOALS ===
  { text: 'Made progress', questionPatterns: ['progress on', 'any goals', 'focus on tomorrow'], category: 'goals' },
  { text: 'Stayed consistent', questionPatterns: ['progress on', 'any goals', 'focus on tomorrow'], category: 'goals' },
  { text: 'Need to refocus', questionPatterns: ['progress on', 'any goals', 'focus on tomorrow'], category: 'goals' },

  // === SIGNIFICANT MOMENTS ===
  { text: 'A conversation that stood out', questionPatterns: ['most significant', 'what stood out', 'stood out most', 'what was most'], category: 'moments' },
  { text: 'Something unexpected', questionPatterns: ['most significant', 'what stood out', 'stood out most', 'anything surprise', 'what was most'], category: 'moments' },
  { text: 'A small victory', questionPatterns: ['most significant', 'what stood out', 'stood out most', 'what was most'], category: 'moments' },
  { text: 'Quality time with family', questionPatterns: ['most significant', 'what stood out', 'stood out most', 'what was most'], category: 'moments' },
  { text: 'A moment of peace', questionPatterns: ['most significant', 'what stood out', 'stood out most', 'what was most'], category: 'moments' },
  { text: 'Nothing major', questionPatterns: ['most significant', 'what stood out', 'stood out most', 'what was most'], category: 'moments' },

  // === CHALLENGES ===
  { text: 'A difficult situation', questionPatterns: ['any challenges', 'anything difficult'], category: 'challenges' },
  { text: 'Work pressure', questionPatterns: ['any challenges', 'anything difficult'], category: 'challenges' },
  { text: 'Time management', questionPatterns: ['any challenges', 'anything difficult'], category: 'challenges' },
  { text: 'No major challenges', questionPatterns: ['any challenges', 'anything difficult'], category: 'challenges' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PromptHelperProps {
  messages: Message[];
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

    // Get the user's last response (to check context)
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(m => m.role === 'user');

    const questionLower = lastAssistantMessage.content.toLowerCase();
    const userResponseLower = lastUserMessage?.content.toLowerCase() || '';

    console.log('=== PROMPT HELPER DEBUG ===');
    console.log('AI Question:', lastAssistantMessage.content);
    console.log('User Last Response:', lastUserMessage?.content || 'none');

    // Score each prompt suggestion
    const scoredMatches = PROMPT_LIBRARY.map(prompt => {
      let score = 0;

      // Check if question pattern matches the AI's current question
      let patternMatched = false;
      prompt.questionPatterns.forEach(pattern => {
        if (questionLower.includes(pattern.toLowerCase())) {
          // Base score for pattern match
          score += pattern.length * 100;
          patternMatched = true;
        }
      });

      // If this prompt requires a specific user response context, check for it
      if (patternMatched && prompt.followsUserResponse && userResponseLower) {
        let contextMatched = false;
        prompt.followsUserResponse.forEach(responseKeyword => {
          if (userResponseLower.includes(responseKeyword.toLowerCase())) {
            // HUGE bonus if user's response matches the expected context
            score += 2000;
            contextMatched = true;
          }
        });

        // If pattern matched but user response doesn't match required context, heavily penalize
        if (!contextMatched) {
          score = Math.floor(score * 0.1); // 90% penalty
        }
      }

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
      category: m.category,
      patterns: m.questionPatterns,
      followsResponse: m.followsUserResponse
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
