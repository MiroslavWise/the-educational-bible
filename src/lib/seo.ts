/** Shared SEO helpers for Astro pages. */

export const SITE_NAME = "Новая учебная Женевская Библия"
export const SITE_TAGLINE =
  "Синодальный текст с толкованиями Женевской учебной Библии: стихи, подзаголовки и перекрёстные ссылки."

export function truncate(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + "…"
}

export function bookTitle(fullName: string): string {
  return `${fullName} — ${SITE_NAME}`
}

export function chapterTitle(bookName: string, chapter: number): string {
  return `${bookName}, глава ${chapter} — ${SITE_NAME}`
}

export function bookDescription(fullName: string, chaptersCount: number, intro?: string): string {
  if (intro) return truncate(intro)
  return truncate(
    `${fullName}: читать синодальный текст с толкованиями Новой учебной Женевской Библии. ${chaptersCount} глав.`,
  )
}

export function chapterDescription(
  bookName: string,
  chapter: number,
  verseTexts: string[],
): string {
  const preview = verseTexts.filter(Boolean).slice(0, 3).join(" ")
  if (preview) return truncate(`${bookName} ${chapter}. ${preview}`)
  return truncate(
    `${bookName}, глава ${chapter}: синодальный текст и толкования Женевской учебной Библии.`,
  )
}
