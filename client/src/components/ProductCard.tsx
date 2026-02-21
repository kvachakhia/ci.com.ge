import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import PriceTag from "@/components/PriceTag";
import { ArrowUpRight, Car } from "lucide-react";
import type { Product } from "@shared/schema";

function safeString(v: unknown) {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return "";
}

function getVehicleMeta(vehicle: unknown): { title?: string; subtitle?: string; chips: string[] } {
  if (!vehicle || typeof vehicle !== "object") return { chips: [] };
  const v = vehicle as Record<string, unknown>;

  const make = safeString(v.make) || safeString(v.brand) || safeString(v.manufacturer);
  const model = safeString(v.model) || safeString(v.name);
  const year = safeString(v.year);
  const trim = safeString(v.trim);
  const mileage = safeString(v.mileage);
  const fuel = safeString(v.fuel) || safeString(v.fuelType);
  const transmission = safeString(v.transmission);

  const title = [make, model].filter(Boolean).join(" ");
  const subtitle = [year, trim].filter(Boolean).join(" • ");

  const chips = [fuel && `Fuel: ${fuel}`, transmission && `Trans: ${transmission}`, mileage && `Mileage: ${mileage}`]
    .filter(Boolean)
    .slice(0, 3) as string[];

  return { title: title || undefined, subtitle: subtitle || undefined, chips };
}

export default function ProductCard({ product }: { product: Product }) {
  const meta = getVehicleMeta(product.vehicle);
  const image = product.thumbnail || "";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background/35 to-background/10",
        "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/25",
      )}
      data-testid={`product-card-${product.id}`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-accent/10 blur-2xl" />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold leading-tight line-clamp-2" data-testid={`product-title-${product.id}`}>
              {product.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {meta.title ? meta.title : "Vehicle details available on open"}
              {meta.subtitle ? ` • ${meta.subtitle}` : ""}
            </div>
          </div>

          <div className="shrink-0">
            <Badge
              variant="secondary"
              className="rounded-full border border-border/60 bg-background/30 text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1">
                <Car className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">Arrival</span>
              </span>
            </Badge>
          </div>
        </div>

        <div className="mt-4">
          <div className="rounded-2xl border border-border/60 bg-background/20 overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={product.title}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
            ) : (
              <div className="h-44 w-full grid place-items-center text-muted-foreground">
                <div className="text-xs">No thumbnail</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <PriceTag price={product.price ?? 0} currencyCode={product.currencyCode ?? "usd"} />
          <Link
            href={`/product/${product.id}`}
            data-testid={`product-open-${product.id}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold",
              "border border-border/70 bg-background/30 text-foreground",
              "hover:bg-background/45 hover:border-primary/25 hover:shadow-[var(--shadow-sm)]",
              "transition-all duration-200 btn-lux",
            )}
          >
            View
            <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {meta.chips.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.chips.map((c) => (
              <Badge
                key={c}
                variant="outline"
                className="rounded-full border-border/60 bg-background/20 text-muted-foreground"
              >
                {c}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
