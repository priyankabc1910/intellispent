import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "@/context/AnalysisContext";
import { AnalysisResult } from "@/types/analysis";
import { DollarSign, Plus, X, ArrowRight, Loader2, Tag, Receipt } from "lucide-react";

export default function AddTransaction() {
  const [income, setIncome] = useState("");
  const [categories, setCategories] = useState<{ name: string; amount: string }[]>([
    { name: "Rent", amount: "" },
    { name: "Food", amount: "" },
    { name: "Entertainment", amount: "" },
    { name: "Shopping", amount: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setResult, setIncome: setCtxIncome, setExpenses: setCtxExpenses } = useAnalysis();
  const navigate = useNavigate();

  const addCategory = () => setCategories((prev) => [...prev, { name: "", amount: "" }]);
  const removeCategory = (i: number) => setCategories((prev) => prev.filter((_, idx) => idx !== i));
  const updateCategory = (i: number, field: "name" | "amount", value: string) =>
    setCategories((prev) => prev.map((cat, idx) => (idx === i ? { ...cat, [field]: value } : cat)));

  const preview = useMemo(() => {
    const inc = parseFloat(income) || 0;
    let total = 0;
    for (const cat of categories) total += parseFloat(cat.amount) || 0;
    const savings = inc - total;
    const ratio = inc > 0 ? ((savings / inc) * 100).toFixed(1) : "0.0";
    return { total, savings, ratio };
  }, [income, categories]);

  const handleAnalyze = async () => {
    setError("");
    const incomeVal = parseFloat(income);
    if (!incomeVal || incomeVal <= 0) { setError("Please enter a valid income."); return; }

    const expenseMap: Record<string, number> = {};
    for (const cat of categories) {
      const name = cat.name.trim().toLowerCase();
      const val = parseFloat(cat.amount) || 0;
      if (name && val > 0) expenseMap[name] = (expenseMap[name] || 0) + val;
    }
    if (Object.keys(expenseMap).length === 0) { setError("Add at least one expense category with an amount."); return; }

    setLoading(true);
    try {
      const res = await fetch("https://unnymphlike-dirk-asbestoid.ngrok-free.dev/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income: incomeVal, expenses: expenseMap }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data: AnalysisResult = await res.json();
      setResult(data);
      setCtxIncome(incomeVal);
      setCtxExpenses(expenseMap);
      navigate("/");
    } catch {
      setError("Failed to connect to analysis server. Make sure it's running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold heading mb-0.5">Add Transactions</h1>
      <p className="text-muted-foreground text-xs mb-8">Enter your monthly income and expenses.</p>

      {/* Section 1: Income */}
      <div className="glass-card p-5 rounded-xl section-gap">
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Monthly Income</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">₹</span>
          <input type="number" placeholder="80,000" value={income} onChange={(e) => setIncome(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono" />
        </div>
      </div>

      {/* Section 2: Dynamic Categories */}
      <div className="glass-card p-5 rounded-xl section-gap">
        <label className="text-xs font-medium text-muted-foreground mb-3 block">Expense Categories</label>
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input type="text" placeholder="Category name" value={cat.name}
                  onChange={(e) => updateCategory(i, "name", e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">₹</span>
                <input type="number" placeholder="Amount" value={cat.amount}
                  onChange={(e) => updateCategory(i, "amount", e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono text-sm" />
              </div>
              <button onClick={() => removeCategory(i)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addCategory} className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium">
          <Plus className="h-3.5 w-3.5" /> Add Category
        </button>
      </div>

      {/* Section 3: Summary Preview */}
      <div className="glass-card p-5 rounded-xl section-gap">
        <div className="flex items-center gap-2 mb-3">
          <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">Preview Summary</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">Total Expenses</p>
            <p className="text-xl font-bold font-mono heading">₹ {preview.total.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">Est. Savings</p>
             <p className={`text-xl font-bold font-mono ${preview.savings >= 0 ? "risk-low" : "risk-high"}`}>
               ₹ {preview.savings.toLocaleString("en-IN")}
             </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-0.5">Savings Ratio</p>
            <p className="text-xl font-bold font-mono heading">{preview.ratio}%</p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg section-gap">{error}</p>
      )}

      <button onClick={handleAnalyze} disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Analyze Financial Health <ArrowRight className="h-4 w-4" /></>}
      </button>
    </div>
  );
}
