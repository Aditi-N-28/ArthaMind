import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { auth, isFirebaseConfigured } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ component: Component }) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-semibold">Firebase configuration required</h1>
          <p className="text-muted-foreground">
            Add the VITE_FIREBASE_* environment variables in your hosting provider, then rebuild the app.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setLocation("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return authenticated ? <Component /> : null;
}
