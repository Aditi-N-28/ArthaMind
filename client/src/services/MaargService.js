// Maarg AI Service - Mock implementation for Gemini API integration
// This service will be replaced with actual Gemini API calls in production

const hasGeminiKey = false; // Set to true when Gemini API key is added
let model = null;

// Uncomment below when @google/generative-ai is installed and API key is set
// import { GoogleGenerativeAI } from "@google/generative-ai";
// if (import.meta.env.VITE_GEMINI_API_KEY) {
//   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
//   model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// }

const financialTopics = {
  sip: ["sip", "systematic investment", "mutual fund"],
  loan: ["loan", "debt", "borrow", "repayment", "avalanche", "snowball"],
  tax: ["tax", "deduction", "exemption", "80c"],
  investment: ["invest", "stock", "equity", "bond", "portfolio"],
  insurance: ["insurance", "health insurance", "term insurance", "cover"],
  savings: ["save", "saving", "deposit", "fd", "fixed deposit"],
  retirement: ["retirement", "pension", "nps", "provident fund"],
  budget: ["budget", "expense", "spending", "track"],
};

export function detectTopicTag(question) {
  const lowerQuestion = question.toLowerCase();

  for (const [topic, keywords] of Object.entries(financialTopics)) {
    if (keywords.some((keyword) => lowerQuestion.includes(keyword))) {
      return topic;
    }
  }

  return null;
}

export async function getMaargResponse(question, userData) {
  // Auto-switch: real Gemini if API key exists, else mock
  if (hasGeminiKey && model) {
    try {
      const prompt = `
  You are Maarg, an AI financial mentor inside ArthaMind.
  Use the user's financial context to generate friendly, India-specific advice.

  User context:
  ${JSON.stringify(userData, null, 2)}

  User question:
  ${question}
        `;
      const result = await model.generateContent(prompt);
      const aiReply = result.response.text();
      return aiReply;
    } catch (err) {
      console.error("Gemini error → fallback to mock:", err);
    }
  }

  const context = buildUserContext(userData);
  const topicTag = detectTopicTag(question);

  const mockResponses = {
    sip: generateSIPResponse(question, context),
    loan: generateLoanResponse(question, context),
    tax: generateTaxResponse(question, context),
    investment: generateInvestmentResponse(question, context),
    insurance: generateInsuranceResponse(question, context),
    savings: generateSavingsResponse(question, context),
    retirement: generateRetirementResponse(question, context),
    budget: generateBudgetResponse(question, context),
  };

  if (topicTag && mockResponses[topicTag]) {
    return mockResponses[topicTag];
  }

  return generateGenericResponse(question, context);
}

function buildUserContext(userData) {
  const { personalData, financialData } = userData;

  return {
    age: personalData?.age || 0,
    salary: financialData?.monthlySalary || 0,
    expenses: financialData?.expenses || {},
    savings: financialData?.savings || {},
    totalExpenses: Object.values(financialData?.expenses || {}).reduce(
      (a, b) => a + b,
      0,
    ),
    disposableIncome:
      (financialData?.monthlySalary || 0) -
      Object.values(financialData?.expenses || {}).reduce((a, b) => a + b, 0),
  };
}

function generateSIPResponse(question, context) {
  const monthlySavingCapacity = context.disposableIncome;

  return `**Understanding SIP (Systematic Investment Plan)**

A SIP is a disciplined way to invest in mutual funds by contributing a fixed amount regularly (monthly/quarterly).

**Based on your profile:**
- Monthly disposable income: ₹${monthlySavingCapacity.toLocaleString()}
- Recommended SIP amount: ₹${Math.floor(monthlySavingCapacity * 0.3).toLocaleString()} (30% of disposable income)

**Benefits for you:**
1. **Rupee Cost Averaging**: Buy more units when prices are low
2. **Power of Compounding**: Long-term wealth creation
3. **Disciplined Investing**: Automated monthly investments

**Recommended Allocation (based on age ${context.age}):**
- Equity funds: ${context.age < 35 ? "70%" : context.age < 50 ? "50%" : "30%"}
- Debt funds: ${context.age < 35 ? "30%" : context.age < 50 ? "50%" : "70%"}

Would you like me to suggest specific fund categories based on your risk profile?`;
}

function generateLoanResponse(question, context) {
  const totalDebt = context.expenses.loanDebt || 0;
  const monthlyIncome = context.salary;
  const debtToIncomeRatio = ((totalDebt / monthlyIncome) * 100).toFixed(1);

  return `**Loan & Debt Management Strategy**

**Your Current Situation:**
- Monthly loan/debt payment: ₹${totalDebt.toLocaleString()}
- Debt-to-Income ratio: ${debtToIncomeRatio}% (Ideal: <30%)

**Repayment Strategies:**

1. **Avalanche Method** (Save more on interest)
   - Pay minimum on all debts
   - Extra payments on highest interest rate debt
   - Best for: Mathematically optimal

2. **Snowball Method** (Build momentum)
   - Pay minimum on all debts
   - Extra payments on smallest debt first
   - Best for: Quick wins and motivation

**My Recommendation for you:**
${
  debtToIncomeRatio > 30
    ? `⚠️ Your debt ratio is high. Focus on debt reduction:\n- Use Avalanche method to minimize interest\n- Avoid new loans\n- Consider debt consolidation if possible`
    : `✓ Your debt ratio is healthy. You can:\n- Continue current payments\n- Consider prepayment if interest rate > 10%\n- Balance between debt repayment and investments`
}

**Loan Eligibility Factors:**
- Age: ${context.age} years (Ideal: 25-55)
- Stable income: ₹${monthlyIncome.toLocaleString()}
- Existing obligations: ${debtToIncomeRatio}%

Would you like specific advice on prepayment vs. investment?`;
}

function generateTaxResponse(question, context) {
  return `**Tax Savings & Planning (India)**

**Based on your salary: ₹${context.salary.toLocaleString()}/month**

**Key Deductions under Section 80C (Max: ₹1.5 Lakh):**
1. ELSS Mutual Funds (Best for wealth creation)
2. PPF (Safe, 7-8% returns)
3. EPF contribution
4. Life Insurance Premium
5. Home Loan Principal
6. NSC, Tax Saver FDs

**Additional Deductions:**
- 80D: Health Insurance (₹25,000 - ₹1,00,000)
- 80CCD(1B): NPS (Additional ₹50,000)
- HRA: House Rent Allowance (if applicable)

**Smart Tax Planning Strategy:**
1. Max out 80C with ELSS (₹1.5L)
2. Health Insurance for family (₹25K-50K)
3. NPS contribution (₹50K additional)

**Total Potential Savings:**
- Old regime: ₹46,800 - ₹1,12,320 (depending on slab)
- New regime: Limited deductions, lower rates

**My Recommendation:**
Choose the regime that gives you maximum savings based on your actual deductions.

Would you like a personalized calculation?`;
}

function generateInvestmentResponse(question, context) {
  const age = context.age;
  const riskProfile =
    age < 35 ? "Aggressive" : age < 50 ? "Moderate" : "Conservative";

  return `**Investment Strategy for You**

**Your Risk Profile: ${riskProfile}**
(Based on age: ${age} years)

**Recommended Asset Allocation:**

${
  age < 35
    ? `
**Aggressive Portfolio (Age < 35)**
- Equity: 70-80% (Large cap 40%, Mid cap 20%, Small cap 10%)
- Debt: 20-30% (Corporate bonds, Debt funds)
- Gold: 5-10% (SGB, Gold ETF)

Time is your biggest asset. Focus on growth!`
    : age < 50
      ? `
**Moderate Portfolio (Age 35-50)**
- Equity: 50-60% (Large cap 35%, Mid cap 15%)
- Debt: 30-40% (PPF, Corporate bonds)
- Gold: 10% (Diversification)

Balance growth with stability.`
      : `
**Conservative Portfolio (Age 50+)**
- Equity: 30-40% (Blue chip stocks, Index funds)
- Debt: 50-60% (Bonds, FDs, PPF)
- Gold: 10% (Hedge against inflation)

Preserve capital while beating inflation.`
}

**Investment Principles:**
1. Start early, invest regularly (SIP)
2. Diversify across asset classes
3. Rebalance annually
4. Stay invested for long term (7+ years)

**Your monthly investment capacity:** ₹${context.disposableIncome.toLocaleString()}

Would you like specific fund recommendations?`;
}

function generateInsuranceResponse(question, context) {
  const recommendedCover = context.salary * 12 * 10;

  return `**Insurance Planning**

**Essential Coverage for you:**

1. **Term Life Insurance**
   - Recommended cover: ₹${recommendedCover.toLocaleString()} (10x annual income)
   - Monthly premium: ~₹${Math.floor(context.salary * 0.015).toLocaleString()}
   - Pure protection, no investment component

2. **Health Insurance**
   - Individual cover: ₹5-10 Lakhs minimum
   - Family floater: ₹10-25 Lakhs
   - Current spend: ₹${(context.expenses.medical || 0).toLocaleString()}/month

**Why Term Insurance:**
- Financial security for dependents
- Covers loans and liabilities
- Tax benefits under 80C (premium) & 10(10D) (maturity)

**Why Health Insurance:**
- Medical inflation: 10-15% annually
- Cashless hospitalization
- Tax benefits under 80D

**Action Steps:**
1. Buy term insurance NOW (premiums increase with age)
2. Get health insurance for entire family
3. Don't mix insurance with investment (avoid ULIPs)

**Your monthly insurance budget:** ₹${Math.floor(context.salary * 0.05).toLocaleString()} (5% of income)

Need help choosing the right policy?`;
}

function generateSavingsResponse(question, context) {
  const goal = context.savings.goalAmount || 0;
  const current = context.savings.currentSavings || 0;
  const remaining = goal - current;

  return `**Savings Strategy**

**Your Current Goal:**
- Target: ₹${goal.toLocaleString()}
- Saved: ₹${current.toLocaleString()}
- Remaining: ₹${remaining.toLocaleString()}

**Monthly saving capacity:** ₹${context.disposableIncome.toLocaleString()}

**High-Interest Savings Options:**

1. **Emergency Fund (3-6 months expenses)**
   - Liquid/Ultra-short debt funds
   - High-interest savings account
   - Target: ₹${(context.totalExpenses * 6).toLocaleString()}

2. **Short-term Goals (<3 years)**
   - FDs: 6-7% returns
   - Debt mutual funds: 7-9% returns
   - RDs: Disciplined saving

3. **Long-term Goals (>3 years)**
   - PPF: 7.1% (15 years, tax-free)
   - SCSS: 8.2% (for senior citizens)
   - NPS: Market-linked, tax benefits

**Smart Saving Formula:**
- Emergency fund: ${context.disposableIncome > context.totalExpenses * 6 ? "✓ Focus on goals" : "⚠️ Build this first"}
- Automate savings (SIP/RD)
- Review quarterly

**To reach your goal:**
Required monthly saving: ₹${remaining > 0 ? Math.ceil(remaining / 12).toLocaleString() : "0"} (12 months)

Want a customized savings plan?`;
}

function generateRetirementResponse(question, context) {
  const yearsToRetirement = Math.max(0, 60 - context.age);
  const currentSavings = context.savings.currentSavings || 0;

  return `**Retirement Planning**

**Your Retirement Timeline:**
- Current age: ${context.age}
- Years to retirement: ${yearsToRetirement}
- Time to build corpus: ${yearsToRetirement} years

**Retirement Corpus Calculation:**
- Monthly expenses today: ₹${context.totalExpenses.toLocaleString()}
- Inflation-adjusted (7%): ₹${Math.floor(context.totalExpenses * Math.pow(1.07, yearsToRetirement)).toLocaleString()}
- Required corpus (@4% withdrawal): ₹${Math.floor(context.totalExpenses * Math.pow(1.07, yearsToRetirement) * 300).toLocaleString()}

**Retirement Investment Vehicles:**

1. **NPS (National Pension System)**
   - Additional tax benefit: ₹50,000 (80CCD1B)
   - Low cost, market-linked
   - Lock-in till 60

2. **PPF (Public Provident Fund)**
   - 7.1% tax-free returns
   - 15-year lock-in
   - Safe and guaranteed

3. **Equity Mutual Funds**
   - Higher returns for long term
   - Beat inflation effectively
   - SIP for rupee-cost averaging

**Recommended Monthly Contribution:**
₹${Math.floor(context.disposableIncome * 0.3).toLocaleString()} (30% of disposable income)

**Asset Allocation:**
- Equity: ${100 - context.age}%
- Debt: ${context.age}%

Start now - every year delayed increases required contribution by ~15%!

Want a detailed retirement plan?`;
}

function generateBudgetResponse(question, context) {
  const savingsRate = (
    (context.disposableIncome / context.salary) *
    100
  ).toFixed(1);

  return `**Budget Analysis**

**Your Monthly Breakdown:**

**Income:** ₹${context.salary.toLocaleString()}

**Expenses:** ₹${context.totalExpenses.toLocaleString()}
- Personal: ₹${context.expenses.personal?.toLocaleString() || "0"}
- Medical: ₹${context.expenses.medical?.toLocaleString() || "0"}
- Housing: ₹${context.expenses.housing?.toLocaleString() || "0"}
- Loan/Debt: ₹${context.expenses.loanDebt?.toLocaleString() || "0"}

**Savings:** ₹${context.disposableIncome.toLocaleString()}
**Savings Rate:** ${savingsRate}%

**Ideal Budget (50-30-20 Rule):**
- Needs (50%): ₹${Math.floor(context.salary * 0.5).toLocaleString()}
- Wants (30%): ₹${Math.floor(context.salary * 0.3).toLocaleString()}
- Savings (20%): ₹${Math.floor(context.salary * 0.2).toLocaleString()}

**Your Performance:**
${
  savingsRate >= 20
    ? "✓ Excellent! You're meeting savings goals"
    : savingsRate >= 10
      ? "⚠️ Good, but try to increase to 20%"
      : "⚠️ Focus on increasing savings rate"
}

**Budget Optimization Tips:**
1. Track ALL expenses (use apps)
2. Cut non-essential wants by 20%
3. Automate savings on salary day
4. Review expenses monthly
5. Build emergency fund first

**Areas to optimize:**
${context.expenses.personal > context.salary * 0.2 ? "- Reduce personal expenses\n" : ""}
${context.expenses.housing > context.salary * 0.3 ? "- Housing costs are high\n" : ""}
${context.expenses.loanDebt > context.salary * 0.3 ? "- Focus on debt reduction\n" : ""}

Want help creating a detailed budget plan?`;
}

function generateGenericResponse(question, context) {
  return `Thank you for your question! I'm Maarg, your AI financial mentor.

Based on your profile:
- Age: ${context.age} years
- Monthly Income: ₹${context.salary.toLocaleString()}
- Disposable Income: ₹${context.disposableIncome.toLocaleString()}
- Savings Rate: ${((context.disposableIncome / context.salary) * 100).toFixed(1)}%

I can help you with:
📊 **Investment Planning** - SIP, mutual funds, stocks
💰 **Loan Management** - Repayment strategies, eligibility
💳 **Tax Savings** - Deductions, optimal planning
🏦 **Savings Goals** - Emergency fund, goal-based planning
🛡️ **Insurance** - Life, health coverage
📈 **Retirement Planning** - NPS, PPF, corpus building
💡 **Budgeting** - Expense tracking, optimization

Please ask me specific questions about any of these topics, and I'll provide personalized advice based on your financial situation!

For example:
- "Should I take a loan or save first?"
- "Explain SIP and which one suits me"
- "How can I save on taxes?"`;
}

export function getQuizForTopic(topic) {
  const quizzes = {
    sip: [
      {
        question:
          "What is the primary benefit of investing through a Systematic Investment Plan (SIP)?",
        options: [
          "Guaranteed returns on investment",
          "Rupee cost averaging and disciplined investing",
          "No market risk involved",
          "Instant withdrawal without penalties",
        ],
        correctAnswer: 1,
        explanation:
          "SIP helps with rupee cost averaging, which means you buy more units when prices are low and fewer when prices are high. This disciplined approach reduces the impact of market volatility.",
      },
      {
        question:
          "What is the recommended minimum investment period for a SIP in equity mutual funds?",
        options: [
          "6 months to 1 year",
          "1-2 years",
          "3-5 years or more",
          "Less than 6 months",
        ],
        correctAnswer: 2,
        explanation:
          "For equity mutual funds, a minimum investment horizon of 3-5 years is recommended to ride out market volatility and benefit from compounding.",
      },
    ],
    loan: [
      {
        question:
          "Which debt repayment strategy focuses on paying off loans with the highest interest rates first?",
        options: [
          "Snowball method",
          "Avalanche method",
          "Consolidation method",
          "Minimum payment method",
        ],
        correctAnswer: 1,
        explanation:
          "The Avalanche method prioritizes paying off debts with the highest interest rates first, which saves the most money on interest over time.",
      },
      {
        question: "What is a healthy debt-to-income ratio to maintain?",
        options: ["More than 50%", "Between 40-50%", "Below 36%", "Above 60%"],
        correctAnswer: 2,
        explanation:
          "A debt-to-income ratio below 36% is considered healthy, meaning your total monthly debt payments should not exceed 36% of your gross monthly income.",
      },
    ],
    tax: [
      {
        question:
          "What is the maximum deduction allowed under Section 80C of the Income Tax Act?",
        options: ["₹1,00,000", "₹1,50,000", "₹2,00,000", "₹50,000"],
        correctAnswer: 1,
        explanation:
          "Section 80C allows a maximum deduction of ₹1,50,000 per financial year for investments in specified instruments like PPF, ELSS, NSC, etc.",
      },
    ],
    investment: [
      {
        question: "What is diversification in investment?",
        options: [
          "Investing all money in one stock",
          "Spreading investments across different asset classes",
          "Only investing in fixed deposits",
          "Investing only in real estate",
        ],
        correctAnswer: 1,
        explanation:
          "Diversification means spreading investments across different asset classes (stocks, bonds, gold, real estate) to reduce risk and optimize returns.",
      },
    ],
    insurance: [
      {
        question: "What is the recommended life insurance coverage amount?",
        options: [
          "Equal to annual income",
          "2-3 times annual income",
          "10-15 times annual income",
          "Equal to savings",
        ],
        correctAnswer: 2,
        explanation:
          "Financial experts recommend life insurance coverage of 10-15 times your annual income to ensure your family's financial security.",
      },
    ],
    savings: [
      {
        question: "What should be the ideal size of an emergency fund?",
        options: [
          "1 month's expenses",
          "2-3 months' expenses",
          "6-12 months' expenses",
          "1 year's salary",
        ],
        correctAnswer: 2,
        explanation:
          "An emergency fund should cover 6-12 months of living expenses to handle unexpected situations like job loss or medical emergencies.",
      },
    ],
    retirement: [
      {
        question:
          "At what age can you start withdrawing from NPS (National Pension System)?",
        options: ["50 years", "55 years", "60 years", "65 years"],
        correctAnswer: 2,
        explanation:
          "You can start withdrawing from NPS at age 60. At least 40% of the corpus must be used to purchase an annuity.",
      },
    ],
    budget: [
      {
        question: "What is the 50/30/20 budgeting rule?",
        options: [
          "50% savings, 30% needs, 20% wants",
          "50% needs, 30% wants, 20% savings",
          "50% wants, 30% savings, 20% needs",
          "50% investments, 30% expenses, 20% emergency fund",
        ],
        correctAnswer: 1,
        explanation:
          "The 50/30/20 rule suggests allocating 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.",
      },
    ],
  };

  const topicQuizzes = quizzes[topic] || quizzes.investment;
  const randomIndex = Math.floor(Math.random() * topicQuizzes.length);
  return topicQuizzes[randomIndex];
}

export default {
  getMaargResponse,
  detectTopicTag,
  getQuizForTopic,
};
