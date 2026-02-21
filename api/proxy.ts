import type { VercelRequest, VercelResponse } from "@vercel/node";

const MARKETPLACE_URL =
  process.env.VITE_MARKETPLACE_URL ||
  "https://marketplace-backend-101825326475.us-east1.run.app/store";
const MARKETPLACE_PUBLISHABLE_KEY = process.env.VITE_MARKETPLACE_PUBLISHABLE_KEY || "pk_8a629f7ca32dbf8a06e3b2ca4bc27c0fe90a54e08ffb7a960bd8e2892827f3fe";

console.log("Marketplace URL:", MARKETPLACE_URL);
console.log("API Key configured:", !!MARKETPLACE_PUBLISHABLE_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract the path from the request URL
  const path = req.url?.replace(/^\/api\/proxy/, "") || "/products";

  try {
    const url = new URL(`${MARKETPLACE_URL}${path}`);
    
    // Copy all query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.set(key, String(value));
      }
    });

    // Ensure required fields parameter is set
    if (!url.searchParams.has("fields")) {
      url.searchParams.set(
        "fields",
        "id,title,thumbnail,variants.calculated_price,vehicle_product.*"
      );
    }

    console.log("Marketplace proxy request to:", url.toString());

    const response = await fetch(url.toString(), {
      method: req.method || "GET",
      headers: {
        "x-publishable-api-key": MARKETPLACE_PUBLISHABLE_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Marketplace API error:", response.status, errorData);
      return res.status(response.status).json({
        error: `Marketplace API error: ${response.status}`,
        details: errorData,
      });
    }

    const data = await response.json();

    // Set CORS headers to allow frontend requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({
      error: "Failed to fetch from marketplace API",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
