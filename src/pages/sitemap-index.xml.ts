import type { APIRoute } from "astro"

/** Backward-compatible alias for tools that expect sitemap-index.xml */
export const prerender = true

export const GET: APIRoute = ({ site }) => {
  const target = site
    ? new URL("sitemap.xml", site).href
    : "/sitemap.xml"

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    `<sitemap><loc>${target}</loc></sitemap>` +
    `</sitemapindex>`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
