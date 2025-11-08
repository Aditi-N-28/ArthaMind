# ArthaMind

A full-stack financial intelligence web application built with modern technologies.

## Tech Stack

### Frontend
- **Vite + React** (JavaScript, no TypeScript)
- **Tailwind CSS** for styling
- **React Router DOM** for routing
- **Chart.js + react-chartjs-2** for data visualization
- **React Toastify** for notifications
- **Axios** for HTTP requests

### Backend/Services
- **Firebase Authentication** with Google sign-in provider
- **Firebase Firestore** for database
- **Express.js** backend server

## Project Structure

```
client/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components for routing
│   ├── lib/             # Utilities and helpers
│   ├── firebase.js      # Firebase configuration
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
server/
├── routes.ts            # API routes
├── storage.ts           # Data storage interface
└── index.ts             # Server entry point
shared/
└── schema.ts            # Shared data schemas
```

## Environment Variables

The following Firebase secrets are configured via Replit Secrets:
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_API_KEY`

## Development

Run `npm run dev` to start the development server. The workflow "Start application" is configured to run this automatically.

## Firebase Setup

Firebase is configured with:
- Google Authentication provider
- Firestore database for data persistence
- Authorized domains configured for Replit deployment

## Notes

- All components use `.jsx` extension (JavaScript only, no TypeScript)
- Routing is handled by React Router DOM
- Design system follows guidelines in `design_guidelines.md`
- Firebase configuration uses environment variables from Replit Secrets
