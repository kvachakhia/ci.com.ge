import { cn } from "@/lib/utils";

export function formatMoney(amountMinor: number, currencyCode: string) {
  // backend stores integer; assume it's major units unless specified.
  // Keep it robust: show as integer with separators.
  const safe = Number.isFinite(amountMinor) ? amountMinor : 0;
  const symbol = currencyCode?.toLowerCase() === "usd" ? "$" : currencyCode?.toUpperCase() || "";
  const value = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(safe);
  return `${symbol}${value}`;
}

export default function PriceTag(props: { price: number; currencyCode: string; className?: string; testId?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-baseline gap-2 rounded-2xl border border-primary/25 bg-primary/10 px-3 py-2 shadow-[var(--shadow-xs)]",
        props.className,
      )}
      data-testid={props.testId}
    >
      <div className="text-xs font-semibold text-muted-foreground">Price</div>
      <div className="text-lg font-extrabold text-primary tracking-tight">
        {formatMoney(props.price, props.currencyCode)}
      </div>
    </div>
  );
}
