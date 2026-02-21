import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchProduct } from "@/lib/marketplaceApi";
import type { Product } from "@shared/schema";
import { z } from "zod";

export interface ProductsListInput {
  limit?: number;
  search?: string;
}

export interface RefreshProductsInput {
  limit?: number;
}

function buildQuery(params?: ProductsListInput) {
  if (!params) return "";
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set("limit", String(params.limit));
  if (params.search) usp.set("search", params.search);
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export function useProducts(input?: ProductsListInput) {
  const key = `products-list${buildQuery(input)}`;
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const limit = input?.limit ?? 12;
      const products = await fetchProducts({ limit });
      
      // Client-side search filtering
      if (input?.search) {
        const searchLower = input.search.toLowerCase();
        return products.filter((p) =>
          p.title.toLowerCase().includes(searchLower)
        );
      }
      
      return products;
    },
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      return await fetchProduct(id);
    },
    enabled: !!id,
  });
}

export function useRefreshProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RefreshProductsInput) => {
      const limit = input?.limit ?? 12;
      const products = await fetchProducts({ limit });
      
      // Return the count of refreshed products
      return { refreshed: products.length };
    },
    onSuccess: async () => {
      // Invalidate all product queries to refetch data
      qc.invalidateQueries({
        predicate: (q) => {
          const key = q.queryKey?.[0];
          return typeof key === "string" && key.startsWith("products-list");
        },
      });
    },
  });
}
