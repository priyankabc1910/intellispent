import { useAnalysis } from "@/context/AnalysisContext";
import { MetricCard } from "@/components/MetricCard";
import { DollarSign, TrendingDown, PiggyBank, Percent, User, ArrowRight, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DonutRiskGauge({ score }: { score: number }) {
  const radius = 60;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(score, 100) / 100) * circumference;
  const color = score < 30 ? "hsl(152 45% 42%)" : score <= 60 ? "hsl(38 60% 48%)" : "hsl(0 50% 52%)";
  const label = score < 30 ? "Low Risk" : score <= 60 ? "Moderate" : "High Risk";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="donut-gauge w-full h-full" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="hsl(220 12% 17%)" strokeWidth={stroke} />
          <circle cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={circumference - progress}
            strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono" style={{ color }}>{score}</span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ color, backgroundColor: `${color}15` }}>
        {label}
      </span>
    </div>
  );
}

export default function Overview() {
const { result, income, expenses } = useAnalysis();
  const navigate = useNavigate();

  // Spending Concentration Index
  const categories = Object.entries(expenses).sort(([, a], [, b]) => b - a);
  const totalExp = categories.reduce((s, [, v]) => s + v, 0);
  const top1Pct = totalExp > 0 ? (categories[0]?.[1] ?? 0) / totalExp * 100 : 0;
  const top2Pct = totalExp > 0 ? ((categories[0]?.[1] ?? 0) + (categories[1]?.[1] ?? 0)) / totalExp * 100 : 0;
  const concentrationScore = Math.round(top2Pct);
  const concentrationLabel = concentrationScore > 70 ? "High" : concentrationScore > 40 ? "Moderate" : "Low";
  const concentrationColor = concentrationScore > 70 ? "hsl(0 50% 52%)" : concentrationScore > 40 ? "hsl(38 60% 48%)" : "hsl(152 45% 42%)";
  const concentrationInsight = concentrationScore > 70
    ? "High spending concentration detected. Financial flexibility may be limited. Consider diversifying expenses."
    : concentrationScore > 40
    ? "Moderate concentration. Your spending is somewhat balanced, but top categories still dominate."
    : "Low concentration. Your spending is well-distributed across categories — good financial balance.";

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-10 rounded-2xl max-w-md">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">No Analysis Yet</h2>
          <p className="text-muted-foreground text-sm mb-5">Add your income and expenses to get started.</p>
          <button onClick={() => navigate("/add-transaction")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Get Started <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const savingsRatioPct = (result.savings_ratio * 100).toFixed(1);

  return (
    <div>
      <h1 className="text-xl font-bold heading mb-0.5">Overview</h1>
      <p className="text-muted-foreground text-xs mb-8">Your financial health at a glance.</p>

      {/* Section 1: Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 section-gap">
        <MetricCard title="Monthly Income" value={`₹ ${income.toLocaleString("en-IN")}`} icon={<DollarSign className="h-4 w-4" />} />
        <MetricCard title="Total Expense" value={`₹ ${result.total_expense.toLocaleString("en-IN")}`} icon={<TrendingDown className="h-4 w-4" />} variant="warning" />
        <MetricCard title="Savings" value={`₹ ${result.savings.toLocaleString("en-IN")}`} icon={<PiggyBank className="h-4 w-4" />} variant={result.savings >= 0 ? "success" : "danger"} />
      </div>

      <div className="section-divider" />
      {/* Section 2: Risk + Profile + Ratio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 section-gap">
        <div className="glass-card p-5 rounded-xl flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-muted-foreground mb-3">Risk Score</p>
          <DonutRiskGauge score={result.risk_score} />
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground">Savings Ratio</p>
          </div>
          <p className="text-3xl font-bold font-mono heading">{savingsRatioPct}%</p>
          <p className="text-[11px] text-muted-foreground mt-1">of total income saved</p>

          <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(parseFloat(savingsRatioPct), 100)}%` }} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground">Financial Profile</p>
          </div>
          <p className="text-lg font-bold heading">{result.profile}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Based on spending behavior</p>
        </div>
      </div>

      <div className="section-divider" />
      {/* Section 3: Spending Concentration + Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground">Spending Concentration Analysis</p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground">Top Category</span>
              <span className="text-sm font-bold font-mono text-foreground">
                {categories[0]?.[0] ?? "—"} ({top1Pct.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground">Top 2 Combined</span>
              <span className="text-sm font-bold font-mono text-foreground">{top2Pct.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground">Concentration Score</span>
              <span className="text-sm font-bold font-mono" style={{ color: concentrationColor }}>{concentrationScore}/100</span>
            </div>
          </div>

          <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(concentrationScore, 100)}%`, backgroundColor: concentrationColor }} />
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: concentrationColor, backgroundColor: `${concentrationColor}15` }}>
            {concentrationLabel} Concentration
          </span>

          <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">{concentrationInsight}</p>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <p className="text-xs font-medium text-muted-foreground mb-3">Summary Insight</p>
          <p className="text-sm text-foreground leading-relaxed">
            {result.savings >= 0
              ? `You're saving ₹ ${result.savings.toLocaleString("en-IN")} per month (${savingsRatioPct}% of income). Your financial profile is "${result.profile}" with a risk score of ${result.risk_score}/100. ${result.risk_score < 30 ? "Your finances are in excellent shape." : result.risk_score <= 60 ? "There's room for improvement in your spending habits." : "Consider reducing expenses to improve financial stability."}`
              : `You're spending ₹ ${Math.abs(result.savings).toLocaleString("en-IN")} more than you earn. Immediate budget adjustment is recommended to avoid financial stress.`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
