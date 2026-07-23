import type { CollectionEntry } from "astro:content"

export interface SitemapEntry {
  loc: string
  changefreq: "weekly" | "monthly"
  priority: number
}

function joinSiteUrl(site: URL, pathname: string): string {
  return new URL(pathname, site).href
}

/** All indexable routes: home, every book, every chapter. */
export function buildSitemapEntries(
  site: URL,
  books: CollectionEntry<"books">[],
): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { loc: joinSiteUrl(site, "/"), changefreq: "weekly", priority: 1 },
  ]

  const sorted = [...books].sort((a, b) => a.data.order - b.data.order)

  for (const book of sorted) {
    const { slug, chapters } = book.data
    entries.push({
      loc: joinSiteUrl(site, `/${slug}/`),
      changefreq: "monthly",
      priority: 0.9,
    })

    for (const chapter of chapters) {
      entries.push({
        loc: joinSiteUrl(site, `/${slug}/${chapter.number}/`),
        changefreq: "monthly",
        priority: 0.8,
      })
    }
  }

  return entries
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export function renderSitemapXml(entries: SitemapEntry[], lastmod: string): string {
  const body = entries
    .map(
      (entry) =>
        `<url>` +
        `<loc>${escapeXml(entry.loc)}</loc>` +
        `<lastmod>${lastmod}</lastmod>` +
        `<changefreq>${entry.changefreq}</changefreq>` +
        `<priority>${entry.priority.toFixed(1)}</priority>` +
        `</url>`,
    )
    .join("")

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    body +
    `</urlset>`
  )
}
