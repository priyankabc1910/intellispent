import { useAnalysis } from "@/context/AnalysisContext";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, ArrowRight, Trophy } from "lucide-react";

const COLORS = [
  "hsl(215, 55%, 52%)", "hsl(152, 45%, 42%)", "hsl(38, 60%, 48%)",
  "hsl(270, 35%, 52%)", "hsl(340, 40%, 48%)", "hsl(190, 50%, 45%)",
  "hsl(60, 45%, 45%)", "hsl(15, 55%, 48%)",
];

const tooltipStyle = {
  background: "hsl(220 16% 10%)", border: "1px solid hsl(220 12% 17%)",
  borderRadius: "6px", color: "hsl(220 10% 85%)", fontSize: 12,
};

export default function SpendingAnalytics() {
  const { expenses, result } = useAnalysis();
  const navigate = useNavigate();

  if (!result || Object.keys(expenses).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card p-10 rounded-2xl max-w-md">
          <BarChart3 className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">No Spending Data</h2>
          <p className="text-muted-foreground text-sm mb-5">Run an analysis first.</p>
          <button onClick={() => navigate("/add-transaction")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Add Transactions <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const total = Object.values(expenses).reduce((a, b) => a + b, 0);
  const data = Object.entries(expenses)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, percent: ((value / total) * 100).toFixed(1) }))
    .sort((a, b) => b.value - a.value);
  const top3 = data.slice(0, 3);

  return (
    <div>
       <h1 className="text-xl font-bold mb-0.5 text-white">Spending Analytics</h1>
      <p className="text-muted-foreground text-xs mb-8">Deep dive into your spending patterns.</p>

      {/* Section 1: Pie Chart */}
      <div className="glass-card p-5 rounded-xl section-gap">
        <p className="text-xs font-medium text-muted-foreground mb-3">Expense Distribution</p>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={220} className="max-w-[280px]">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} strokeWidth={2} stroke="hsl(220 18% 7%)">
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹ ${v.toLocaleString("en-IN")}`, "Amount"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name} ({d.percent}%)
              </div>
            ))}
          </div>
        </div>
      </div>

       <div className="section-divider" />
      {/* Section 2: Bar Chart + Top 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 section-gap">
        <div className="glass-card p-5 rounded-xl">
          <p className="text-xs font-medium text-muted-foreground mb-3">Category Comparison</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: "hsl(220 8% 48%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "hsl(220 10% 85%)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹ ${v.toLocaleString("en-IN")}`, "Amount"]} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Top 3 Expense Drivers</p>
          </div>
          <div className="space-y-2">
            {top3.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/60">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold font-mono text-primary w-5">{i + 1}</span>
                  <span className="text-sm font-medium text-foreground">{d.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-foreground">₹ {d.value.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-muted-foreground ml-1.5">{d.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

       <div className="section-divider" />
      {/* Section 3: Percentage Breakdown Table */}
      <div className="glass-card p-5 rounded-xl">
        <p className="text-xs font-medium text-muted-foreground mb-3">Category Breakdown</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-[11px] font-medium text-muted-foreground">Category</th>
                <th className="text-right py-2 text-[11px] font-medium text-muted-foreground">Amount</th>
                <th className="text-right py-2 text-[11px] font-medium text-muted-foreground">Share</th>
                <th className="text-right py-2 text-[11px] font-medium text-muted-foreground w-28">Bar</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.name} className="border-b border-border/50">
                  <td className="py-2.5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-foreground text-xs">{d.name}</span>
                  </td>
                  <td className="py-2.5 text-right font-mono text-xs text-foreground">₹ {d.value.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 text-right font-mono text-xs text-muted-foreground">{d.percent}%</td>
                  <td className="py-2.5 text-right">
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden inline-block">
                      <div className="h-full rounded-full" style={{ width: `${d.percent}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
