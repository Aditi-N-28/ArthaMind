import { useState } from "react";
import { useLocation } from "wouter";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, Home, Heart, CreditCard, Wallet } from "lucide-react";

export default function FinancialCredentials() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    monthlySalary: "",
    personal: "",
    medical: "",
    housing: "",
    loanDebt: "",
    goalAmount: "",
    currentSavings: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const salary = parseFloat(formData.monthlySalary) || 0;
    const totalExpenses = 
      (parseFloat(formData.personal) || 0) +
      (parseFloat(formData.medical) || 0) +
      (parseFloat(formData.housing) || 0) +
      (parseFloat(formData.loanDebt) || 0);
    
    const goalAmount = parseFloat(formData.goalAmount) || 0;
    const currentSavings = parseFloat(formData.currentSavings) || 0;

    if (totalExpenses > salary) {
      toast.error("Total expenses cannot exceed monthly salary!");
      return;
    }

    if (currentSavings > goalAmount) {
      toast.warning("Current savings exceeds goal amount!");
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login first");
        setLocation("/login");
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        financialData: {
          monthlySalary: salary,
          expenses: {
            personal: parseFloat(formData.personal) || 0,
            medical: parseFloat(formData.medical) || 0,
            housing: parseFloat(formData.housing) || 0,
            loanDebt: parseFloat(formData.loanDebt) || 0,
          },
          savings: {
            goalAmount: goalAmount,
            currentSavings: currentSavings,
          },
        },
        onboardingComplete: true,
      });

      toast.success("Financial credentials saved! Redirecting to dashboard...");
      setTimeout(() => setLocation("/dashboard"), 1000);
    } catch (error) {
      console.error("Error saving financial data:", error);
      toast.error("Failed to save financial data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const remaining = (parseFloat(formData.goalAmount) || 0) - (parseFloat(formData.currentSavings) || 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Financial Credentials</CardTitle>
          <CardDescription className="text-base">
            Help us understand your financial situation to provide better insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Monthly Income
              </Label>
              <Input
                name="monthlySalary"
                type="number"
                placeholder="Enter monthly salary"
                value={formData.monthlySalary}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                data-testid="input-salary"
                className="h-11"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Monthly Expenses</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    Personal
                  </Label>
                  <Input
                    name="personal"
                    type="number"
                    placeholder="0.00"
                    value={formData.personal}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    data-testid="input-expense-personal"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    Medical
                  </Label>
                  <Input
                    name="medical"
                    type="number"
                    placeholder="0.00"
                    value={formData.medical}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    data-testid="input-expense-medical"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Home className="h-4 w-4" />
                    Housing
                  </Label>
                  <Input
                    name="housing"
                    type="number"
                    placeholder="0.00"
                    value={formData.housing}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    data-testid="input-expense-housing"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Loan/Debt Payments
                  </Label>
                  <Input
                    name="loanDebt"
                    type="number"
                    placeholder="0.00"
                    value={formData.loanDebt}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    data-testid="input-expense-loan"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Savings Goals</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Goal Amount</Label>
                  <Input
                    name="goalAmount"
                    type="number"
                    placeholder="Target savings"
                    value={formData.goalAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    data-testid="input-goal-amount"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Monthly Savings</Label>
                  <Input
                    name="currentSavings"
                    type="number"
                    placeholder="Saved so far"
                    value={formData.currentSavings}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    data-testid="input-current-savings"
                    className="h-11"
                  />
                </div>
              </div>
              {formData.goalAmount && formData.currentSavings && (
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm font-medium">
                    Remaining to save: <span className="text-xl font-mono font-bold text-secondary">₹{remaining.toFixed(2)}</span>
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading}
              data-testid="button-submit-financial"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Setup & Go to Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
