// Shared Bible domain types + helpers. Plain TS so both Astro pages and React
// islands can import them (React cannot import `astro:content`).

export interface CrossRef {
  marker: string
  ref: string
}

export interface Verse {
  number: number
  text: string
  hasComment: boolean
  subheading?: string
  crossRefs?: CrossRef[]
}

export interface CommentEntry {
  lemma: string
  body: string
}

export interface Comment {
  key: string
  verseStart: number
  verseEnd: number
  verses: number[]
  entries: CommentEntry[]
}

export interface Chapter {
  number: number
  verses: Verse[]
  comments: Comment[]
}

export interface Prose {
  heading?: string
  title?: string
  paragraphs: string[]
}

export type Testament = "ot" | "nt"

export interface Book {
  id: string
  slug: string
  name: string
  fullName: string
  abbr: string
  testament: Testament
  order: number
  chaptersCount: number
  introduction: Prose[]
  articles: Prose[]
  chapters: Chapter[]
}

/** Lightweight book descriptor for listings / navigation. */
export interface BookSummary {
  slug: string
  name: string
  fullName: string
  abbr: string
  testament: Testament
  order: number
  chaptersCount: number
}

export const TESTAMENT_LABEL: Record<Testament, string> = {
  ot: "Ветхий Завет",
  nt: "Новый Завет",
}

export function toSummary(book: Book): BookSummary {
  const { slug, name, fullName, abbr, testament, order, chaptersCount } = book
  return { slug, name, fullName, abbr, testament, order, chaptersCount }
}

export function sortBooks<T extends { order: number }>(books: T[]): T[] {
  return [...books].sort((a, b) => a.order - b.order)
}

export function groupByTestament(books: BookSummary[]): Record<Testament, BookSummary[]> {
  const sorted = sortBooks(books)
  return {
    ot: sorted.filter((b) => b.testament === "ot"),
    nt: sorted.filter((b) => b.testament === "nt"),
  }
}

export function getChapter(book: Book, n: number): Chapter | undefined {
  return book.chapters.find((c) => c.number === n)
}

export interface ChapterNav {
  prev: number | null
  next: number | null
}

export function chapterNav(book: Book, n: number): ChapterNav {
  return {
    prev: n > 1 ? n - 1 : null,
    next: n < book.chaptersCount ? n + 1 : null,
  }
}

/** Comments covering a given verse number within a chapter. */
export function commentsForVerse(chapter: Chapter, verseNumber: number): Comment[] {
  return chapter.comments.filter((c) => c.verses.includes(verseNumber))
}

/** Human-readable reference, e.g. "Бытие 1:1". */
export function verseRef(bookName: string, chapter: number, verse: number): string {
  return `${bookName} ${chapter}:${verse}`
}
