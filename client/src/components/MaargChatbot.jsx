import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, arrayUnion, getDoc, setDoc, increment } from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Sparkles, Award, HelpCircle, Loader2 } from "lucide-react";
import { getMaargResponse, detectTopicTag } from "../services/MaargService";

export default function MaargChatbot({ onClose, userData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [learningHistory, setLearningHistory] = useState({});
  const [showQuizOffer, setShowQuizOffer] = useState(false);
  const [quizTopic, setQuizTopic] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    loadLearningHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const chatDoc = await getDoc(doc(db, "users", auth.currentUser.uid, "chat", "history"));
      if (chatDoc.exists()) {
        setMessages(chatDoc.data().messages || []);
      } else {
        const welcomeMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: `Hello! I'm Maarg, your AI financial mentor. I'm here to help you make smarter money decisions. Ask me anything about investments, savings, loans, or financial planning!`,
          timestamp: Date.now(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const loadLearningHistory = async () => {
    try {
      const learningDoc = await getDoc(doc(db, "users", auth.currentUser.uid, "learning", "history"));
      if (learningDoc.exists()) {
        setLearningHistory(learningDoc.data().topics || {});
      }
    } catch (error) {
      console.error("Error loading learning history:", error);
    }
  };

  const updateLearningHistory = async (topicTag) => {
    if (!topicTag) return;

    const currentCount = learningHistory[topicTag]?.questionCount || 0;
    const newCount = currentCount + 1;

    const updatedHistory = {
      ...learningHistory,
      [topicTag]: {
        questionCount: newCount,
        quizOffered: learningHistory[topicTag]?.quizOffered || false,
        quizCompleted: learningHistory[topicTag]?.quizCompleted || false,
        lastAsked: Date.now(),
      },
    };

    setLearningHistory(updatedHistory);

    try {
      await setDoc(doc(db, "users", auth.currentUser.uid, "learning", "history"), {
        topics: updatedHistory,
      });

      if (newCount >= 2 && !updatedHistory[topicTag].quizOffered) {
        setQuizTopic(topicTag);
        setShowQuizOffer(true);
      }
    } catch (error) {
      console.error("Error updating learning history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const topicTag = detectTopicTag(input);
      
      const response = await getMaargResponse(input, userData);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now() + 1,
        topicTag: topicTag,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const chatDocRef = doc(db, "users", auth.currentUser.uid, "chat", "history");
      await setDoc(chatDocRef, {
        messages: [...messages, userMessage, assistantMessage],
      }, { merge: true });

      await awardXP(5);

      if (topicTag) {
        await updateLearningHistory(topicTag);
      }
    } catch (error) {
      console.error("Error getting response:", error);
      toast.error("Failed to get response from Maarg");
    } finally {
      setLoading(false);
    }
  };

  const awardXP = async (xp) => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        "gamification.xp": increment(xp),
      });
    } catch (error) {
      console.error("Error awarding XP:", error);
    }
  };

  const awardCoins = async (coins) => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        "gamification.coins": increment(coins),
      });
    } catch (error) {
      console.error("Error awarding coins:", error);
    }
  };

  const handleAcceptQuiz = async () => {
    setShowQuizOffer(false);
    
    const quizMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: `Great! Let's test your knowledge on ${quizTopic}. Here's a quick quiz:\n\n1. What is the primary benefit of ${quizTopic}?\n2. When is the best time to consider ${quizTopic}?\n3. What are the key factors to evaluate?\n\nTake your time and answer these questions!`,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, quizMessage]);

    try {
      const updatedHistory = {
        ...learningHistory,
        [quizTopic]: {
          ...learningHistory[quizTopic],
          quizOffered: true,
        },
      };
      
      await setDoc(doc(db, "users", auth.currentUser.uid, "learning", "history"), {
        topics: updatedHistory,
      });
    } catch (error) {
      console.error("Error updating quiz status:", error);
    }
  };

  const handleDeclineQuiz = () => {
    setShowQuizOffer(false);
    toast.info("Quiz declined. You can ask for one anytime!");
  };

  const handleCompleteQuiz = async () => {
    await awardXP(20);
    await awardCoins(10);
    
    toast.success("🎉 Great job! You earned 20 XP and 10 Coins!", {
      position: "top-center",
      autoClose: 5000,
    });

    const congratsMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: `🎉 Excellent work! You've completed the ${quizTopic} quiz and earned:\n\n✨ +20 XP\n🪙 +10 Coins\n\nKeep learning and growing your financial knowledge!`,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, congratsMessage]);

    try {
      const updatedHistory = {
        ...learningHistory,
        [quizTopic]: {
          ...learningHistory[quizTopic],
          quizCompleted: true,
        },
      };
      
      await setDoc(doc(db, "users", auth.currentUser.uid, "learning", "history"), {
        topics: updatedHistory,
      });
    } catch (error) {
      console.error("Error updating quiz completion:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl h-[600px] flex flex-col shadow-2xl">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Chat with Maarg
                  <Badge variant="default" className="text-xs">AI</Badge>
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Award className="h-3 w-3" />
                    Premium
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Your intelligent financial mentor</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-chat">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${message.role}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    {message.topicTag && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {message.topicTag}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}

              {showQuizOffer && (
                <div className="flex justify-center">
                  <Card className="max-w-md border-primary/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 mb-4">
                        <HelpCircle className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">Strengthen Your Knowledge</h4>
                          <p className="text-sm text-muted-foreground">
                            I notice you've been asking about <span className="font-semibold">{quizTopic}</span> frequently. 
                            Would you like me to generate a short quiz to strengthen your understanding?
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAcceptQuiz} data-testid="button-accept-quiz">
                          Yes, let's do it!
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleDeclineQuiz}>
                          Maybe later
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask Maarg about investments, savings, loans..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !loading && handleSendMessage()}
                disabled={loading}
                data-testid="input-chat-message"
                className="h-11"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={loading || !input.trim()}
                data-testid="button-send-message"
                className="h-11 px-6"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Earn XP and Coins by engaging with Maarg! 
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
