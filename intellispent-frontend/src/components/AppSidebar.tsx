import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Brain,
  ShieldAlert,
  FlaskConical,
  Zap,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Add Transactions", url: "/add-transaction", icon: PlusCircle },
  { title: "Spending Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Behavior Profile", url: "/behavior", icon: Brain },
  { title: "Risk & Stability", url: "/risk", icon: ShieldAlert },
  { title: "Optimization Lab", url: "/optimization", icon: FlaskConical },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-sidebar-border bg-sidebar flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-sidebar-border">
        <Zap className="h-5 w-5 text-primary" />
        <div>
          <span className="text-sm font-bold text-foreground tracking-tight">
            Intelli<span className="gradient-text">Spend</span>
          </span>
          <p className="text-[9px] text-muted-foreground leading-none mt-0.5">Personal Financial Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              activeClassName=""
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-sidebar-border">
        <p className="text-[9px] text-muted-foreground text-center">Powered by AI Analysis Engine</p>
      </div>
    </aside>
  );
}
