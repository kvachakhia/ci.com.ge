import { z } from "zod";

/**
 * Product type representing an item from the marketplace
 */
export interface ProductImage {
  id: string;
  url: string;
  rank: number;
}

export interface Product {
  id: string;
  title: string;
  thumbnail: string | null;
  images: ProductImage[];
  price: number;
  currencyCode: string;
  vehicle: Record<string, any> | null;
}

export type ProductsListResponse = Product[];
export type ProductResponse = Product;

/**
 * Highlight item for the homepage banner
 */
export interface HighlightItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

export type HighlightsListResponse = HighlightItem[];

/**
 * Site settings for customizing the appearance and contact info
 */
export interface SiteSettings {
  id: string;
  brandName: string;
  accent: string;
  background: string;
  cardBackground: string;
  heroImageUrl: string;
  whatsappUrl: string;
}

export type SiteSettingsResponse = SiteSettings;

/**
 * Configuration for the external marketplace API
 */
export const externalApiConfigSchema = z.object({
  baseUrl: z.string().url(),
  publishableKey: z.string().min(1),
});

export type ExternalApiConfig = z.infer<typeof externalApiConfigSchema>;

