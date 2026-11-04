import { resolve } from "node:path";
import { defineConfig } from "vite";
import { docsKit } from "@ajmwagar/docs-kit/vite";

const root = import.meta.dirname;

export default defineConfig({
  root,
  plugins: [
    docsKit({
      root,
      repoRoot: root,
      manifest: "docs.json",
      defaultAudience: "public",
    }),
  ],
  optimizeDeps: { exclude: ["@ajmwagar/docs-kit"] },
  server: { port: 4322, strictPort: true },
  preview: { port: 4322, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
});
