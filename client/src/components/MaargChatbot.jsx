import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { X, Send, Sparkles, Award, HelpCircle, Loader2 } from "lucide-react";

// --- Shadcn/ui Replication (Assumed available from environment or previous files) ---
// For brevity, assuming these components are defined or available globally/locally.
// In a full environment, these would be imported. For this single file, we'll
// proceed assuming the structure is correct.

// Replacing imports with standard React components for the single-file environment:
const Card = ({ children, className = '' }) => <div className={`rounded-xl border bg-card text-card-foreground shadow-2xl ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`border-b border-border pb-4 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Button = ({ children, onClick, disabled, className = '', variant = 'default', size = 'default', Icon, 'data-testid': dataTestId }) => {
    let baseStyle = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    let variantStyle = '';

    switch (variant) {
        case 'default':
            variantStyle = 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
            break;
        case 'secondary':
            variantStyle = 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80';
            break;
        case 'outline':
            variantStyle = 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground';
            break;
        case 'destructive':
            variantStyle = 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90';
            break;
    }

    let sizeStyle = size === 'sm' ? 'h-9 px-3' : size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2';

    return (
        <button
            className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
            onClick={onClick}
            disabled={disabled}
            data-testid={dataTestId}
        >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {children}
        </button>
    );
};
const Input = ({ value, onChange, placeholder, onKeyPress, disabled, className = '', 'data-testid': dataTestId }) => (
    <input 
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyPress={onKeyPress}
        disabled={disabled}
        data-testid={dataTestId}
    />
);
const Badge = ({ children, variant = 'default', className = '' }) => {
    let variantStyle = '';
    switch (variant) {
        case 'default':
            variantStyle = 'bg-primary hover:bg-primary/80 text-primary-foreground';
            break;
        case 'secondary':
            variantStyle = 'bg-secondary hover:bg-secondary/80 text-secondary-foreground';
            break;
        case 'outline':
            variantStyle = 'text-foreground border border-input';
            break;
    }
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyle} ${className}`}>{children}</span>;
};

// Simplified ScrollArea implementation for the single-file context
const ScrollArea = React.forwardRef(({ children, className = '' }, ref) => (
    <div ref={ref} className={`overflow-y-auto ${className}`} style={{ scrollbarWidth: 'thin' }}>{children}</div>
));

// --- Firebase Initialization (Replacing ../firebase) ---
import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import {
    getAuth,
    signInAnonymously,
    signInWithCustomToken,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import {
    getFirestore,
    doc,
    updateDoc,
    getDoc,
    setDoc,
    increment,
    collection
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// Global Firebase variables provided by the environment
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'maarg-default-app-id'; // Not strictly needed here

// --- MaargService Implementation (Replacing ../services/MaargService) ---

// Utility function to handle exponential backoff for API calls
const withRetry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed.`, error);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
};

/**
 * Calls the Gemini API to get a contextual chat response.
 * @param {string} inputText - The latest user message.
 * @param {Array<Object>} history - The current message history (role: 'user' or 'assistant').
 * @returns {Promise<string>} The assistant's generated response.
 */
const getMaargResponse = async (inputText, history) => {
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const contents = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const systemPrompt = "You are Maarg, an intelligent, empathetic, and professional financial mentor. Your goal is to provide clear, actionable, and safe advice on investments, savings, loans, and financial planning. Keep responses concise, encouraging, and focused on helping the user achieve their financial goals. Do not generate code, images, or external links.";

    const payload = {
        contents: contents,
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        tools: [{ "google_search": {} }] // Enable grounding for financial data
    };

    return withRetry(async () => {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I couldn't process that request right now. Please try again.";
    });
};

/**
 * Calls the Gemini API to detect the main topic tag from the input text.
 * @param {string} text - The text content to analyze.
 * @returns {Promise<string>} The detected topic tag.
 */
const detectTopicTag = async (text) => {
    const userQuery = `Analyze the following user query about finance and identify the single most relevant financial topic tag (e.g., 'Retirement Planning', 'Stock Market Basics', 'Mortgage Rates', 'Budgeting'). Your response must be ONLY the topic tag string, with no other text, introduction, or explanation. \n\nQuery: \n${text}`;
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
            parts: [{ text: "You are an expert AI tagger for financial topics. You must only respond with a single, concise topic tag." }]
        },
    };

    return withRetry(async () => {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const detectedText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "General Finance";
        return detectedText.replace(/['"]/g, ''); // Clean up quotes if model adds them
    });
};

/**
 * Calls the Gemini API to generate a structured quiz for a given topic.
 * NOTE: For simplicity and to fit the current quiz structure, this is simplified.
 * In a real app, this would return a full quiz object, but here we return a single question.
 * @param {string} topic - The topic for which to generate the quiz.
 * @returns {Promise<Object>} A single quiz question object.
 */
const getQuizForTopic = async (topic) => {
    const userQuery = `Generate a single challenging multiple-choice question about the financial topic: "${topic}". The question must have exactly four options (Option 1, Option 2, Option 3, Option 4), and one correct answer index (0-3). Also provide a brief, one-sentence explanation.`;
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const quizSchema = {
        type: "OBJECT",
        properties: {
            question: { type: "STRING", description: "The quiz question text." },
            options: {
                type: "ARRAY",
                description: "Exactly four distinct answer options.",
                items: { type: "STRING" },
                minItems: 4,
                maxItems: 4,
            },
            correctAnswer: { type: "INTEGER", description: "The 0-based index (0, 1, 2, or 3) of the correct option." },
            explanation: { type: "STRING", description: "A brief, one-sentence explanation for the correct answer." }
        },
        required: ["question", "options", "correctAnswer", "explanation"],
    };

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: quizSchema,
            temperature: 0.7
        },
        systemInstruction: {
            parts: [{ text: "You are an expert quiz generator. You must return a valid JSON object matching the provided schema, and nothing else." }]
        },
    };

    return withRetry(async () => {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
            throw new Error("Failed to get valid JSON response from API.");
        }

        return JSON.parse(jsonText);
    });
};

// --- Main React Component ---

export default function MaargChatbot({ onClose, userData }) {
  // --- Firebase State ---
  const [authInstance, setAuthInstance] = useState(null);
  const [dbInstance, setDbInstance] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // --- Chatbot State ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [learningHistory, setLearningHistory] = useState({});
  const [showQuizOffer, setShowQuizOffer] = useState(false);
  const [quizTopic, setQuizTopic] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const scrollRef = useRef(null);

  // --- Firebase/Auth Initialization Effect (Replaces broken imports) ---
  useEffect(() => {
    let app, auth, db;
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        setAuthInstance(auth);
        setDbInstance(db);

        const signIn = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (e) {
                console.error("Firebase Auth failed:", e);
                // Handle severe auth error
            }
        };
        signIn();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    } catch (e) {
        console.error("Firebase Initialization Error:", e);
        setIsAuthReady(true);
    }
  }, []);

  // --- Data Loading Effects (Triggered once auth is ready) ---
  useEffect(() => {
    if (isAuthReady && userId && dbInstance && authInstance) {
      loadChatHistory();
      loadLearningHistory();
    }
  }, [isAuthReady, userId, dbInstance, authInstance]); // Dependencies ensure this runs after init

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to the bottom whenever messages change
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    if (!userId || !dbInstance) return;
    try {
      const chatDoc = await getDoc(doc(dbInstance, "users", userId, "chat", "history"));
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
    if (!userId || !dbInstance) return;
    try {
      const learningDoc = await getDoc(doc(dbInstance, "users", userId, "learning", "history"));
      if (learningDoc.exists()) {
        setLearningHistory(learningDoc.data().topics || {});
      }
    } catch (error) {
      console.error("Error loading learning history:", error);
    }
  };

  const updateLearningHistory = useCallback(async (topicTag) => {
    if (!topicTag || !userId || !dbInstance) return;

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
      await setDoc(doc(dbInstance, "users", userId, "learning", "history"), {
        topics: updatedHistory,
      });

      // Offer quiz if count reaches 2 and a quiz hasn't been offered yet
      if (newCount >= 2 && !updatedHistory[topicTag].quizOffered) {
        setQuizTopic(topicTag);
        setShowQuizOffer(true);
      }
    } catch (error) {
      console.error("Error updating learning history:", error);
    }
  }, [userId, dbInstance, learningHistory]);

  const awardXP = useCallback(async (xp) => {
    if (!userId || !dbInstance) return;
    try {
      const userRef = doc(dbInstance, "users", userId);
      await updateDoc(userRef, {
        "gamification.xp": increment(xp),
      });
    } catch (error) {
      console.error("Error awarding XP:", error);
    }
  }, [userId, dbInstance]);

  const awardCoins = useCallback(async (coins) => {
    if (!userId || !dbInstance) return;
    try {
      const userRef = doc(dbInstance, "users", userId);
      await updateDoc(userRef, {
        "gamification.coins": increment(coins),
      });
    } catch (error) {
      console.error("Error awarding coins:", error);
    }
  }, [userId, dbInstance]);


  const handleSendMessage = async () => {
    if (!input.trim() || loading || !userId || activeQuiz !== null) return;

    const currentInput = input.trim(); 

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: Date.now(),
    };

    // 1. Optimistically update the local state for fast UI feedback
    const messagesWithUser = [...messages, userMessage]; 
    setMessages(messagesWithUser); 
    setInput("");
    setLoading(true);
    setShowQuizOffer(false); // Hide quiz offer while waiting for response

    try {
      // 2. Determine topic tag while waiting for main response
      const topicTagPromise = detectTopicTag(currentInput); 

      // 3. Get the main chat response using the full history
      const response = await getMaargResponse(currentInput, messagesWithUser);
      const topicTag = await topicTagPromise; // Wait for topic tag

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now() + 1,
        topicTag: topicTag,
      };

      // 4. Construct the final, complete array
      const finalMessagesToSave = [...messagesWithUser, assistantMessage];

      // 5. Update local state with the final array
      setMessages(finalMessagesToSave);

      // 6. Save the final, correct array to Firestore
      const chatDocRef = doc(dbInstance, "users", userId, "chat", "history");
      await setDoc(chatDocRef, {
        messages: finalMessagesToSave, 
      }, { merge: true });

      // 7. Update gamification and learning history
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


  const handleAcceptQuiz = async () => {
    if (!dbInstance || !userId) return;

    setShowQuizOffer(false);
    setLoading(true);

    try {
        const quiz = await getQuizForTopic(quizTopic);
        setActiveQuiz(quiz);
        setSelectedAnswer(null);

        const quizMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: `Great! Let's test your knowledge on ${quizTopic}. Here's your question:`,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, quizMessage]);

        // Update learning history to mark quiz offered
        const updatedHistory = {
            ...learningHistory,
            [quizTopic]: {
                ...learningHistory[quizTopic],
                quizOffered: true,
            },
        };

        await setDoc(doc(dbInstance, "users", userId, "learning", "history"), {
            topics: updatedHistory,
        }, { merge: true });

        // Update local learning history state
        setLearningHistory(updatedHistory);

    } catch (error) {
        console.error("Error generating or accepting quiz:", error);
        toast.error("Failed to generate quiz. Please try again later.");
    } finally {
        setLoading(false);
    }
  };

  const handleDeclineQuiz = () => {
    setShowQuizOffer(false);
    toast.info("Quiz declined. You can ask for one anytime!");
  };

  const handleSubmitQuizAnswer = async (answerIndex) => {
    if (!activeQuiz || selectedAnswer !== null || !userId || !dbInstance) return;

    const isCorrect = answerIndex === activeQuiz.correctAnswer;
    setSelectedAnswer(answerIndex);

    const userAnswerMessage = {
      id: Date.now().toString(),
      role: "user",
      content: activeQuiz.options[answerIndex],
      timestamp: Date.now(),
    };

    // Optimistically show user's answer
    setMessages((prev) => [...prev, userAnswerMessage]);

    if (isCorrect) {
      await awardXP(20);
      await awardCoins(10);

      toast.success("🎉 Correct! You earned 20 XP and 10 Coins!", {
        position: "top-center",
        autoClose: 5000,
      });

      const congratsMessage = {
        id: Date.now().toString() + 1,
        role: "assistant",
        content: `🎉 Excellent work! That's the correct answer: ${activeQuiz.options[activeQuiz.correctAnswer]}.\n\nExplanation: ${activeQuiz.explanation}\n\nYou've earned:\n✨ **+20 XP**\n🪙 **+10 Coins**\n\nKeep learning and growing your financial knowledge!`,
        timestamp: Date.now() + 1,
      };

      setMessages((prev) => [...prev, congratsMessage]);
    } else {
      const feedbackMessage = {
        id: Date.now().toString() + 1,
        role: "assistant",
        content: `Not quite right, but great effort! The correct answer is: **${activeQuiz.options[activeQuiz.correctAnswer]}**.\n\nExplanation: ${activeQuiz.explanation}\n\nYou still earned 5 XP for trying.`,
        timestamp: Date.now() + 1,
      };

      setMessages((prev) => [...prev, feedbackMessage]);
      await awardXP(5);
    }

    try {
      // Mark quiz as completed in learning history
      const updatedHistory = {
        ...learningHistory,
        [quizTopic]: {
          ...learningHistory[quizTopic],
          quizCompleted: true,
        },
      };

      await setDoc(doc(dbInstance, "users", userId, "learning", "history"), {
        topics: updatedHistory,
      }, { merge: true });

      // Update local learning history state
      setLearningHistory(updatedHistory);
    } catch (error) {
      console.error("Error updating quiz completion:", error);
    }

    // Delay clearing the quiz so the user can see the feedback
    setTimeout(() => {
      setActiveQuiz(null);
      setSelectedAnswer(null);
    }, 4000); 
  };

  if (!isAuthReady) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

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

              {showQuizOffer && !activeQuiz && (
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
                        <Button size="sm" onClick={handleAcceptQuiz} disabled={loading} data-testid="button-accept-quiz">
                          Yes, let's do it!
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleDeclineQuiz} disabled={loading} data-testid="button-maybe-later">
                          Maybe later
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeQuiz && (
                <div className="flex justify-center">
                  <Card className="max-w-md border-primary">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <Badge variant="default" className="mb-3">Quiz Time!</Badge>
                        <h4 className="font-semibold mb-3">{activeQuiz.question}</h4>
                      </div>
                      <div className="space-y-2">
                        {activeQuiz.options.map((option, index) => (
                          <Button
                            key={index}
                            variant={
                              selectedAnswer === null 
                                ? "outline" 
                                : index === activeQuiz.correctAnswer 
                                  ? "default" 
                                  : selectedAnswer === index 
                                    ? "destructive" 
                                    : "outline"
                            }
                            // Custom class for better color overriding
                            className={`w-full justify-start text-left h-auto py-3 px-4 transition-all duration-300 ${
                              selectedAnswer !== null && index === activeQuiz.correctAnswer
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                                : selectedAnswer !== null && selectedAnswer === index && selectedAnswer !== activeQuiz.correctAnswer
                                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                                  : selectedAnswer !== null 
                                    ? "opacity-50 pointer-events-none" 
                                    : "hover:bg-primary/10"
                            }`}
                            onClick={() => handleSubmitQuizAnswer(index)}
                            disabled={selectedAnswer !== null}
                            data-testid={`button-quiz-option-${index}`}
                          >
                            <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </Button>
                        ))}
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
                disabled={loading || activeQuiz !== null} // Disable send while quiz is active
                data-testid="input-chat-message"
                className="h-11"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={loading || !input.trim() || activeQuiz !== null} // Disable send while quiz is active
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