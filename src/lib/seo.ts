/** Shared SEO helpers for Astro pages. */

export const SITE_NAME = "Новая учебная Женевская Библия"

/** Primary meta description — includes natural search phrases. */
export const SITE_TAGLINE =
  "Почитать Библию онлайн бесплатно: синодальный текст с толкованиями Женевской учебной Библии — стихи, подзаголовки и перекрёстные ссылки."

/**
 * Keywords for meta/schema. Prefer natural phrasing in title/description;
 * this list supports Yandex and secondary engines.
 */
export const SITE_KEYWORDS = [
  "Библия онлайн",
  "почитать Библию",
  "читать Библию онлайн",
  "Библия бесплатно",
  "синодальный перевод",
  "Женевская учебная Библия",
  "толкование Библии",
  "комментарии к Библии",
  "Библия с толкованиями",
  "Священное Писание онлайн",
  "Ветхий Завет онлайн",
  "Новый Завет онлайн",
].join(", ")

/** Default Open Graph / Twitter share image (absolute path on site). */
export const OG_IMAGE_PATH = "/og-image.png"
export const OG_IMAGE_WIDTH = 1376
export const OG_IMAGE_HEIGHT = 768
export const OG_IMAGE_ALT = SITE_NAME

export function absoluteUrl(path: string, site?: URL | string | null): string {
  const base = site ?? "https://the-educational-bible.web.app/"
  return new URL(path, base).href
}

export function truncate(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + "…"
}

export function bookTitle(fullName: string): string {
  return `${fullName} — читать онлайн — ${SITE_NAME}`
}

export function chapterTitle(bookName: string, chapter: number): string {
  return `${bookName}, глава ${chapter} — почитать онлайн — ${SITE_NAME}`
}

export function bookKeywords(name: string, fullName: string): string {
  return [
    `${name} онлайн`,
    `почитать ${name}`,
    `читать ${name} онлайн`,
    fullName,
    "Библия онлайн",
    "синодальный перевод",
    "толкование",
    SITE_NAME,
  ].join(", ")
}

export function chapterKeywords(bookName: string, chapter: number): string {
  return [
    `${bookName} ${chapter}`,
    `${bookName} глава ${chapter} онлайн`,
    `почитать ${bookName} ${chapter}`,
    "Библия онлайн",
    "синодальный перевод",
    "толкование Библии",
    SITE_NAME,
  ].join(", ")
}

export function bookDescription(fullName: string, chaptersCount: number, intro?: string): string {
  if (intro) {
    return truncate(`Почитать онлайн: ${fullName}. ${intro}`)
  }
  return truncate(
    `Почитать ${fullName} онлайн бесплатно: синодальный текст с толкованиями Женевской учебной Библии. ${chaptersCount} глав.`,
  )
}

export function chapterDescription(
  bookName: string,
  chapter: number,
  verseTexts: string[],
): string {
  const preview = verseTexts.filter(Boolean).slice(0, 3).join(" ")
  if (preview) {
    return truncate(`Почитать ${bookName}, глава ${chapter} онлайн. ${preview}`)
  }
  return truncate(
    `Почитать ${bookName}, глава ${chapter} онлайн: синодальный текст и толкования Женевской учебной Библии.`,
  )
}
