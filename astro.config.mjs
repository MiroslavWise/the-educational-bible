// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

// Production URL for canonical links + sitemap. Override with SITE=https://your.domain
const site = process.env.SITE || "https://the-educational-bible.web.app/"

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [react()],
})
