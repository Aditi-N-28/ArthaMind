import { useState } from "react";
import { Link, useLocation } from "wouter";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: formData.email,
        fullName: formData.fullName,
        gamification: {
          xp: 0,
          coins: 0,
          level: 1,
        },
        createdAt: Date.now(),
        onboardingComplete: false,
      });

      toast.success("Account created successfully! Let's set up your profile.");
      setLocation("/personal");
    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please login instead.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    // 1. Applied shared background and glowing circles
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f0036] via-[#2a004f] to-[#ff6b6b] p-4 overflow-hidden">
      {/* 🔮 Glowing Background Circles */}
      <div className="absolute w-72 h-72 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full blur-3xl opacity-30 left-[-100px] bottom-[-100px]"></div>
      <div className="absolute w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 right-[-60px] top-[-60px]"></div>
      <div className="absolute w-24 h-24 bg-purple-700 rounded-full blur-xl opacity-30 right-10 bottom-10"></div>

      {/* 2. Applied shared card style (glassmorphism) */}
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl z-10">
        <CardHeader className="space-y-1 text-center text-white">
          <div className="flex justify-center mb-4">
            {/* Custom ArthaMind Logo - Financial Intelligence & Growth */}
            <svg 
              className="h-16 w-16 text-primary" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Shield Base - Security & Structure */}
              <path 
                d="M50 10 L80 25 L80 55 Q80 75 50 90 Q20 75 20 55 L20 25 Z" 
                fill="currentColor" 
                opacity="0.15"
              />
              <path 
                d="M50 10 L80 25 L80 55 Q80 75 50 90 Q20 75 20 55 L20 25 Z" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                fill="none"
              />
              
              {/* Grid Lines - Data Structure */}
              <line x1="35" y1="35" x2="35" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
              <line x1="50" y1="35" x2="50" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
              <line x1="65" y1="35" x2="65" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
              
              {/* Ascending Data Line - Growth & Intelligence */}
              <polyline 
                points="28,65 35,55 42,58 50,45 58,48 65,35 72,38" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              
              {/* Data Points - Key Insights */}
              <circle cx="35" cy="55" r="3" fill="currentColor" />
              <circle cx="50" cy="45" r="3" fill="currentColor" />
              <circle cx="65" cy="35" r="3" fill="currentColor" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold">Join ArthaMind</CardTitle>
          {/* 4. Applied shared CardDescription style */}
          <CardDescription className="text-base text-white/70">
            Start your journey to financial intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              {/* 5. Applied white label text */}
              <Label htmlFor="fullName" className="text-white">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                data-testid="input-fullname"
                // 6. Applied shared input style
                className="h-11 bg-white/10 text-white placeholder-white/80 border border-white/30"
              />
            </div>
            <div className="space-y-2">
              {/* 5. Applied white label text */}
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                data-testid="input-email"
                // 6. Applied shared input style
                className="h-11 bg-white/10 text-white placeholder-white/80 border border-white/30"
              />
            </div>
            <div className="space-y-2">
              {/* 5. Applied white label text */}
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                data-testid="input-password"
                // 6. Applied shared input style
                className="h-11 bg-white/10 text-white placeholder-white/80 border border-white/30"
              />
            </div>
            <div className="space-y-2">
              {/* 5. Applied white label text */}
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                data-testid="input-confirm-password"
                // 6. Applied shared input style
                className="h-11 bg-white/10 text-white placeholder-white/80 border border-white/30"
              />
            </div>
            <Button
              type="submit"
              // 7. Applied shared button style
              className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-pink-500 hover:to-orange-400 transition-all"
              disabled={loading}
              data-testid="button-signup"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          {/* 8. Applied shared footer text style */}
          <div className="mt-6 text-center text-sm text-white/70">
            <span>Already have an account? </span>
            {/* 9. Applied shared link style */}
            <Link
              href="/login"
              className="text-pink-400 hover:underline font-medium"
              data-testid="link-login"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
