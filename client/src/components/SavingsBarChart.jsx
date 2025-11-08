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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SavingsBarChart({ goalAmount, currentSavings }) {
  const remaining = Math.max(0, (goalAmount || 0) - (currentSavings || 0));

  const data = {
    labels: ["Savings Progress"],
    datasets: [
      {
        label: "Current Savings",
        data: [currentSavings || 0],
        backgroundColor: "hsl(var(--chart-2))",
        borderRadius: 6,
      },
      {
        label: "Remaining",
        data: [remaining],
        backgroundColor: "hsl(var(--muted))",
        borderRadius: 6,
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
        grid: {
          color: "hsl(var(--border))",
          drawBorder: false,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
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
          color: "hsl(var(--foreground))",
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
        <CardTitle className="text-lg">Savings Goal Progress</CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
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
