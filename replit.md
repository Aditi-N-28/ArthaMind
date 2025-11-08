# ArthaMind

A gamified financial intelligence platform featuring AI-powered learning, interactive quizzes, and real-time data visualization. Built with Vite + React (JavaScript only) and Firebase.

## Overview

ArthaMind helps users improve their financial literacy through an engaging, gamified experience. The platform combines personalized onboarding, visual analytics, and an AI chatbot (Maarg) that adapts to user learning patterns.

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
- **Express.js** backend server (minimal, mostly Firebase direct)

### Key Libraries
- **@tanstack/react-query** for data fetching
- **date-fns** for date manipulation
- **framer-motion** for animations

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components (Button, Card, Badge, etc.)
│   │   ├── MaargChatbot.jsx # AI chatbot with quiz system
│   │   ├── ExpensesPieChart.jsx
│   │   └── SavingsBarChart.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── PersonalCredentials.jsx  # Age, gender, occupation, city
│   │   ├── FinancialCredentials.jsx # Salary, expenses, savings goal
│   │   └── Dashboard.jsx            # Main analytics dashboard
│   ├── services/
│   │   └── MaargService.js  # AI response logic, quiz banks
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

### 3. Maarg AI Chatbot (Gamified Learning)
- **Interactive Chat Interface**: Modal with message history, input field, send/close controls
- **Topic Detection**: Automatically detects 8 financial topics (SIP, loans, tax, investments, insurance, savings, retirement, budgeting)
- **Adaptive Learning**: Tracks topic engagement in Firestore learning history
- **Quiz System**:
  - Offers quiz after 3 mentions of the same topic
  - Interactive multiple-choice questions with 4 options
  - Instant feedback (correct/incorrect with explanations)
  - Differentiated rewards:
    - ✅ Correct answer: 20 XP + 10 coins
    - ❌ Incorrect answer: 5 XP (participation reward)
  - 8 topic-specific quiz banks with real financial literacy questions
  - Updates learning history to prevent duplicate quizzes
- **Gamification**: XP and coins tracked in real-time with atomic Firestore increments
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
- `SESSION_SECRET` (Express session)

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
- ✅ Chat interactions with topic detection
- ✅ Quiz flow with rewards
- ✅ Authentication persistence (no logout bugs)
- ✅ Real-time data synchronization

## Implementation Notes

### Key Technical Decisions
1. **Schema-First**: Data models in `shared/schema.ts` ensure consistency
2. **Firebase Direct**: Most data operations go straight to Firestore (minimal backend)
3. **Atomic Updates**: `increment()` prevents race conditions in gamification
4. **Real-time Listeners**: Dashboard subscribes to Firestore changes via `onSnapshot()`
5. **Mock AI**: MaargService provides curated responses (ready for Gemini API integration)
6. **HMR Safety**: Duplicate Firebase app detection prevents hot reload errors

### Common Patterns
- **Protected Routes**: `useEffect` with auth state listener
- **Form Validation**: Zod schemas with react-hook-form
- **Error Handling**: Try-catch with toast notifications
- **Loading States**: Skeleton screens during data fetch
- **Persistence**: `setDoc({...}, { merge: true })` for safe updates

## Future Enhancements

### Short-term
- Integrate real Gemini API for AI responses
- Add live financial news API
- Implement leaderboards for competitive learning
- Add more quiz topics and questions

### Long-term
- Portfolio tracking integration
- Goal-based savings recommendations
- Community features (forums, challenges)
- Mobile app (React Native)
- Advanced analytics (spending predictions, insights)

## Notes

- All components use `.jsx` extension (JavaScript only)
- Routing handled by `wouter` (not React Router DOM)
- Design system follows `design_guidelines.md`
- Firebase configuration uses environment variables
- News section uses mock data (ready for API replacement)
- Quiz banks can be expanded via `MaargService.js`

## Recent Changes (Latest Session)

- ✅ Fixed quiz import error in MaargChatbot.jsx
- ✅ Implemented interactive quiz UI with multiple-choice buttons
- ✅ Added instant feedback and differentiated rewards
- ✅ Verified E2E test coverage for complete user journey
- ✅ Confirmed atomic increment operations for XP/coins
- ✅ Validated authentication persistence during quiz flow
