  import type { Product, ProductImage } from "@shared/schema";

function normalizeImages(p: any): ProductImage[] {
  const candidates: any[] =
    (Array.isArray(p?.vehicle_product?.images) && p.vehicle_product.images) ||
    (Array.isArray(p?.vehicle?.images) && p.vehicle.images) ||
    (Array.isArray(p?.images) && p.images) ||
    [];

  const seen = new Set<string>();
  const images: ProductImage[] = [];
  candidates.forEach((img: any, idx: number) => {
    const url = typeof img === "string" ? img : img?.url;
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push({
      id: String(img?.id ?? url),
      url: String(url),
      rank: typeof img?.rank === "number" ? img.rank : idx,
    });
  });
  images.sort((a, b) => a.rank - b.rank);
  return images;
}

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Development: use Vite proxy
    return "/api/marketplace";
  }
  const url = new URL(window.location.href);
  if (url.hostname === "localhost" || url.hostname.includes("127.0.0.1")) {
    // Local production build
    return "/api/marketplace";
  }
  // Production: prefer the direct marketplace URL (works on shared hosting
  // where there is no /api/marketplace serverless function). Falls back to the
  // Vercel proxy route only if VITE_MARKETPLACE_URL was not baked in.
  const direct = import.meta.env.VITE_MARKETPLACE_URL;
  if (typeof direct === "string" && direct.length > 0) {
    return direct;
  }
  return "/api/marketplace";
};

const MARKETPLACE_BASE_URL = getApiBaseUrl();
const MARKETPLACE_PUBLISHABLE_KEY = import.meta.env.VITE_MARKETPLACE_PUBLISHABLE_KEY || "pk_2a4a899f20baeb0b17fbb95770f00c8387a44eef1e38fd647a174273cf28cd34";

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
 * Fetch products from the cached /store/inventory endpoint, which returns
 * all published vehicles with full details (prices, variants, images) in one call.
 */
export async function fetchProducts(options?: FetchProductsOptions): Promise<Product[]> {
  const baseUrl = MARKETPLACE_BASE_URL;
  const path = `${baseUrl}/inventory`;
  const apiKey = MARKETPLACE_PUBLISHABLE_KEY;

  const params = new URLSearchParams();
  if (options?.limit) {
    params.set("limit", String(options.limit));
  }
  if (options?.search) {
    params.set("q", options.search);
  }
  const qs = params.toString();
  const url = qs ? `${path}?${qs}` : path;

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

  // /inventory shape isn't documented yet — accept the most likely wrappers
  // plus a bare array, so we don't silently empty out if the key is renamed.
  const productsRaw: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.inventory)
      ? data.inventory
      : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.items)
          ? data.items
          : [];

  if (productsRaw.length === 0) {
    console.warn("No products parsed from /inventory response. Raw payload:", data);
  }

  return productsRaw.map((p: any) => {
    const rawPrice = p?.variants?.[0]?.calculated_price ?? p?.price;
    const price = typeof rawPrice === "number" ? Math.trunc(rawPrice) : 0;

    const images = normalizeImages(p);
    const thumbnail = p.thumbnail ? String(p.thumbnail) : images[0]?.url ?? null;

    return {
      id: String(p.id),
      title: String(p.title ?? ""),
      thumbnail,
      images,
      price,
      currencyCode: "usd",
      vehicle: p.vehicle_product ?? p.vehicle ?? null,
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
  
  const params = new URLSearchParams();
  params.set(
    "fields",
    "id,title,thumbnail,images.*,variants.calculated_price,vehicle_product.*",
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
  
  const images = normalizeImages(p);
  const thumbnail = p.thumbnail ? String(p.thumbnail) : images[0]?.url ?? null;

  console.log(`Images parsed: ${images.length}`, {
    productImages: p.images,
    vehicleProductImages: p.vehicle_product?.images,
  });

  return {
    id: String(p.id),
    title: String(p.title ?? ""),
    thumbnail,
    images,
    price,
    currencyCode: "usd",
    vehicle: p.vehicle_product ?? null,
  } satisfies Product;
}
