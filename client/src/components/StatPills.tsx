import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flame, ShieldCheck, Timer } from "lucide-react";

export default function StatPills() {
  const items = [
    { icon: <Flame className="h-3.5 w-3.5" />, label: "Latest arrivals", tone: "text-primary" },
    { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: "Verified listings", tone: "text-foreground" },
    { icon: <Timer className="h-3.5 w-3.5" />, label: "Fast availability", tone: "text-foreground" },
  ];

  return (
    <div className="flex flex-wrap gap-2" data-testid="stat-pills">
      {items.map((it) => (
        <Badge
          key={it.label}
          variant="secondary"
          className={cn(
            "rounded-full border border-border/60 bg-background/30 px-3 py-1.5",
            "hover-elevate transition-all duration-200",
          )}
        >
          <span className={cn("inline-flex items-center gap-2 text-xs font-semibold", it.tone)}>
            {it.icon}
            {it.label}
          </span>
        </Badge>
      ))}
    </div>
  );
}
