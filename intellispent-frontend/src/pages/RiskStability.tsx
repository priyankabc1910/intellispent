import { useAnalysis } from "@/context/AnalysisContext";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRight, Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";

function CircularGauge({ score }: { score: number }) {
  const radius = 65;
  const stroke = 11;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(score, 100) / 100) * circumference;
  const color = score < 30 ? "hsl(152 45% 42%)" : score <= 60 ? "hsl(38 60% 48%)" : "hsl(0 50% 52%)";

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="donut-gauge w-full h-full" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={radius} fill="none" stroke="hsl(220 12% 17%)" strokeWidth={stroke} />
        <circle cx="75" cy="75" r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono" style={{ color }}>{score}</span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export default function RiskStability() {
  const { result, income } = useAnalysis();
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-10 rounded-2xl max-w-md">
          <ShieldAlert className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">Risk & Stability</h2>
          <p className="text-muted-foreground text-sm mb-5">Run an analysis to see your risk assessment.</p>
          <button onClick={() => navigate("/add-transaction")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Add Transactions <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const score = result.risk_score;
  const tier = score < 30 ? "Low" : score <= 60 ? "Moderate" : "High";
  const tierColor = score < 30 ? "risk-low" : score <= 60 ? "risk-medium" : "risk-high";
  const tierBg = score < 30 ? "risk-bg-low" : score <= 60 ? "risk-bg-medium" : "risk-bg-high";
  const TierIcon = score < 30 ? CheckCircle : score <= 60 ? AlertTriangle : ShieldAlert;

  const savingsBuffer = income > 0 ? (result.savings / income) * 100 : 0;
  const bufferLabel = savingsBuffer >= 20 ? "Healthy" : savingsBuffer >= 10 ? "Adequate" : savingsBuffer > 0 ? "Thin" : "None";

  const breakdowns = [
    { label: "Expense-to-Income Ratio", value: `${((result.total_expense / income) * 100).toFixed(1)}%`, risk: result.total_expense / income > 0.8 },
    { label: "Savings Ratio", value: `${(result.savings_ratio * 100).toFixed(1)}%`, risk: result.savings_ratio < 0.1 },
    { label: "Savings Buffer", value: `${savingsBuffer.toFixed(1)}%`, risk: savingsBuffer < 10 },
    { label: "Overall Stability", value: tier, risk: score > 60 },
  ];

  const riskExplanation = score < 30
    ? "Your finances are stable with a healthy savings buffer. You're well-prepared for unexpected expenses and on track for long-term financial goals."
    : score <= 60
    ? "Your financial position is moderate. While not in immediate danger, increasing your savings ratio would provide better protection against income disruptions."
    : "Your finances are at high risk. Expenses consume most of your income, leaving little room for emergencies. Immediate spending reduction is recommended.";

  return (
    <div>
      <h1 className="text-xl font-bold heading mb-0.5">Risk & Stability</h1>
      <p className="text-muted-foreground text-xs mb-8">Comprehensive risk assessment.</p>

      {/* Section 1: Gauge + Tier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 section-gap">
        <div className="glass-card p-5 rounded-xl flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-muted-foreground mb-3">Risk Score</p>
          <CircularGauge score={score} />
        </div>
        <div className={`glass-card p-5 rounded-xl border ${tierBg} flex flex-col items-center justify-center`}>
          <TierIcon className={`h-10 w-10 ${tierColor} mb-2`} />
          <p className="text-xs font-medium text-muted-foreground mb-1">Stability Tier</p>
          <p className={`text-2xl font-bold ${tierColor}`}>{tier} Risk</p>
        </div>
      </div>

       <div className="section-divider" />
      {/* Section 2: Buffer + Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 section-gap">
        <div className="glass-card p-5 rounded-xl flex flex-col items-center justify-center">
          <Shield className="h-8 w-8 text-primary mb-2" />
          <p className="text-xs font-medium text-muted-foreground mb-1">Savings Buffer</p>
          <p className="text-3xl font-bold font-mono heading">{savingsBuffer.toFixed(1)}%</p>
          <span className="text-[10px] text-muted-foreground">{bufferLabel}</span>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <p className="text-xs font-medium text-muted-foreground mb-3">Risk Breakdown</p>
          <div className="space-y-2">
            {breakdowns.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/60">
                <span className="text-[11px] text-muted-foreground">{item.label}</span>
                <span className={`text-xs font-bold font-mono ${item.risk ? "risk-high" : "risk-low"}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

       <div className="section-divider" />
      {/* Section 3: Explanation */}
      <div className="glass-card p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">Financial Position</p>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{riskExplanation}</p>
      </div>
    </div>
  );
}
