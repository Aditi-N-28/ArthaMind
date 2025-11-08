import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import PersonalCredentials from "@/pages/PersonalCredentials";
import FinancialCredentials from "@/pages/FinancialCredentials";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

function HomeRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/login");
  }, [setLocation]);
  return null;
}

const ProtectedPersonal = () => <ProtectedRoute component={PersonalCredentials} />;
const ProtectedFinancial = () => <ProtectedRoute component={FinancialCredentials} />;
const ProtectedDashboard = () => <ProtectedRoute component={Dashboard} />;

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/personal" component={ProtectedPersonal} />
      <Route path="/financial" component={ProtectedFinancial} />
      <Route path="/dashboard" component={ProtectedDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
