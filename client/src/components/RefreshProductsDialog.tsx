import { useMemo, useState } from "react";
import { z } from "zod";
import { useRefreshProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50),
});

export default function RefreshProductsDialog(props: { defaultLimit?: number; triggerVariant?: "default" | "outline" }) {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState<number>(props.defaultLimit ?? 12);
  const { toast } = useToast();
  const refresh = useRefreshProducts();

  const triggerClass = useMemo(() => {
    if (props.triggerVariant === "outline") {
      return "border-border/70 bg-background/30 hover:bg-background/50 hover:border-primary/25";
    }
    return "bg-primary text-primary-foreground hover:shadow-[0_18px_50px_-30px_hsl(var(--primary)/0.7)]";
  }, [props.triggerVariant]);

  const onSubmit = async () => {
    const parsed = formSchema.safeParse({ limit });
    if (!parsed.success) {
      toast({
        title: "Check the limit",
        description: parsed.error.errors?.[0]?.message ?? "Invalid limit",
        variant: "destructive",
      });
      return;
    }

    refresh.mutate(
      { limit: parsed.data.limit },
      {
        onSuccess: (data) => {
          toast({
            title: "Inventory refreshed",
            description: `Pulled ${data.refreshed} new/updated listings.`,
          });
          setOpen(false);
        },
        onError: (e) => {
          toast({
            title: "Refresh failed",
            description: e instanceof Error ? e.message : "Unknown error",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          data-testid="refresh-products-open"
          className={`rounded-2xl btn-lux transition-all duration-200 ${triggerClass}`}
          variant={props.triggerVariant === "outline" ? "outline" : "default"}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </DialogTrigger>

      <DialogContent className="glass border border-border/60 rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Refresh inventory</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Pull the newest arrivals from the marketplace backend. This may take a few seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <div>
            <label className="text-sm font-semibold text-muted-foreground" htmlFor="limit">
              Limit (1–50)
            </label>
            <Input
              id="limit"
              type="number"
              value={String(limit)}
              onChange={(e) => setLimit(Number(e.target.value))}
              data-testid="refresh-products-limit"
              className="mt-2 rounded-2xl bg-background/30 border-2 border-border/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
              min={1}
              max={50}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="refresh-products-cancel"
              className="rounded-2xl border-border/70 bg-background/25 hover:bg-background/45"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={refresh.isPending}
              data-testid="refresh-products-submit"
              className="rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              {refresh.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing…
                </span>
              ) : (
                "Refresh now"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
