import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnalysisProvider } from "@/context/AnalysisContext";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import AddTransaction from "./pages/AddTransaction";
import SpendingAnalytics from "./pages/SpendingAnalytics";
import BehaviorIntelligence from "./pages/BehaviorIntelligence";
import RiskStability from "./pages/RiskStability";
import OptimizationLab from "./pages/OptimizationLab";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AnalysisProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen w-full dark">
            <AppSidebar />
            <main className="flex-1 ml-60 p-6">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/add-transaction" element={<AddTransaction />} />
                <Route path="/analytics" element={<SpendingAnalytics />} />
                <Route path="/behavior" element={<BehaviorIntelligence />} />
                <Route path="/risk" element={<RiskStability />} />
                <Route path="/optimization" element={<OptimizationLab />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AnalysisProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
