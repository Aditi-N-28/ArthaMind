import React from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
const Card = ({ children }) => <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">{children}</div>;
const CardHeader = ({ children }) => <div className="border-b border-gray-200 dark:border-gray-700 pb-4">{children}</div>;
const CardTitle = ({ children, className }) => <h2 className={`font-bold text-gray-900 dark:text-gray-100 ${className}`}>{children}</h2>;
const CardContent = ({ children }) => <div className="pt-6">{children}</div>;
ChartJS.register(ArcElement, Tooltip, Legend);

const createGradient = (chart, colorStart, colorEnd) => {
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient.addColorStop(0, colorStart); 
    gradient.addColorStop(1, colorEnd);  
    return gradient;
};
  const gradientColors = [
      { start: 'hsl(210 80% 60%)', end: 'hsl(220 70% 40%)' }, 
      { start: 'hsl(140 80% 60%)', end: 'hsl(150 70% 40%)' }, 
      { start: 'hsl(40 80% 65%)', end: 'hsl(30 70% 45%)' }, 
      { start: 'hsl(350 80% 60%)', end: 'hsl(340 70% 30%)' }, 
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
                      return createGradient(
                          context.chart,
                          colors.start, 
                          colors.end
                      );
                  }
                  return 'gray'; 
              },

              borderColor: "hsl(var(--card))",
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
          color: "hsl(var(--foreground))",
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
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
