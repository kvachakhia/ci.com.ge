import type { SiteSettings, HighlightItem } from "@shared/schema";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "default",
  brandName: "CAUCASUS IMPEX",
  accent: "#e61e25",
  background: "#0a0a0a",
  cardBackground: "#141414",
  heroImageUrl:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000",
  whatsappUrl: "https://wa.me/995593674190",
};

export const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
  {
    id: "premium-quality",
    title: "PREMIUM QUALITY",
    description: "Rigorous 150-point inspection.",
    order: 1,
  },
  {
    id: "global-shipping",
    title: "GLOBAL SHIPPING",
    description: "International delivery handled.",
    order: 2,
  },
  {
    id: "financing",
    title: "FINANCING",
    description: "Competitive rates available.",
    order: 3,
  },
];
