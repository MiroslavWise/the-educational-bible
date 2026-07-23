import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { buildSitemapEntries, renderSitemapXml } from "../lib/sitemap"

export const prerender = true

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response("SITE is not configured in astro.config.mjs", { status: 500 })
  }

  const books = await getCollection("books")
  const entries = buildSitemapEntries(site, books)
  const lastmod = new Date().toISOString()
  const body = renderSitemapXml(entries, lastmod)

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
