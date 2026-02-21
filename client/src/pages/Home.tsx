import AppShell from "@/components/AppShell";
import AnimatedPage from "@/components/AnimatedPage";
import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import HighlightsBanner from "@/components/HighlightsBanner";
import StatPills from "@/components/StatPills";
import { useProducts } from "@/hooks/use-products";
import { useSiteSettings } from "@/hooks/use-site";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Gauge, PhoneCall } from "lucide-react";

export default function Home() {
  const { data: settings } = useSiteSettings();
  const brand = settings?.brandName || "Caucasus Impex";
  const heroImageUrl = settings?.heroImageUrl;

  const { data: products, isLoading, error } = useProducts({ limit: 12 });

  const whatsapp = settings?.whatsappUrl || "https://wa.me/";

  return (
    <AppShell>
      <Seo
        title={`${brand} — Drive Excellence`}
        description="Luxury automotive inventory: highlights, latest arrivals, and instant availability checks."
      />
      <AnimatedPage>
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background/30 to-background/10 shadow-[var(--shadow-lg)]">
          <div className="absolute inset-0">
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt="Hero"
                className="h-full w-full object-cover opacity-[0.35]"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            <SectionHeader
              eyebrow="Luxury automotive • Inventory"
              title="Drive Excellence"
              description="A premium, dark-luxe inventory experience — built for quick decisions and instant reservations."
              testId="home-hero-title"
              right={
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/inventory"
                    data-testid="home-cta-inventory"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
                      "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                      "hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0",
                      "transition-all duration-200 btn-lux",
                    )}
                  >
                    Explore inventory
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="home-cta-whatsapp"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
                      "border border-border/70 bg-background/30 text-foreground",
                      "hover:bg-background/50 hover:border-primary/25 hover:shadow-[var(--shadow-sm)]",
                      "transition-all duration-200",
                    )}
                  >
                    <PhoneCall className="h-4 w-4 text-primary" />
                    WhatsApp
                  </a>
                </div>
              }
            />

            <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <StatPills />
              <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
                <Gauge className="h-4 w-4 text-primary" />
                Smooth browsing • Fast actions • Premium detail
              </div>
            </div>
          </div>
        </div>

        <HighlightsBanner />

        {/* Latest Arrivals */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-muted-foreground" data-testid="latest-arrivals-label">
                Latest arrivals
              </div>
              <div className="mt-1 text-2xl sm:text-3xl font-bold">Fresh inventory, first look</div>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Scroll through the newest listings — hover for depth, open for specs and availability.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/inventory"
                data-testid="home-view-all"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold",
                  "border border-border/70 bg-background/30 hover:bg-background/50 hover:border-primary/25",
                  "transition-all duration-200 hover:shadow-[var(--shadow-sm)]",
                )}
              >
                View all
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                data-testid="home-back-to-top"
                className="rounded-2xl border-border/70 bg-background/25 hover:bg-background/45"
              >
                Top
              </Button>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-border/60 bg-background/20 overflow-hidden">
            <ScrollArea className="h-[720px]" data-testid="latest-arrivals-scroll">
              <div className="p-4 sm:p-5">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-3xl border border-border/60 bg-background/20 p-4"
                      >
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="mt-2 h-3 w-1/2" />
                        <Skeleton className="mt-4 h-44 w-full rounded-2xl" />
                        <div className="mt-4 flex items-center justify-between">
                          <Skeleton className="h-10 w-28 rounded-2xl" />
                          <Skeleton className="h-10 w-24 rounded-2xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
                    Failed to load products.
                  </div>
                ) : (products?.length ?? 0) === 0 ? (
                  <div className="rounded-2xl border border-border/60 bg-background/20 p-10 text-center">
                    <div className="text-xl font-bold" data-testid="latest-empty-title">
                      No arrivals yet
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try visiting Inventory and hitting Refresh.
                    </p>
                    <div className="mt-5 flex justify-center">
                      <Link
                        href="/inventory"
                        data-testid="latest-empty-inventory"
                        className={cn(
                          "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
                          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5",
                          "transition-all duration-200 btn-lux",
                        )}
                      >
                        Open Inventory
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(products ?? []).map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </AnimatedPage>
    </AppShell>
  );
}
