import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PersonalCredentials() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
  });
  const [age, setAge] = useState(0);

  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().fullName || "");
        }
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [formData.dateOfBirth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gender) {
      toast.error("Please select your gender");
      return;
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
        personalData: {
          fullName: userName,
          dateOfBirth: formData.dateOfBirth,
          age: age,
          gender: formData.gender,
        },
      });

      toast.success("Personal credentials saved!");
      setLocation("/financial");
    } catch (error) {
      console.error("Error saving personal data:", error);
      toast.error("Failed to save personal data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">
            Hi {userName}, welcome to ArthaMind
          </CardTitle>
          <CardDescription className="text-base">
            Kindly fill your personal credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                data-testid="input-dob"
                className="h-11"
              />
            </div>

            {age > 0 && (
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">
                  Your Age: <span className="text-2xl font-mono font-bold text-primary">{age}</span> years
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger className="h-11" data-testid="select-gender">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading}
              data-testid="button-submit-personal"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue to Financial Credentials"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
