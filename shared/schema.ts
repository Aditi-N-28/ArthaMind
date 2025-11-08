import { z } from "zod";

// User Personal Data Schema
export const personalDataSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string(),
  age: z.number().min(0),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
});

export type PersonalData = z.infer<typeof personalDataSchema>;

// User Financial Data Schema
export const financialDataSchema = z.object({
  monthlySalary: z.number().min(0),
  expenses: z.object({
    personal: z.number().min(0),
    medical: z.number().min(0),
    housing: z.number().min(0),
    loanDebt: z.number().min(0),
  }),
  savings: z.object({
    goalAmount: z.number().min(0),
    currentSavings: z.number().min(0),
  }),
});

export type FinancialData = z.infer<typeof financialDataSchema>;

// User Gamification Data
export const gamificationSchema = z.object({
  xp: z.number().default(0),
  coins: z.number().default(0),
  level: z.number().default(1),
});

export type GamificationData = z.infer<typeof gamificationSchema>;

// Chat Message Schema
export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
  topicTag: z.string().optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Learning History Schema
export const learningHistorySchema = z.object({
  topicTag: z.string(),
  questionCount: z.number(),
  quizOffered: z.boolean().default(false),
  quizCompleted: z.boolean().default(false),
  lastAsked: z.number(),
});

export type LearningHistory = z.infer<typeof learningHistorySchema>;

// Complete User Profile
export const userProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  personalData: personalDataSchema.optional(),
  financialData: financialDataSchema.optional(),
  gamification: gamificationSchema,
  createdAt: z.number(),
  onboardingComplete: z.boolean().default(false),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// News Article Schema
export const newsArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  publishedAt: z.string(),
  source: z.string(),
});

export type NewsArticle = z.infer<typeof newsArticleSchema>;
