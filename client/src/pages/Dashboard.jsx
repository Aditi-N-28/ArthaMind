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
  DollarSign,
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

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { personalData, financialData, gamification } = userData;
  const level = Math.floor(gamification.xp / 100) + 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 p-6 overflow-y-auto rounded-xl shadow-lg bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">ArthaMind</h1>
                <p className="text-xs text-muted-foreground">Financial Intelligence</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {personalData?.fullName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold" data-testid="text-username">{personalData?.fullName}</p>
                  <p className="text-sm text-muted-foreground capitalize">{personalData?.gender}</p>
                </div>
              </div>
              <div className="pt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-mono font-semibold">{personalData?.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary</span>
                  <span className="font-mono font-semibold">₹{financialData?.monthlySalary?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Overview */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-chart-1" />
                  <span className="text-muted-foreground">Personal</span>
                </div>
                <span className="font-mono font-semibold">₹{financialData?.expenses?.personal?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-chart-2" />
                  <span className="text-muted-foreground">Medical</span>
                </div>
                <span className="font-mono font-semibold">₹{financialData?.expenses?.medical?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-chart-3" />
                  <span className="text-muted-foreground">Housing</span>
                </div>
                <span className="font-mono font-semibold">₹{financialData?.expenses?.housing?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-chart-4" />
                  <span className="text-muted-foreground">Loan/Debt</span>
                </div>
                <span className="font-mono font-semibold">₹{financialData?.expenses?.loanDebt?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Gamification Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Progress & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Level</span>
                </div>
                <Badge variant="default" className="font-mono" data-testid="badge-level">
                  {level}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">XP</span>
                </div>
                <span className="font-mono font-bold text-primary" data-testid="text-xp">
                  {gamification?.xp || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">Coins</span>
                </div>
                <span className="font-mono font-bold text-secondary" data-testid="text-coins">
                  {gamification?.coins || 0}
                </span>
              </div>
              <div className="pt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${(gamification?.xp % 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
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
              <p className="text-muted-foreground">Your financial overview and insights</p>
            </div>

            {/* Charts Grid */}
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
        className="fixed bottom-6 right-6 h-14 rounded-full shadow-lg hover:shadow-xl transition-all gap-2"
        onClick={() => setChatOpen(true)}
        data-testid="button-open-chat"
      >
        <MessageCircle className="h-5 w-5" />
        Chat with Maarg
        <Badge variant="secondary" className="ml-1 text-xs">AI</Badge>
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
