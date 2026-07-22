// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"

// Production URL for canonical links + sitemap. Override with SITE=https://your.domain
const site = process.env.SITE || "https://the-educational-bible.web.app/"

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    react(),
    sitemap({
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === `${site}/` || item.url === site) {
          item.priority = 1
          item.changefreq = "weekly"
        } else if (/\/\d+\/?$/.test(item.url)) {
          // chapter pages
          item.priority = 0.8
        } else {
          // book pages
          item.priority = 0.9
        }
        return item
      },
    }),
  ],
})
