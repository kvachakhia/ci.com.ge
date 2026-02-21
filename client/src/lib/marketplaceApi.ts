import type { Product } from "@shared/schema";

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Development: use Vite proxy
    return "/api/marketplace";
  }
  // Production: use Vercel API proxy (or direct URL with CORS)
  const url = new URL(window.location.href);
  if (url.hostname === "localhost" || url.hostname.includes("127.0.0.1")) {
    // Local production build
    return "/api/marketplace";
  }
  // Vercel deployment: use Vercel API route
  return "/api/proxy";
};

const MARKETPLACE_BASE_URL = getApiBaseUrl();
const MARKETPLACE_PUBLISHABLE_KEY = import.meta.env.VITE_MARKETPLACE_PUBLISHABLE_KEY || "pk_8a629f7ca32dbf8a06e3b2ca4bc27c0fe90a54e08ffb7a960bd8e2892827f3fe";

// Debug: log the API key status
if (!MARKETPLACE_PUBLISHABLE_KEY) {
  console.warn("⚠️ VITE_MARKETPLACE_PUBLISHABLE_KEY is not set in environment variables");
} else {
  console.log("✓ Marketplace API key loaded");
}

export interface FetchProductsOptions {
  limit?: number;
  search?: string;
}

/**
 * Fetch products from the external marketplace API
 */
export async function fetchProducts(options?: FetchProductsOptions): Promise<Product[]> {
  const baseUrl = MARKETPLACE_BASE_URL;
  const path = `${baseUrl}/products`;
  const apiKey = MARKETPLACE_PUBLISHABLE_KEY;
  
  // Build query string manually for relative URLs
  const params = new URLSearchParams();
  params.set("limit", String(options?.limit ?? 12));
  params.set(
    "fields",
    "id,title,thumbnail,variants.calculated_price,vehicle_product.*",
  );

  const url = `${path}?${params.toString()}`;

  console.log("Fetching products from:", url);
  console.log("API Key present:", !!apiKey);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": apiKey || "",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch error:", res.status, errorText);
    throw new Error(`Marketplace request failed: ${res.status} - ${errorText}`);
  }

  const data = (await res.json()) as any;
  const productsRaw = Array.isArray(data?.products) ? data.products : [];

  return productsRaw.map((p: any) => {
    // Handle price - null, undefined, or number
    const rawPrice = p?.variants?.[0]?.calculated_price;
    const price = typeof rawPrice === "number" ? Math.trunc(rawPrice) : 0;
    
    console.log(`Product: ${p.id} - Title: ${p.title} - Price: ${price}`);
    
    return {
      id: String(p.id),
      title: String(p.title ?? ""),
      thumbnail: p.thumbnail ? String(p.thumbnail) : null,
      price,
      currencyCode: "usd",
      vehicle: p.vehicle_product ?? null,
    } satisfies Product;
  });
}

/**
 * Fetch a single product from the external marketplace API
 */
export async function fetchProduct(id: string): Promise<Product | null> {
  const baseUrl = MARKETPLACE_BASE_URL;
  const path = `${baseUrl}/products/${id}`;
  const apiKey = MARKETPLACE_PUBLISHABLE_KEY;
  
  // Build query string manually for relative URLs
  const params = new URLSearchParams();
  params.set(
    "fields",
    "id,title,thumbnail,variants.calculated_price,vehicle_product.*",
  );

  const url = `${path}?${params.toString()}`;

  console.log("Fetching product from:", url);
  console.log("API Key present:", !!apiKey);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": apiKey || "",
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch error:", res.status, errorText);
    throw new Error(`Marketplace request failed: ${res.status} - ${errorText}`);
  }

  const responseData = (await res.json()) as any;
  console.log("Raw API response:", responseData);
  
  // The API returns the product wrapped in a 'product' key
  const p = responseData?.product || responseData;
  
  if (!p || !p.id) {
    console.warn("Invalid product response", responseData);
    return null;
  }

  // Handle price - null, undefined, or number
  const rawPrice = p?.variants?.[0]?.calculated_price;
  const price = typeof rawPrice === "number" ? Math.trunc(rawPrice) : 0;
  
  console.log(`Fetched product: ${p.id} - Title: ${p.title} - Price: ${price} - Vehicle:`, p.vehicle_product);
  
  return {
    id: String(p.id),
    title: String(p.title ?? ""),
    thumbnail: p.thumbnail ? String(p.thumbnail) : null,
    price,
    currencyCode: "usd",
    vehicle: p.vehicle_product ?? null,
  } satisfies Product;
}
