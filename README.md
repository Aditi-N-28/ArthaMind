We solve financial confusion by giving users an AI mentor (Maarg) that provides personalized money advice, tracks learning, and makes finance fun with XP, quizzes, and charts — all in one app.
ArthaMind is a Fullstack web app designed to help user manage money intelligently with the help of its own AI chatbot,"Maarg".
It also educates user about finance in a fun way.

## Deployment

This project deploys as one Node/Express service that serves the Vite client and
the API from the same process.

Build command:

```bash
npm ci && npm run build
```

Start command:

```bash
npm start
```

The server uses the hosting provider's `PORT` value and listens on `0.0.0.0`.
For Render, Railway, or a similar Node host, create a web service from this
repository with those commands. Do not configure the service as a static site.

Set these environment variables in the hosting provider dashboard:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_GEMINI_API_KEY       # optional; enables live Maarg responses
```

Firebase Authentication providers and Firestore must also be enabled in the
Firebase console. The production build outputs the client to `dist/client` and
the server bundle to `dist/server/index.js`.
