import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import AppShell from "@/components/AppShell";
import AnimatedPage from "@/components/AnimatedPage";
import Seo from "@/components/Seo";
import { useProduct } from "@/hooks/use-products";
import { useVehicleAvailability } from "@/hooks/use-vehicle";
import { useSiteSettings } from "@/hooks/use-site";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import PriceTag, { formatMoney } from "@/components/PriceTag";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck, Sparkles, X, ZoomIn } from "lucide-react";
import { Helmet } from "react-helmet-async";

function safeEntries(vehicle: unknown): Array<[string, string]> {
  if (!vehicle || typeof vehicle !== "object") return [];
  const v = vehicle as Record<string, unknown>;
  const keys = Object.keys(v).slice(0, 20);
  return keys
    .map((k) => {
      const val = v[k];
      if (val === null || val === undefined) return null;
      if (typeof val === "object") return null;
      return [k, String(val)] as [string, string];
    })
    .filter(Boolean) as Array<[string, string]>;
}

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsZoomOpen(false);
  }, [id]);

  useEffect(() => {
    if (!isZoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isZoomOpen]);

  const { data: settings } = useSiteSettings();
  const brand = settings?.brandName || "Caucasus Impex";
  const whatsapp = settings?.whatsappUrl || "https://wa.me/";

  const productQuery = useProduct(id);
  const availabilityQuery = useVehicleAvailability(id);

  const title = productQuery.data?.title ?? "Vehicle";
  const desc = useMemo(() => {
    const price = productQuery.data ? formatMoney(productQuery.data.price ?? 0, productQuery.data.currencyCode ?? "usd") : "";
    return `Details, specs, and instant availability for ${title}${price ? ` (${price})` : ""}.`;
  }, [productQuery.data, title]);

  const reserveLink = useMemo(() => {
    const p = productQuery.data;
    if (!p) return whatsapp;
    const msg = encodeURIComponent(`Hi! I'm interested in: ${p.title} (ID: ${p.id}). Please confirm availability.`);
    // If whatsappUrl already includes query, keep simple.
    if (whatsapp.includes("wa.me") || whatsapp.includes("whatsapp")) {
      return whatsapp.includes("?") ? `${whatsapp}&text=${msg}` : `${whatsapp}?text=${msg}`;
    }
    return whatsapp;
  }, [productQuery.data, whatsapp]);

  const product = productQuery.data;

  const price = product?.price;
  const currency = product?.currencyCode;

  const vehicle = product?.vehicle;

  const make = vehicle?.make;
  const model = vehicle?.model;
  const year = vehicle?.year;
  const trim = vehicle?.trim;
  const location = vehicle?.location;
  const engine = vehicle?.engine;

  // Debug: Log product data
  useMemo(() => {
    if (product) {
      console.log("Product data loaded:", {
        id: product.id,
        title: product.title,
        price: product.price,
        vehicle: product.vehicle,
      });
    }
  }, [product]);

  return (
    <AppShell>

      {(() => {
        const headline = [year, make, model].filter(Boolean).join(" ").trim()
          || product?.title
          || "Vehicle";
        const pageTitle = `${headline} for Sale | ${brand}`;
        const descParts = [headline, trim, location && `available in ${location}`].filter(Boolean).join(" ");
        const description = descParts
          ? `${descParts}. Premium listing from ${brand}.`
          : `Premium listing from ${brand}.`;

        return (
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={pageTitle} />
            <meta
              property="og:description"
              content={`${brand} — ${headline}. Premium listing with verified availability.`}
            />
            <meta property="og:type" content="product" />
            {product && (
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Product",
                  name: headline,
                  brand: make || brand,
                  offers: {
                    "@type": "Offer",
                    priceCurrency: (currency || "usd").toUpperCase(),
                    price: price || "0",
                    availability: "https://schema.org/InStock",
                  },
                })}
              </script>
            )}
          </Helmet>
        );
      })()}





      <AnimatedPage>
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/inventory"
            data-testid="product-back"
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold",
              "border border-border/70 bg-background/25 hover:bg-background/45 hover:border-primary/25",
              "transition-all duration-200 hover:shadow-[var(--shadow-sm)]",
            )}
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
            Back to Inventory
          </Link>

          <Badge
            variant="secondary"
            className="rounded-full border border-border/60 bg-background/25 text-muted-foreground"
            data-testid="product-id"
          >
            ID: {id}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* Media + title */}
          <Card className="rounded-3xl border border-border/60 bg-background/20 overflow-hidden shadow-[var(--shadow-md)]">
            <div className="p-5 sm:p-6">
              {productQuery.isLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-1/2" />
                </>
              ) : productQuery.error ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
                  Failed to load product.
                </div>
              ) : product ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight" data-testid="product-title">
                        {product.title}
                      </h1>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Curated listing • Premium details • Quick reservation
                      </div>
                    </div>
                    <div className="shrink-0">
                      <PriceTag price={product.price ?? 0} currencyCode={product.currencyCode ?? "usd"} testId="product-price" />
                    </div>
                  </div>

                  {(() => {
                    const gallery = product.images && product.images.length > 0
                      ? product.images
                      : product.thumbnail
                        ? [{ id: "thumb", url: product.thumbnail, rank: 0 }]
                        : [];
                    const safeIndex = Math.min(activeImageIndex, Math.max(gallery.length - 1, 0));
                    const active = gallery[safeIndex];
                    const hasMultiple = gallery.length > 1;
                    return (
                      <div className="mt-5 space-y-3">
                        <div className="relative rounded-3xl border border-border/60 bg-background/20 overflow-hidden">
                          {active ? (
                            <button
                              type="button"
                              onClick={() => setIsZoomOpen(true)}
                              aria-label="Zoom image"
                              className="group relative block w-full cursor-zoom-in"
                              data-testid="product-image-zoom-trigger"
                            >
                              <img
                                src={active.url}
                                alt={`${product.title} — image ${safeIndex + 1}`}
                                className="h-[320px] sm:h-[420px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                data-testid="product-image-main"
                              />
                              <div className="absolute right-3 top-3 grid place-items-center h-9 w-9 rounded-full border border-border/60 bg-background/70 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="h-4 w-4" />
                              </div>
                            </button>
                          ) : (
                            <div className="h-[320px] sm:h-[420px] w-full grid place-items-center text-muted-foreground">
                              <div className="text-sm">No image available</div>
                            </div>
                          )}

                          {hasMultiple && (
                            <>
                              <button
                                type="button"
                                aria-label="Previous image"
                                onClick={() =>
                                  setActiveImageIndex(
                                    (safeIndex - 1 + gallery.length) % gallery.length,
                                  )
                                }
                                className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full border border-border/60 bg-background/70 backdrop-blur hover:bg-background"
                              >
                                <ChevronLeft className="h-5 w-5" />
                              </button>
                              <button
                                type="button"
                                aria-label="Next image"
                                onClick={() =>
                                  setActiveImageIndex((safeIndex + 1) % gallery.length)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full border border-border/60 bg-background/70 backdrop-blur hover:bg-background"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                              <div className="absolute bottom-3 right-3 rounded-full bg-background/70 backdrop-blur px-3 py-1 text-xs font-semibold">
                                {safeIndex + 1} / {gallery.length}
                              </div>
                            </>
                          )}
                        </div>

                        {hasMultiple && (
                          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                            {gallery.map((img, i) => (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => setActiveImageIndex(i)}
                                aria-label={`View image ${i + 1}`}
                                data-testid={`product-image-thumb-${i}`}
                                className={cn(
                                  "shrink-0 rounded-xl overflow-hidden border transition-all",
                                  "h-16 w-24 sm:h-20 sm:w-28",
                                  i === safeIndex
                                    ? "border-primary ring-2 ring-primary/40"
                                    : "border-border/60 hover:border-primary/40",
                                )}
                              >
                                <img
                                  src={img.url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </button>
                            ))}
                          </div>
                        )}

                        {isZoomOpen && active && (
                          <div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Image viewer"
                            onClick={() => setIsZoomOpen(false)}
                            className="fixed inset-0 z-[100] grid place-items-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
                            data-testid="product-image-lightbox"
                          >
                            <button
                              type="button"
                              aria-label="Close"
                              onClick={() => setIsZoomOpen(false)}
                              className="absolute top-4 right-4 grid place-items-center h-10 w-10 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                            >
                              <X className="h-5 w-5" />
                            </button>

                            <img
                              src={active.url}
                              alt={`${product.title} — image ${safeIndex + 1}`}
                              onClick={(e) => e.stopPropagation()}
                              className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl shadow-2xl cursor-zoom-out"
                              data-testid="product-image-lightbox-main"
                            />

                            {hasMultiple && (
                              <>
                                <button
                                  type="button"
                                  aria-label="Previous image"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImageIndex(
                                      (safeIndex - 1 + gallery.length) % gallery.length,
                                    );
                                  }}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center h-12 w-12 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                                >
                                  <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                  type="button"
                                  aria-label="Next image"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImageIndex((safeIndex + 1) % gallery.length);
                                  }}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center h-12 w-12 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                                >
                                  <ChevronRight className="h-6 w-6" />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-4 py-1.5 text-xs font-semibold text-white">
                                  {safeIndex + 1} / {gallery.length}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Verified listing
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        Pricing shown as listed. Confirm exact options via WhatsApp.
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Concierge reservation
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        Tap “Check availability” to reserve instantly.
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-border/60 bg-background/20 p-8 text-center">
                  <div className="text-xl font-bold">Not found</div>
                  <p className="mt-2 text-sm text-muted-foreground">This product doesn’t exist (or was removed).</p>
                </div>
              )}
            </div>
          </Card>

          {/* Actions + details */}
          <div className="space-y-6">
            <Card className="rounded-3xl border border-border/60 bg-background/20 shadow-[var(--shadow-md)]">
              <div className="p-5 sm:p-6">
                <div className="text-sm font-semibold text-muted-foreground">Availability</div>
                <div className="mt-2">
                  {availabilityQuery.isLoading ? (
                    <Skeleton className="h-6 w-2/3" />
                  ) : availabilityQuery.error ? (
                    <div className="text-sm text-muted-foreground">Couldn’t load availability.</div>
                  ) : availabilityQuery.data ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold" data-testid="availability-title">
                          {availabilityQuery.data.title}
                        </div>
                        <Badge
                          className={cn(
                            "rounded-full border",
                            availabilityQuery.data.available
                              ? "bg-status-online/10 text-foreground border-status-online/25"
                              : "bg-status-away/10 text-foreground border-status-away/25",
                          )}
                          data-testid="availability-badge"
                        >
                          {availabilityQuery.data.available ? "Available" : "Check"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid="availability-message">
                        {availabilityQuery.data.message || "Tap below to confirm instantly via WhatsApp."}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No availability data.</div>
                  )}
                </div>

                <Separator className="my-5 bg-border/70" />

                <div className="flex flex-col gap-2">
                  <a
                    href={reserveLink}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="product-cta-whatsapp"
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
                      "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                      "hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0",
                      "transition-all duration-200 btn-lux",
                    )}
                  >
                    Check availability
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(String(id))}
                    data-testid="product-copy-id"
                    className="rounded-2xl border-border/70 bg-background/25 hover:bg-background/45"
                  >
                    Copy ID
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border border-border/60 bg-background/20 shadow-[var(--shadow-md)]">
              <div className="p-5 sm:p-6">
                <div className="text-sm font-semibold text-muted-foreground">Vehicle details</div>

                <div className="mt-3">
                  {productQuery.isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : productQuery.error ? (
                    <div className="text-sm text-muted-foreground">No details.</div>
                  ) : product ? (
                    (() => {
                      const entries = safeEntries(product.vehicle);
                      if (entries.length === 0) {
                        return (
                          <div className="rounded-2xl border border-border/60 bg-background/15 p-4 text-sm text-muted-foreground">
                            No structured vehicle data for this listing.
                          </div>
                        );
                      }
                      return (
                        <div className="rounded-2xl border border-border/60 bg-background/15 overflow-hidden">
                          <div className="divide-y divide-border/60">
                            {entries.map(([k, v]) => (
                              <div key={k} className="flex items-start justify-between gap-4 px-4 py-3">
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  {k.replace(/[_-]/g, " ")}
                                </div>
                                <div className="text-sm font-semibold text-foreground text-right break-words">
                                  {v}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  ) : null}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimatedPage>
    </AppShell>
  );
}
