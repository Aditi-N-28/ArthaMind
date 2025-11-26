// Firebase configuration and initialization
// Based on Firebase blueprint for JavaScript applications
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Log config for debugging (values are safe to log in development)
console.log("Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? "✓ Set" : "✗ Missing",
  authDomain: firebaseConfig.authDomain || "✗ Missing",
  projectId: firebaseConfig.projectId || "✗ Missing",
  storageBucket: firebaseConfig.storageBucket || "✗ Missing",
  messagingSenderId: firebaseConfig.messagingSenderId || "✗ Missing",
  appId: firebaseConfig.appId ? "✓ Set" : "✗ Missing",
});

// Initialize Firebase only if it hasn't been initialized yet
// This prevents duplicate-app errors during hot module reloading
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
