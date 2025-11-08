import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
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
    // 1. Apply shared dark gradient background and overflow hidden
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f0036] via-[#2a004f] to-[#ff6b6b] p-4 overflow-hidden">
      {/* 2. Apply shared glowing background circles */}
      <div className="absolute w-72 h-72 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full blur-3xl opacity-30 left-[-100px] bottom-[-100px]"></div>
      <div className="absolute w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 right-[-60px] top-[-60px]"></div>
      <div className="absolute w-24 h-24 bg-purple-700 rounded-full blur-xl opacity-30 right-10 bottom-10"></div>

      {/* 3. Apply shared card style and max-width (using max-w-md like Login/Signup) */}
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-xl z-10">
        {/* 4. Apply white text to CardHeader content */}
        <CardHeader className="space-y-1 text-center text-white">
          {/* 5. Add logo icon for consistency */}
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            Hi {userName}, welcome to ArthaMind
          </CardTitle>
          {/* 6. Apply shared CardDescription style */}
          <CardDescription className="text-base text-white/70">
            Kindly fill your personal credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            {/* Adjusted spacing to space-y-4 */}
            <div className="space-y-2">
              {/* 7. Apply white text to Label */}
              <Label htmlFor="dateOfBirth" className="text-white">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                data-testid="input-dob"
                // 8. Apply shared input style
                className="h-11 bg-white/10 text-white placeholder-white/80 border border-white/30"
              />
            </div>
            {age > 0 && (
              // 9. Apply consistent accent colors (bg-white/10 and text-pink-400)
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-sm font-medium text-white/90">
                  Your Age:{" "}
                  <span className="text-2xl font-mono font-bold text-pink-400">
                    {age}
                  </span>{" "}
                  years
                </p>
              </div>
            )}
            <div className="space-y-2">
              {/* 7. Apply white text to Label */}
              <Label htmlFor="gender" className="text-white">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger
                  className="h-11 bg-white/10 text-white placeholder-white/80 border border-white/30"
                  data-testid="select-gender"
                >
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              // 10. Apply shared button gradient style
              className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-pink-500 hover:to-orange-400 transition-all"
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
