import { useState } from "react";
import { Link, useLocation } from "wouter";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
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

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Welcome back to ArthaMind!");
      setLocation("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.message || "Failed to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f0036] via-[#2a004f] to-[#ff6b6b] p-4 overflow-hidden">
      {/* 🔮 Glowing Background Circles */}
      <div className="absolute w-72 h-72 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full blur-3xl opacity-30 left-[-100px] bottom-[-100px]"></div>
      <div className="absolute w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 right-[-60px] top-[-60px]"></div>
      <div className="absolute w-24 h-24 bg-purple-700 rounded-full blur-xl opacity-30 right-10 bottom-10"></div>

      {/* 🧾 Login Card */}
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl z-10">
        <CardHeader className="space-y-1 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base text-white/70">
            Your path to smarter money decisions, guided by Maarg
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
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
                className="h-11 bg-white/10 text-white placeholder-white/80 border border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                data-testid="input-password"
                className="h-11 bg-white/10 text-white placeholder-white placeholder-opacity-100 border border-white/30"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-pink-500 hover:to-orange-400 transition-all"
              disabled={loading}
              data-testid="button-login"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-white/70">
            <span>Don't have an account? </span>
            <Link
              href="/signup"
              className="text-pink-400 hover:underline font-medium"
              data-testid="link-signup"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
