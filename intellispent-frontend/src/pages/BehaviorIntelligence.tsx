import { useAnalysis } from "@/context/AnalysisContext";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight, Sparkles, Target, TrendingUp, Shield, ThumbsUp, ThumbsDown } from "lucide-react";

const profileData: Record<string, {
  description: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  narrative: string;
}> = {
  "Frugal Saver": {
    description: "Disciplined and methodical financial behavior.",
    traits: ["Disciplined spender", "Long-term planner", "Risk-averse", "Budget-conscious"],
    strengths: ["Strong savings habit", "Financial resilience", "Emergency preparedness"],
    weaknesses: ["May miss experiences", "Under-invests in quality of life"],
    narrative: "You exhibit a frugal spending pattern with strong financial discipline. Your savings-first approach builds long-term wealth, though you may benefit from strategic lifestyle investments that improve wellbeing without compromising stability.",
  },
  "Balanced Spender": {
    description: "A healthy equilibrium between spending and saving.",
    traits: ["Moderate risk-taker", "Lifestyle optimizer", "Adaptable planner", "Value-driven"],
    strengths: ["Sustainable lifestyle", "Good savings ratio", "Flexible budgeting"],
    weaknesses: ["Could save more", "Lacks aggressive goals"],
    narrative: "Your spending profile reflects balance — you maintain a comfortable lifestyle while building savings. This sustainable approach works well for medium-term goals. Consider setting specific savings targets to accelerate wealth building.",
  },
  "High Spender": {
    description: "Experience-driven spending with room for optimization.",
    traits: ["Experience-driven", "Lifestyle focused", "Impulsive tendencies", "Growth-oriented"],
    strengths: ["Rich experiences", "Networking investments", "Quality focus"],
    weaknesses: ["Low savings buffer", "Vulnerable to income shocks", "Debt risk"],
    narrative: "You prioritize experiences and quality, which can enhance life satisfaction but may leave you financially exposed. Building an emergency fund and automating savings could provide security without sacrificing your lifestyle priorities.",
  },
  "Overspender": {
    description: "Expenses consume most or all income.",
    traits: ["Immediate gratification", "Under-budgeted", "High consumption", "Needs structure"],
    strengths: ["Knows what they want", "Action-oriented"],
    weaknesses: ["No savings buffer", "High financial stress", "Debt accumulation", "No emergency fund"],
    narrative: "Your spending exceeds sustainable levels. Without intervention, this pattern leads to financial stress and debt. Start with small, automated savings and track daily expenses. Even saving 5% of income creates momentum toward stability.",
  },
};

export default function BehaviorIntelligence() {
  const { result } = useAnalysis();
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-10 rounded-2xl max-w-md">
          <Brain className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">Behavior Profile</h2>
          <p className="text-muted-foreground text-sm mb-5">Run an analysis to discover your financial personality.</p>
          <button onClick={() => navigate("/add-transaction")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Add Transactions <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const profile = profileData[result.profile] || profileData["Balanced Spender"];

  return (
    <div>
      <h1 className="text-xl font-bold heading mb-0.5">Behavior Profile</h1>
      <p className="text-muted-foreground text-xs mb-8">Understanding your financial personality.</p>

      {/* Section 1: Profile Badge */}
      <div className="glass-card p-6 rounded-xl section-gap text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold heading">{result.profile}</h2>
        <p className="text-xs text-muted-foreground mt-1">{profile.description}</p>
      </div>

       <div className="section-divider" />
      {/* Section 2: Traits + Strengths/Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 section-gap">
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground">Behavioral Traits</p>
          </div>
          <div className="space-y-1.5">
            {profile.traits.map((trait) => (
              <div key={trait} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/60">
                <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">{trait}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Strengths</p>
            </div>
            <div className="space-y-1">
              {profile.strengths.map((s) => (
                <div key={s} className="flex items-center gap-2 text-xs text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Weaknesses</p>
            </div>
            <div className="space-y-1">
              {profile.weaknesses.map((w) => (
                <div key={w} className="flex items-center gap-2 text-xs text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                  {w}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

       <div className="section-divider" />
      {/* Section 3: Narrative */}
      <div className="glass-card p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">Analysis Narrative</p>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{profile.narrative}</p>
      </div>
    </div>
  );
}
