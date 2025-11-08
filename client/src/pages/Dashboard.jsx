import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ExpensesPieChart from "../components/ExpensesPieChart";
import SavingsBarChart from "../components/SavingsBarChart";
import NewsSection from "../components/NewsSection";
import MaargChatbot from "../components/MaargChatbot";
import { 
  LogOut, 
  TrendingUp, 
  Coins, 
  Zap, 
  Wallet,
  Home,
  Heart,
  CreditCard,
  MessageCircle
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLocation("/login");
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (!data.onboardingComplete) {
          setLocation("/personal");
        } else {
          setUserData(data);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      setLocation("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Update loading state to match the new dark theme
  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f0036] via-[#2a004f] to-[#ff6b6b] text-white">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse mx-auto mb-4"></div>
          <p className="text-white/70">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { personalData, financialData, gamification } = userData;
  const level = Math.floor(gamification.xp / 100) + 1;

  return (
    // 1. Apply the dark gradient background to the entire page
    <div className="min-h-screen bg-gradient-to-br from-[#1f0036] via-[#2a004f] to-[#ff6b6b] text-white">
      <div className="flex flex-col lg:flex-row h-screen">

        {/* Left Sidebar */}
        {/* 2. Apply glassmorphism style to the sidebar */}
        <aside className="w-full lg:w-80 p-6 overflow-y-auto bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-none lg:rounded-r-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Logo matching the login/onboarding pages */}
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">ArthaMind</h1>
                <p className="text-xs text-white/70">Financial Intelligence</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              data-testid="button-logout"
              className="hover:bg-white/20 text-white" // Ensure button looks good on dark background
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          {/* 3. Apply glassmorphism style to the internal cards */}
          <Card className="mb-6 bg-white/10 border-white/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {personalData?.fullName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold" data-testid="text-username">{personalData?.fullName}</p>
                  <p className="text-sm text-white/70 capitalize">{personalData?.gender}</p>
                </div>
              </div>
              <div className="pt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Age</span>
                  <span className="font-mono font-semibold">{personalData?.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Salary</span>
                  <span className="font-mono font-semibold text-pink-400">₹{financialData?.monthlySalary?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Overview */}
          {/* 3. Apply glassmorphism style to the internal cards */}
          <Card className="mb-6 bg-white/10 border-white/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-pink-400" /> {/* Use pink accent for consistency */}
                  <span className="text-white/70">Personal</span>
                </div>
                <span className="font-mono font-semibold text-pink-400">₹{financialData?.expenses?.personal?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <span className="text-white/70">Medical</span>
                </div>
                <span className="font-mono font-semibold text-pink-400">₹{financialData?.expenses?.medical?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-pink-400" />
                  <span className="text-white/70">Housing</span>
                </div>
                <span className="font-mono font-semibold text-pink-400">₹{financialData?.expenses?.housing?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-pink-400" />
                  <span className="text-white/70">Loan/Debt</span>
                </div>
                <span className="font-mono font-semibold text-pink-400">₹{financialData?.expenses?.loanDebt?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Gamification Section */}
          {/* 3. Apply glassmorphism style to the internal cards */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {/* 4. Use pink/purple accents for icons */}
                <Zap className="h-4 w-4 text-purple-400" /> 
                Progress & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium">Level</span>
                </div>
                {/* 5. Apply button gradient to badge variant for consistency */}
                <Badge 
                  className="font-mono bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none text-white"
                  data-testid="badge-level"
                >
                  {level}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium">XP</span>
                </div>
                <span className="font-mono font-bold text-pink-400" data-testid="text-xp">
                  {gamification?.xp || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-pink-400" />
                  <span className="text-sm font-medium">Coins</span>
                </div>
                <span className="font-mono font-bold text-pink-400" data-testid="text-coins">
                  {gamification?.coins || 0}
                </span>
              </div>
              <div className="pt-2">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    // 6. Apply button gradient to progress bar
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${(gamification?.xp % 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-white/70 mt-2 text-center">
                  {100 - (gamification?.xp % 100)} XP to Level {level + 1}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-white/70">Your financial overview and insights</p>
            </div>

            {/* Charts Grid - Assuming ExpensesPieChart and SavingsBarChart also use the dark theme for internal components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpensesPieChart expenses={financialData?.expenses} />
              <SavingsBarChart 
                goalAmount={financialData?.savings?.goalAmount} 
                currentSavings={financialData?.savings?.currentSavings} 
              />
            </div>

            {/* Financial News Section */}
            <NewsSection />
          </div>
        </main>
      </div>

      {/* Floating Chat Button */}
      <Button
        size="lg"
        // 7. Apply button gradient to the floating chat button
        className="fixed bottom-6 right-6 h-14 rounded-full shadow-lg hover:shadow-xl transition-all gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-pink-500 hover:to-orange-400"
        onClick={() => setChatOpen(true)}
        data-testid="button-open-chat"
      >
        <MessageCircle className="h-5 w-5" />
        Chat with Maarg
        {/* 8. Ensure Badge contrast is good */}
        <Badge variant="secondary" className="ml-1 text-xs bg-white/20 text-white">AI</Badge>
      </Button>

      {/* Maarg Chatbot Modal */}
      {chatOpen && (
        <MaargChatbot 
          onClose={() => setChatOpen(false)} 
          userData={userData}
        />
      )}
    </div>
  );
}