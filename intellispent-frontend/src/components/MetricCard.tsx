import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantBorder = {
  default: "",
  success: "risk-bg-low border",
  warning: "risk-bg-medium border",
  danger: "risk-bg-high border",
};

const valueColor = {
  default: "text-foreground",
  success: "risk-low",
  warning: "risk-medium",
  danger: "risk-high",
};

export function MetricCard({ title, value, subtitle, icon, variant = "default" }: MetricCardProps) {
  return (
    <div className={`glass-card p-5 rounded-xl ${variantBorder[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className={`text-2xl font-bold font-mono tracking-tight ${valueColor[variant]}`}>{value}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
