# ArthaMind

A gamified financial intelligence platform featuring AI-powered learning with **Google Gemini AI**, interactive quizzes, and real-time data visualization. Built with Vite + React (JavaScript only) and Firebase.

## Overview

ArthaMind helps users improve their financial literacy through an engaging, gamified experience. The platform combines personalized onboarding, visual analytics, and an AI chatbot (Maarg) powered by Google Gemini that adapts to user learning patterns and provides personalized India-specific financial advice.

## Tech Stack

### Frontend
- **Vite + React** (JavaScript only, no TypeScript for new files)
- **Tailwind CSS** + **Shadcn UI** components for styling
- **Wouter** for client-side routing
- **Chart.js + react-chartjs-2** for data visualization
- **React Toastify** for notifications
- **Lucide React** for icons

### Backend/Services
- **Firebase Authentication** with email/password
- **Firebase Firestore** for real-time database
- **Google Gemini AI** (gemini-1.5-pro model) for intelligent chatbot responses
- **Express.js** backend server (minimal, mostly Firebase direct)

### Key Libraries
- **@google/generative-ai** - Google Gemini AI SDK
- **@tanstack/react-query** for data fetching
- **date-fns** for date manipulation
- **framer-motion** for animations

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components (Button, Card, Badge, etc.)
│   │   ├── MaargChatbot.jsx # AI chatbot with Gemini AI integration + quiz system
│   │   ├── ExpensesPieChart.jsx
│   │   └── SavingsBarChart.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── PersonalCredentials.jsx  # Age, gender, occupation, city
│   │   ├── FinancialCredentials.jsx # Salary, expenses, savings goal
│   │   └── Dashboard.jsx            # Main analytics dashboard
│   ├── services/
│   │   └── MaargService.js  # Gemini AI integration + quiz banks
│   ├── lib/
│   │   └── queryClient.js   # TanStack Query setup
│   ├── firebase.js          # Firebase configuration
│   ├── App.tsx              # Routing and protected routes
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles + theme tokens
server/
├── routes.ts                # API routes (minimal, mostly Firebase)
├── storage.ts               # Storage interface
└── index.ts                 # Express server
shared/
└── schema.ts                # Shared data schemas
```

## Features

### 1. Authentication & Onboarding
- **Signup/Login**: Email and password authentication via Firebase
- **Personal Credentials**: Name, DOB (with auto age calculation), gender, occupation, city
- **Financial Credentials**: Monthly salary, detailed expense breakdown (rent, groceries, transportation, utilities, entertainment, healthcare, other), savings goal
- **Protected Routes**: Automatic redirect to login if not authenticated

### 2. Dashboard Analytics
- **User Profile Card**: Avatar, name, email, XP progress bar, coins count, level indicator
- **Monthly Expenses Pie Chart**: Visual breakdown of spending categories using Chart.js
- **Savings Progress Bar Chart**: Monthly savings vs. goal tracking
- **Financial News Section**: Curated news cards (currently mock data, ready for API integration)
- **Real-time Sync**: All data updates via Firestore listeners

### 3. Maarg AI Chatbot (Powered by Google Gemini)
- **Gemini AI Integration**: Real-time AI responses using Google's gemini-1.5-pro model
- **Personalized Advice**: Sends user's financial context to Gemini for India-specific recommendations
- **Interactive Chat Interface**: Modal with message history, input field, send/close controls
- **Topic Detection**: Automatically detects 8 financial topics (SIP, loans, tax, investments, insurance, savings, retirement, budgeting)
- **Adaptive Learning**: Tracks topic engagement in Firestore learning history
- **Graceful Fallback**: Falls back to mock responses if Gemini API fails
- **Quiz System**:
  - Offers quiz after 3 mentions of the same topic
  - Interactive multiple-choice questions with 4 options
  - Instant feedback (correct/incorrect with explanations)
  - Differentiated rewards:
    - ✅ Correct answer: 20 XP + 10 coins
    - ❌ Incorrect answer: 5 XP (participation reward)
  - 8 topic-specific quiz banks with real financial literacy questions
  - Updates learning history to prevent duplicate quizzes
- **Gamification**: XP and coins tracked in real-time with atomic Firestore increments (5 XP per message)
- **Persistence**: Chat history and learning progress saved to Firestore

### 4. Gamification System
- **XP (Experience Points)**: Earned through chat interactions (5 XP per message) and quizzes
- **Coins**: Earned for correct quiz answers (10 coins each)
- **Level System**: Levels calculated based on XP thresholds
- **Real-time Updates**: Dashboard reflects gamification changes immediately via Firestore listeners
- **Atomic Operations**: Uses Firestore `increment()` to prevent lost updates during rapid interactions

## Firestore Data Structure

```
users/{userId}/
├── (root document)
│   ├── name: string
│   ├── email: string
│   └── gamification: { xp: number, coins: number, level: number }
├── personalData/
│   └── data: { name, dob, age, gender, occupation, city }
├── financialData/
│   └── data: { salary, expenses: {...}, savingsGoal }
├── chat/
│   └── history: { messages: [...], lastUpdated }
└── learning/
    └── history: { topics: { [topic]: { count, lastQuizAt, completed } } }
```

## Environment Variables

Required Firebase secrets (configured via Replit Secrets):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_API_KEY` - **Google Gemini AI API key for intelligent chatbot responses**
- `SESSION_SECRET` (Express session)

## Gemini AI Setup

### Prerequisites
1. **Get Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Add it to Replit Secrets as `VITE_GEMINI_API_KEY`

### Configuration
- **Model**: gemini-1.5-pro (latest and most capable model)
- **Generation Config**:
  - Temperature: 0.7 (balanced creativity)
  - TopP: 0.95
  - TopK: 40
  - Max Output Tokens: 1024
- **Initialization**: Automatic on app load, logs "✓ Gemini AI initialized successfully"

### How It Works
1. User asks a financial question in the Maarg chatbot
2. MaargService sends the question along with user's complete financial context to Gemini API
3. Gemini generates personalized, India-specific financial advice
4. Response appears in chat within 2-15 seconds
5. If Gemini API fails, gracefully falls back to curated mock responses
6. User earns 5 XP per message

### User Context Sent to Gemini
```json
{
  "personalData": { "fullName", "age", "gender", "occupation", "city" },
  "financialData": { 
    "monthlySalary", 
    "expenses": { "personal", "medical", "housing", "loanDebt" },
    "savings": { "goalAmount", "currentSavings" }
  },
  "gamification": { "xp", "coins", "level" }
}
```

## Firebase Setup Requirements

### Authentication
1. Enable **Email/Password** authentication in Firebase Console
2. Configure authorized domains for Replit deployment

### Firestore
1. Enable Firestore database
2. Set security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Development

### Running the App
```bash
npm run dev  # Starts Express + Vite dev servers
```

The workflow "Start application" is configured to run this automatically.

### Development Guidelines
- **JavaScript Only**: All new files must be `.jsx` (no TypeScript)
- **Routing**: Uses `wouter` for client-side routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS utility classes, Shadcn UI components
- **Forms**: React Hook Form with Zod validation
- **Design**: Follow `design_guidelines.md` for emerald-themed financial UI

## Design System

### Colors
- **Primary**: Emerald green (financial growth theme)
- **Accent**: Complementary accent colors
- **Background**: Light/dark mode support with CSS variables
- **Typography**: Inter for UI, JetBrains Mono for numbers/metrics

### Components
- All interactive elements have `data-testid` attributes for E2E testing
- Consistent spacing, borders, and elevation using Shadcn patterns
- Responsive layouts with mobile-first approach

## Testing

The application includes comprehensive E2E test coverage:
- ✅ Complete user journey: Signup → Personal → Financial → Dashboard
- ✅ Chat interactions with Gemini AI responses
- ✅ Quiz flow with rewards
- ✅ Authentication persistence (no logout bugs)
- ✅ Real-time data synchronization
- ✅ Graceful Gemini AI fallback to mock responses

## Implementation Notes

### Key Technical Decisions
1. **Schema-First**: Data models in `shared/schema.ts` ensure consistency
2. **Firebase Direct**: Most data operations go straight to Firestore (minimal backend)
3. **Gemini AI Integration**: Real-time AI responses with automatic fallback to mock data
4. **Atomic Updates**: `increment()` prevents race conditions in gamification
5. **Real-time Listeners**: Dashboard subscribes to Firestore changes via `onSnapshot()`
6. **HMR Safety**: Duplicate Firebase app detection prevents hot reload errors

### Common Patterns
- **Protected Routes**: `useEffect` with auth state listener
- **Form Validation**: Zod schemas with react-hook-form
- **Error Handling**: Try-catch with toast notifications + graceful Gemini fallback
- **Loading States**: Skeleton screens during data fetch
- **Persistence**: `setDoc({...}, { merge: true })` for safe updates
- **AI Prompting**: Structured prompts with user context for personalized Gemini responses

## Future Enhancements

### Short-term
- Expand quiz question banks for all topics
- Add live financial news API integration
- Implement leaderboards for competitive learning
- Voice input for chatbot questions

### Long-term
- Portfolio tracking integration
- Goal-based savings recommendations with AI insights
- Community features (forums, challenges)
- Mobile app (React Native)
- Advanced analytics (spending predictions, AI-driven insights)
- Multi-language support for Gemini responses

## Notes

- All components use `.jsx` extension (JavaScript only)
- Routing handled by `wouter` (not React Router DOM)
- Design system follows `design_guidelines.md`
- Firebase configuration uses environment variables
- Gemini API key required for AI responses (graceful fallback to mock responses)
- News section uses mock data (ready for API replacement)
- Quiz banks can be expanded via `MaargService.js`

## Recent Changes (Latest Session)

- ✅ Fixed Dashboard.jsx JSX syntax errors
- ✅ Installed @google/generative-ai package
- ✅ Integrated Google Gemini AI (gemini-1.5-pro model)
- ✅ Added VITE_GEMINI_API_KEY to environment secrets
- ✅ Configured generation parameters for optimal financial advice
- ✅ Implemented graceful fallback from Gemini to mock responses
- ✅ Verified E2E test coverage with AI chatbot integration
- ✅ Console logs confirm: "✓ Gemini AI initialized successfully with gemini-1.5-pro model"
