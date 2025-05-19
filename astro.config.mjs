import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: true,
    },
  },
  site: "https://swyftachievers.com",
  output: "static",
  integrations: [sitemap()],
  devToolbar: {
    enabled: false,
  },
});
