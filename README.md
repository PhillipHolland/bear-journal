# 🐻 Bear Journal

A beautiful, Bear-inspired journaling web app powered by Grok AI. Ask targeted questions to help you create comprehensive daily journal entries.

## Features

- 🎯 **Direct, focused questioning** - One question at a time
- 💬 **Smart conversation** - Powered by Grok AI (grok-2-1212)
- 🎨 **Bear-inspired design** - Clean, minimal, distraction-free interface
- 📝 **Comprehensive entries** - Covers exercise, reading, work, family, and more
- 🌓 **Dark mode** - Automatic theme switching

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Grok API key from [x.ai](https://x.ai)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PhillipHolland/bear-journal.git
cd bear-journal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Grok API key to `.env.local`:
```
GROK_API_KEY=your_grok_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PhillipHolland/bear-journal)

### Manual Deployment

1. Install Vercel CLI (optional):
```bash
npm install -g vercel
```

2. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. Go to [vercel.com](https://vercel.com) and sign in with GitHub

4. Click "Add New Project"

5. Import your `bear-journal` repository

6. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

7. Add environment variables:
   - Click "Environment Variables"
   - Add `GROK_API_KEY` with your Grok API key
   - Apply to all environments (Production, Preview, Development)

8. Click "Deploy"

### Auto-Deploy from GitHub

Once connected, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Build and deploy in ~30 seconds

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROK_API_KEY` | Your Grok API key from x.ai | Yes |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Grok API (grok-2-1212)
- **Deployment**: Vercel

## Project Structure

```
bear-journal/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # Grok API integration
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main chat interface
├── grok-bear-journal-prompt.md # System prompt
├── .env.local                 # Environment variables (not committed)
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── package.json               # Dependencies
```

## Customization

### Modify the Journaling Prompt

Edit `grok-bear-journal-prompt.md` to customize:
- Questions asked
- Personal focus areas (family members, activities, etc.)
- Tone and style
- Journal entry format

The prompt is embedded in `app/api/chat/route.ts`.

### Change the Model

Edit `app/api/chat/route.ts` and update the `model` parameter:
```typescript
model: 'grok-2-1212', // or 'grok-beta' for latest
```

### Styling

The app uses Bear's color scheme:
- **Bear Red**: `#e03e2f`
- **Light background**: `#ffffff`
- **Dark background**: `#1a1a1a`

Modify colors in `app/globals.css` and `app/page.tsx`.

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## License

MIT

## Credits

- Design inspired by [Bear](https://bear.app)
- Powered by [Grok AI](https://x.ai)
