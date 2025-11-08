import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// 1. Updated Card components to use the glassmorphism style
const Card = ({ children }) => (
  <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-xl p-6 mb-6 text-white">
    {children}
  </div>
);
const CardHeader = ({ children }) => (
  <div className="border-b border-white/30 pb-4">{children}</div>
);
const CardTitle = ({ children, className }) => (
  <h2 className={`font-bold text-white ${className}`}>{children}</h2>
);
const CardContent = ({ children }) => <div className="pt-6">{children}</div>;

ChartJS.register(ArcElement, Tooltip, Legend);

const createGradient = (chart, colorStart, colorEnd) => {
  const ctx = chart.ctx;
  const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  return gradient;
};
// Re-using the purple-pink accent colors for the chart slices
const gradientColors = [
  { start: "hsl(270 80% 60%)", end: "hsl(300 70% 40%)" }, // Purple
  { start: "hsl(330 80% 60%)", end: "hsl(340 70% 40%)" }, // Pink
  { start: "hsl(20 80% 65%)", end: "hsl(10 70% 45%)" }, // Orange
  { start: "hsl(190 80% 60%)", end: "hsl(210 70% 30%)" }, // Cyan
];

export default function ExpensesPieChart({ expenses }) {
  if (!expenses) return null;

  const data = {
    labels: ["Personal", "Medical", "Housing", "Loan/Debt"],
    datasets: [
      {
        data: [
          expenses.personal || 0,
          expenses.medical || 0,
          expenses.housing || 0,
          expenses.loanDebt || 0,
        ],
        backgroundColor: (context) => {
          if (!context.chart) return;
          const dataIndex = context.dataIndex;

          if (dataIndex >= 0 && dataIndex < gradientColors.length) {
            const colors = gradientColors[dataIndex];
            return createGradient(context.chart, colors.start, colors.end);
          }
          return "gray";
        },

        // 2. Updated border color to white/30 to match dark theme
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: {
            family: "Inter",
            size: 12,
          },
          // 3. Updated legend text color to white
          color: "white",
        },
      },
      tooltip: {
        // 4. Updated tooltip colors for dark background (light popover, dark text)
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background for contrast
        titleColor: "hsl(222.2 47.4% 11.2%)", // Dark text
        bodyColor: "hsl(222.2 47.4% 11.2%)", // Dark text
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80" data-testid="chart-expenses">
          <Pie data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
