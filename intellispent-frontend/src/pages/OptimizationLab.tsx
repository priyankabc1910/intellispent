import { useState, useMemo } from "react";
import { useAnalysis } from "@/context/AnalysisContext";
import { useNavigate } from "react-router-dom";
import { FlaskConical, ArrowRight, PiggyBank, ShieldCheck, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function OptimizationLab() {
  const { result, income, expenses } = useAnalysis();
  const navigate = useNavigate();
  const [reductions, setReductions] = useState<Record<string, number>>({});

  const categories = useMemo(() => Object.entries(expenses), [expenses]);

  const projections = useMemo(() => {
    if (!result || Object.keys(expenses).length === 0) return null;

    let newTotalExpense = 0;
    for (const [cat, amount] of categories) {
      const reduction = reductions[cat] || 0;
      newTotalExpense += amount * (1 - reduction / 100);
    }

    const newSavings = income - newTotalExpense;
    const newSavingsRatio = income > 0 ? newSavings / income : 0;
    const expenseRatio = income > 0 ? newTotalExpense / income : 1;
    const newRisk = Math.round(Math.min(100, Math.max(0, expenseRatio * 100)));

    return {
      totalExpense: newTotalExpense,
      savings: newSavings,
      savingsRatio: newSavingsRatio,
      riskScore: newRisk,
      savedAmount: result.total_expense - newTotalExpense,
      riskImprovement: result.risk_score - newRisk,
    };
  }, [result, income, expenses, categories, reductions]);

  if (!result || Object.keys(expenses).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-10 rounded-2xl max-w-md">
          <FlaskConical className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">Optimization Lab</h2>
          <p className="text-muted-foreground text-sm mb-5">Run an analysis first to simulate optimizations.</p>
          <button onClick={() => navigate("/add-transaction")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Add Transactions <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const riskColor = (s: number) => s < 30 ? "risk-low" : s <= 60 ? "risk-medium" : "risk-high";

  return (
    <div>
      <h1 className="text-xl font-bold heading mb-0.5">Optimization Lab</h1>
      <p className="text-muted-foreground text-xs mb-8">Simulate spending changes and see projected improvements.</p>

      {/* Section 1: What-If Sliders + Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 section-gap">
        <div className="lg:col-span-2 glass-card p-5 rounded-xl">
          <h2 className="text-sm font-bold heading mb-1">What-If Analysis</h2>
          <p className="text-[10px] text-muted-foreground mb-5">Reduce spending per category to see impact.</p>

          <div className="space-y-4">
            {categories.map(([cat, amount]) => {
              const reduction = reductions[cat] || 0;
              const saved = amount * (reduction / 100);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground capitalize">{cat}</span>
                    <div className="text-right">
                      <span className="text-xs font-mono text-muted-foreground">₹ {(amount - saved).toLocaleString("en-IN")}</span>
                      {saved > 0 && <span className="text-[10px] risk-low ml-1.5">-₹ {saved.toLocaleString("en-IN")}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Slider value={[reduction]} onValueChange={([val]) => setReductions((prev) => ({ ...prev, [cat]: val }))} max={100} step={5} className="flex-1" />
                    <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{reduction}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Results */}
        {projections && (
          <div className="space-y-3">
            <div className="glass-card p-4 rounded-xl text-center">
              <PiggyBank className="h-5 w-5 text-primary mx-auto mb-1.5" />
              <p className="text-[10px] text-muted-foreground">Projected Savings</p>
              <p className="text-xl font-bold font-mono heading">₹ {projections.savings.toLocaleString("en-IN")}</p>
              {projections.savedAmount > 0 && <p className="text-[10px] risk-low">+₹ {projections.savedAmount.toLocaleString("en-IN")}</p>}
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <ShieldCheck className="h-5 w-5 text-primary mx-auto mb-1.5" />
              <p className="text-[10px] text-muted-foreground">Projected Risk</p>
              <p className={`text-xl font-bold font-mono ${riskColor(projections.riskScore)}`}>{projections.riskScore}</p>
              {projections.riskImprovement > 0 && <p className="text-[10px] risk-low">-{projections.riskImprovement} pts</p>}
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1.5" />
              <p className="text-[10px] text-muted-foreground">Savings Ratio</p>
              <p className="text-xl font-bold font-mono heading">{(projections.savingsRatio * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

       <div className="section-divider" />
      {/* Section 2: Comparison Table */}
      {projections && (
        <div className="glass-card p-5 rounded-xl">
          <p className="text-xs font-medium text-muted-foreground mb-3">Current vs Projected</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-[11px] font-medium text-muted-foreground">Metric</th>
                  <th className="text-right py-2 text-[11px] font-medium text-muted-foreground">Current</th>
                  <th className="text-right py-2 text-[11px] font-medium text-muted-foreground">Projected</th>
                  <th className="text-right py-2 text-[11px] font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 text-xs text-foreground">Total Expenses</td>
                  <td className="py-2.5 text-right font-mono text-xs text-muted-foreground">₹ {result.total_expense.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 text-right font-mono text-xs text-foreground">₹ {projections.totalExpense.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 text-right font-mono text-xs risk-low">
                    {projections.savedAmount > 0 ? `-₹ ${projections.savedAmount.toLocaleString("en-IN")}` : "—"}
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 text-xs text-foreground">Savings</td>
                  <td className="py-2.5 text-right font-mono text-xs text-muted-foreground">₹ {result.savings.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 text-right font-mono text-xs text-foreground">₹ {projections.savings.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 text-right font-mono text-xs risk-low">
                    {projections.savedAmount > 0 ? `+₹ ${projections.savedAmount.toLocaleString("en-IN")}` : "—"}
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 text-xs text-foreground">Savings Ratio</td>
                  <td className="py-2.5 text-right font-mono text-xs text-muted-foreground">{(result.savings_ratio * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-right font-mono text-xs text-foreground">{(projections.savingsRatio * 100).toFixed(1)}%</td>
                  <td className="py-2.5 text-right font-mono text-xs risk-low">
                    {projections.savingsRatio > result.savings_ratio ? `+${((projections.savingsRatio - result.savings_ratio) * 100).toFixed(1)}%` : "—"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-xs text-foreground">Risk Score</td>
                  <td className={`py-2.5 text-right font-mono text-xs ${riskColor(result.risk_score)}`}>{result.risk_score}</td>
                  <td className={`py-2.5 text-right font-mono text-xs ${riskColor(projections.riskScore)}`}>{projections.riskScore}</td>
                  <td className="py-2.5 text-right font-mono text-xs risk-low">
                    {projections.riskImprovement > 0 ? `-${projections.riskImprovement} pts` : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
