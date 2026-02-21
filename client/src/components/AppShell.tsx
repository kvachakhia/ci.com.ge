import { Link, useLocation } from "wouter";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGrid, Sparkles, Warehouse, ChevronLeft } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site";

function NavItem({
  href,
  icon,
  label,
  badge,
  testId,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  testId: string;
}) {
  const [loc] = useLocation();
  const active = loc === href;

  return (
    <Link
      href={href}
      data-testid={testId}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
        "hover-elevate hover:text-foreground",
        active
          ? "bg-sidebar-accent text-sidebar-foreground ring-1 ring-primary/25 shadow-[var(--shadow-sm)]"
          : "text-muted-foreground hover:bg-sidebar-accent/60",
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-xl border border-border/60 bg-background/40 transition-all duration-200",
          active
            ? "border-primary/40 bg-primary/10 text-primary"
            : "group-hover:border-primary/25 group-hover:bg-primary/5 group-hover:text-primary",
        )}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
      {badge ? (
        <Badge
          variant="secondary"
          className={cn(
            "ml-auto border border-border/60 bg-background/30 text-muted-foreground",
            active && "text-foreground",
          )}
        >
          {badge}
        </Badge>
      ) : null}
      <span
        className={cn(
          "pointer-events-none absolute inset-y-2 right-2 w-1 rounded-full bg-primary transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        )}
      />
    </Link>
  );
}

export default function AppShell({ children }: PropsWithChildren) {
  const { data: settings } = useSiteSettings();
  const brand = settings?.brandName || "Caucasus Impex";

  const [collapsed, setCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const subtitle = useMemo(() => "Luxury Inventory Console", []);

  return (
    <div ref={containerRef} className="min-h-screen lux-bg lux-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <aside
            className={cn(
              "glass rounded-3xl overflow-hidden",
              "border border-sidebar-border/70",
              "lg:sticky lg:top-6 lg:self-start",
            )}
          >
            <div className="relative p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/25 via-primary/10 to-transparent border border-primary/25 shadow-[var(--shadow-sm)] grid place-items-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-lg sm:text-xl font-bold leading-tight truncate"
                    data-testid="brand-name"
                  >
                    {brand}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
                </div>

                <div className="ml-auto hidden lg:flex">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="sidebar-collapse"
                    onClick={() => setCollapsed((v) => !v)}
                    className={cn(
                      "rounded-xl border-border/70 bg-background/40 hover:bg-background/60 hover:text-foreground transition-all",
                      "hover:shadow-[var(--shadow-sm)]",
                    )}
                  >
                    <ChevronLeft
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        collapsed ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </Button>
                </div>
              </div>

              <div className="mt-5">
                <div className="rounded-2xl border border-border/60 bg-background/30 p-4">
                  <div className="text-sm font-semibold">Drive Excellence</div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Curated arrivals, transparent pricing, instant availability checks.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-border/70" />

            <ScrollArea className={cn("h-[320px] lg:h-[460px]", collapsed && "lg:h-[220px]")}>
              <div className="p-4 space-y-2">
                <NavItem
                  href="/"
                  icon={<LayoutGrid className="h-4 w-4" />}
                  label="Home"
                  testId="nav-home"
                />
                <NavItem
                  href="/inventory"
                  icon={<Warehouse className="h-4 w-4" />}
                  label="Inventory"
                  badge="Live"
                  testId="nav-inventory"
                />
              </div>

              <div className="px-4 pb-4">
                <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background/40 to-background/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-muted-foreground">Status</div>
                    <span className="inline-flex items-center gap-2 text-xs">
                      <span className="h-2 w-2 rounded-full bg-status-online" />
                      <span className="text-muted-foreground">Ready</span>
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    Use <span className="text-foreground font-semibold">Refresh</span> on Inventory to pull the latest
                    arrivals from the marketplace.
                  </div>
                </div>
              </div>
            </ScrollArea>
          </aside>

          {/* Main */}
          <main className="min-w-0">
            <div className="glass rounded-3xl border border-border/60 p-4 sm:p-6 lg:p-8 shadow-[var(--shadow-lg)]">
              {children}
            </div>
            <footer className="mt-6 px-2 text-xs text-muted-foreground">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>© {new Date().getFullYear()} {brand}. Crafted for speed & clarity.</span>
                <span className="text-muted-foreground/80">
                  Tip: Hover cards for specs • Use search for quick filtering
                </span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
