import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// Mocked Card components (replace with your actual imports)
// --- Card Style Update: Glassmorphism and Hover Effects ---
const Card = ({ children }) => (
    <div 
        className="
            bg-gray-100/10 dark:bg-gray-700/30 backdrop-blur-md 
            rounded-3xl 
            shadow-2xl 
            border border-white/20 dark:border-gray-600/50
            p-8 mb-8 
            transition-all duration-500 ease-in-out 
            transform hover:scale-[1.005] hover:shadow-3xl
            "
        style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
    >
        {children}
    </div>
);
const CardHeader = ({ children }) => <div className="border-b border-white/20 dark:border-gray-600/50 pb-4">{children}</div>;
// FIX: Using backticks (`) for template literal inside the JSX braces ({})
const CardTitle = ({ children, className }) => <h2 className={`font-extrabold text-white dark:text-gray-50 ${className}`}>{children}</h2>;
const CardContent = ({ children }) => <div className="pt-6">{children}</div>;


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Creates a horizontal linear gradient using the chart's canvas context.
 * For horizontal bars, the gradient should span the width of the chart.
 */
const createGradient = (chart, colorStart, colorEnd) => {
    const ctx = chart.ctx;
    // Create a horizontal gradient (0, 0, chart.width, 0)
    const gradient = ctx.createLinearGradient(0, 0, chart.width, 0);
    gradient.addColorStop(0, colorStart); // Start color (e.g., on the left)
    gradient.addColorStop(1, colorEnd);   // End color (e.g., on the right)
    return gradient;
};


export default function SavingsBarChart({ goalAmount, currentSavings }) {
  if (!goalAmount && !currentSavings) return null;

  const remaining = Math.max(0, (goalAmount || 0) - (currentSavings || 0));

  const data = {
    labels: ["Savings Progress"],
    datasets: [
      {
        label: "Current Savings",
        data: [currentSavings || 0],
        // Set backgroundColor to a function to create the gradient
        backgroundColor: (context) => {
            if (!context.chart) return 'hsl(var(--chart-2))';
            // Use high-contrast gradient
            return createGradient(
                context.chart,
                'hsl(150 90% 65%)', // Lighter, start color
                'hsl(160 80% 35%)'  // Darker, end color
            );
        },
        borderRadius: 8,
      },
      {
        label: "Remaining",
        data: [remaining],
        // Subtle transparent gradient for the remaining bar portion
        backgroundColor: (context) => {
            if (!context.chart) return 'hsl(var(--muted))';
            return createGradient(
                context.chart,
                'hsl(0 0% 40% / 0.3)', 
                'hsl(0 0% 20% / 0.3)'
            );
        },
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        max: goalAmount, // Ensure the total width matches the goal amount
        grid: {
          color: "hsl(var(--border))",
          drawBorder: false,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))", // Adjusted for dark theme
          font: {
            family: "JetBrains Mono",
          },
          callback: function(value) {
            return "₹" + value.toLocaleString();
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "hsl(var(--foreground))", // Adjusted for dark theme
          font: {
            family: "Inter",
            size: 13,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          font: {
            family: "Inter",
            size: 12,
          },
          color: "hsl(var(--foreground))", // Adjusted for dark theme
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
            const label = context.dataset.label || "";
            const value = context.parsed.x || 0;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Savings Goal Progress</CardTitle>
        <p className="text-sm text-white/70 font-mono mt-1">
          Goal: ₹{(goalAmount || 0).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80" data-testid="chart-savings">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}





// import { Bar } from "react-chartjs-2";
  // import {
  //   Chart as ChartJS,
  //   CategoryScale,
  //   LinearScale,
  //   BarElement,
  //   Title,
  //   Tooltip,
  //   Legend,
  // } from "chart.js";
  // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  
  // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  // export default function SavingsBarChart({ goalAmount, currentSavings }) {
  //   const remaining = Math.max(0, (goalAmount || 0) - (currentSavings || 0));
  
  //   const data = {
  //     labels: ["Savings Progress"],
  //     datasets: [
  //       {
  //         label: "Current Savings",
  //         data: [currentSavings || 0],
  //         backgroundColor: "hsl(var(--chart-2))",
  //         borderRadius: 6,
  //       },
  //       {
  //         label: "Remaining",
  //         data: [remaining],
  //         backgroundColor: "hsl(var(--muted))",
  //         borderRadius: 6,
  //       },
  //     ],
  //   };
  
  //   const options = {
  //     indexAxis: "y",
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     scales: {
  //       x: {
  //         stacked: true,
  //         grid: {
  //           color: "hsl(var(--border))",
  //           drawBorder: false,
  //         },
  //         ticks: {
  //           color: "hsl(var(--muted-foreground))",
  //           font: {
  //             family: "JetBrains Mono",
  //           },
  //           callback: function(value) {
  //             return "₹" + value.toLocaleString();
  //           },
  //         },
  //       },
  //       y: {
  //         stacked: true,
  //         grid: {
  //           display: false,
  //         },
  //         ticks: {
  //           color: "hsl(var(--foreground))",
  //           font: {
  //             family: "Inter",
  //             size: 13,
  //           },
  //         },
  //       },
  //     },
  //     plugins: {
  //       legend: {
  //         position: "bottom",
  //         labels: {
  //           padding: 15,
  //           font: {
  //             family: "Inter",
  //             size: 12,
  //           },
  //           color: "hsl(var(--foreground))",
  //         },
  //       },
  //       tooltip: {
  //         backgroundColor: "hsl(var(--popover))",
  //         titleColor: "hsl(var(--popover-foreground))",
  //         bodyColor: "hsl(var(--popover-foreground))",
  //         borderColor: "hsl(var(--border))",
  //         borderWidth: 1,
  //         padding: 12,
  //         displayColors: true,
  //         callbacks: {
  //           label: function(context) {
  //             const label = context.dataset.label || "";
  //             const value = context.parsed.x || 0;
  //             return `${label}: ₹${value.toLocaleString()}`;
  //           },
  //         },
  //       },
  //     },
  //   };
  
  //   return (
  //     <Card>
  //       <CardHeader>
  //         <CardTitle className="text-lg">Savings Goal Progress</CardTitle>
  //         <p className="text-sm text-muted-foreground font-mono">
  //           Goal: ₹{(goalAmount || 0).toLocaleString()}
  //         </p>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="h-80" data-testid="chart-savings">
  //           <Bar data={data} options={options} />
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }
  