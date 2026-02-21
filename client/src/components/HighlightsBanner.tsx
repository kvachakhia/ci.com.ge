import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useHighlights } from "@/hooks/use-highlights";
import { Sparkle, BadgeCheck, Zap } from "lucide-react";

const iconByIndex = [Sparkle, BadgeCheck, Zap];

export default function HighlightsBanner() {
  const { data, isLoading, error } = useHighlights();

  return (
    <Card className={cn("mt-8 overflow-hidden border border-border/60 bg-gradient-to-br from-background/30 to-background/10 shadow-[var(--shadow-md)]")}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-muted-foreground" data-testid="highlights-title">
              Highlights
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-bold">Precision-picked for a premium drive</div>
          </div>
          <div className="hidden sm:block text-xs text-muted-foreground">
            Updated in real-time
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-background/25 p-4"
              >
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-5/6" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              Failed to load highlights.
            </div>
          ) : (data ?? []).slice(0, 3).map((h, idx) => {
            const Icon = iconByIndex[idx % iconByIndex.length];
            return (
              <div
                key={h.id}
                className={cn(
                  "group rounded-2xl border border-border/60 bg-background/25 p-4 transition-all duration-300",
                  "hover:shadow-[var(--shadow-sm)] hover:border-primary/30 hover:bg-background/35",
                )}
                data-testid={`highlight-${h.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl border border-primary/25 bg-primary/10 grid place-items-center shadow-[var(--shadow-xs)]">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{h.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {h.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
