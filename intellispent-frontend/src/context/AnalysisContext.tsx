import { createContext, useContext, useState, ReactNode } from "react";
import { AnalysisResult } from "@/types/analysis";

interface AnalysisContextType {
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;
  income: number;
  setIncome: (n: number) => void;
  expenses: Record<string, number>;
  setExpenses: (e: Record<string, number>) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState<Record<string, number>>({});

  return (
    <AnalysisContext.Provider value={{ result, setResult, income, setIncome, expenses, setExpenses }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider");
  return ctx;
};
