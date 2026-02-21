import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import AnimatedPage from "@/components/AnimatedPage";
import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/ProductCard";
import RefreshProductsDialog from "@/components/RefreshProductsDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site";
import { Helmet } from "react-helmet-async";

const limits = [6, 12, 18, 24, 36, 50];

export default function Inventory() {
  const { data: settings } = useSiteSettings();
  const brand = settings?.brandName || "Caucasus Impex";

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState<number>(12);

  const queryInput = useMemo(() => {
    const s = search.trim();
    return { limit, ...(s ? { search: s } : {}) };
  }, [search, limit]);

  const { data, isLoading, error, refetch, isFetching } = useProducts(queryInput);

  const clear = () => setSearch("");

  return (
    <AppShell>
      <Helmet>
        <title>{`${brand} — Inventory`}</title>
        <meta name="description" content="Browse premium vehicles available at Caucasus Impex. Transparent pricing and verified listings." />
      </Helmet>

      <AnimatedPage>
        <SectionHeader
          eyebrow="Inventory"
          title="Browse the collection"
          description="Search by title, adjust results limit, and pull fresh listings from the marketplace."
          testId="inventory-title"
          right={
            <div className="flex flex-col sm:flex-row gap-2">
              <RefreshProductsDialog defaultLimit={limit} triggerVariant="default" />
              <Button
                type="button"
                variant="outline"
                onClick={() => refetch()}
                data-testid="inventory-refetch"
                className="rounded-2xl border-border/70 bg-background/30 hover:bg-background/50 hover:border-primary/25 transition-all duration-200"
              >
                {isFetching ? "Refreshing view…" : "Reload"}
              </Button>
            </div>
          }
        />

        <Card className="mt-6 rounded-3xl border border-border/60 bg-background/20 shadow-[var(--shadow-sm)]">
          <div className="p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title…"
                  type="search"
                  data-testid="inventory-search"
                  className={cn(
                    "pl-11 pr-11 rounded-2xl bg-background/30 border-2 border-border/70",
                    "focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200",
                  )}
                />
                {search.trim() ? (
                  <button
                    type="button"
                    onClick={clear}
                    data-testid="inventory-search-clear"
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-xl",
                      "text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all duration-200",
                    )}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-full border border-border/60 bg-background/25"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    Limit
                  </span>
                </Badge>

                <div className="flex flex-wrap gap-2">
                  {limits.map((l) => {
                    const active = l === limit;
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLimit(l)}
                        data-testid={`inventory-limit-${l}`}
                        className={cn(
                          "px-3 py-2 rounded-2xl text-xs font-semibold border transition-all duration-200",
                          active
                            ? "bg-primary text-primary-foreground border-primary/50 shadow-lg shadow-primary/20"
                            : "bg-background/25 text-muted-foreground border-border/60 hover:bg-background/45 hover:text-foreground hover:border-primary/20",
                        )}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span data-testid="inventory-results-meta">
                {isLoading ? "Loading…" : `${data?.length ?? 0} results`}
                {search.trim() ? ` for “${search.trim()}”` : ""}
              </span>
              <span>{isFetching ? "Updating…" : "Ready"}</span>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-border/60 bg-background/20 p-4">
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
            <Card className="rounded-3xl border border-destructive/40 bg-destructive/10 p-6">
              <div className="text-xl font-bold">Couldn’t load inventory</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Try reloading the page or using Refresh.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  onClick={() => refetch()}
                  data-testid="inventory-error-retry"
                  className="rounded-2xl bg-primary text-primary-foreground"
                >
                  Retry
                </Button>
                <RefreshProductsDialog defaultLimit={limit} triggerVariant="outline" />
              </div>
            </Card>
          ) : (data?.length ?? 0) === 0 ? (
            <Card className="rounded-3xl border border-border/60 bg-background/20 p-10 text-center">
              <div className="text-xl font-bold" data-testid="inventory-empty-title">
                No matches found
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Adjust your search or increase the limit. You can also refresh to pull new listings.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setLimit(12);
                  }}
                  data-testid="inventory-empty-reset"
                  className="rounded-2xl border-border/70 bg-background/25 hover:bg-background/45"
                >
                  Reset filters
                </Button>
                <RefreshProductsDialog defaultLimit={limit} triggerVariant="default" />
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" data-testid="inventory-grid">
              {(data ?? []).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </AnimatedPage>
    </AppShell>
  );
}
