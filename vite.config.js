import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The demonstrator is a single-page React app. Fonts live in /public/fonts,
// Phosphor icons are loaded from CDN in index.html.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
