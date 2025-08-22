import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        code: "code.js", // ou src/main.ts
        ui: "ui/index.html",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
