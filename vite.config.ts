import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api/marketplace": {
        target: "https://marketplace-backend-101825326475.us-east1.run.app/store",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/marketplace/, ""),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            // Forward the x-publishable-api-key header from the client request
            const clientKey = req.headers["x-publishable-api-key"];
            if (clientKey) {
              proxyReq.setHeader("x-publishable-api-key", clientKey);
            }
            // Fallback: use environment variable or hardcoded key
            else {
              const key = process.env.VITE_MARKETPLACE_PUBLISHABLE_KEY || "pk_8a629f7ca32dbf8a06e3b2ca4bc27c0fe90a54e08ffb7a960bd8e2892827f3fe";
              proxyReq.setHeader("x-publishable-api-key", key);
            }
          });
        },
      },
    },
  },
});
