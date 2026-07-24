/** Thematic Bible book sections (colors match common study-Bible palettes). */

export type BookSection =
  | "law"
  | "history"
  | "wisdom"
  | "major-prophets"
  | "minor-prophets"
  | "gospels"
  | "acts"
  | "pauline"
  | "general-epistles"
  | "revelation"

export interface BookSectionMeta {
  id: BookSection
  label: string
  testament: "ot" | "nt"
}

export const BOOK_SECTIONS: BookSectionMeta[] = [
  { id: "law", label: "Пятикнижие", testament: "ot" },
  { id: "history", label: "Исторические", testament: "ot" },
  { id: "wisdom", label: "Учительные", testament: "ot" },
  { id: "major-prophets", label: "Большие пророки", testament: "ot" },
  { id: "minor-prophets", label: "Малые пророки", testament: "ot" },
  { id: "gospels", label: "Евангелия", testament: "nt" },
  { id: "acts", label: "Деяния", testament: "nt" },
  { id: "pauline", label: "Послания Павла", testament: "nt" },
  { id: "general-epistles", label: "Соборные послания", testament: "nt" },
  { id: "revelation", label: "Откровение", testament: "nt" },
]

const SECTION_BY_SLUG: Record<string, BookSection> = {
  genesis: "law",
  exodus: "law",
  leviticus: "law",
  numbers: "law",
  deuteronomy: "law",

  joshua: "history",
  judges: "history",
  ruth: "history",
  "1-samuel": "history",
  "2-samuel": "history",
  "1-kings": "history",
  "2-kings": "history",
  "1-chronicles": "history",
  "2-chronicles": "history",
  ezra: "history",
  nehemiah: "history",
  esther: "history",

  job: "wisdom",
  psalms: "wisdom",
  proverbs: "wisdom",
  ecclesiastes: "wisdom",
  "song-of-songs": "wisdom",

  isaiah: "major-prophets",
  jeremiah: "major-prophets",
  lamentations: "major-prophets",
  ezekiel: "major-prophets",
  daniel: "major-prophets",

  hosea: "minor-prophets",
  joel: "minor-prophets",
  amos: "minor-prophets",
  obadiah: "minor-prophets",
  jonah: "minor-prophets",
  micah: "minor-prophets",
  nahum: "minor-prophets",
  habakkuk: "minor-prophets",
  zephaniah: "minor-prophets",
  haggai: "minor-prophets",
  zechariah: "minor-prophets",
  malachi: "minor-prophets",

  matthew: "gospels",
  mark: "gospels",
  luke: "gospels",
  john: "gospels",

  acts: "acts",

  romans: "pauline",
  "1-corinthians": "pauline",
  "2-corinthians": "pauline",
  galatians: "pauline",
  ephesians: "pauline",
  philippians: "pauline",
  colossians: "pauline",
  "1-thessalonians": "pauline",
  "2-thessalonians": "pauline",
  "1-timothy": "pauline",
  "2-timothy": "pauline",
  titus: "pauline",
  philemon: "pauline",
  hebrews: "pauline",

  james: "general-epistles",
  "1-peter": "general-epistles",
  "2-peter": "general-epistles",
  "1-john": "general-epistles",
  "2-john": "general-epistles",
  "3-john": "general-epistles",
  jude: "general-epistles",

  revelation: "revelation",
}

export function getBookSection(slug: string): BookSection {
  return SECTION_BY_SLUG[slug] ?? "history"
}

export function getBookSectionMeta(slug: string): BookSectionMeta {
  const id = getBookSection(slug)
  return BOOK_SECTIONS.find((s) => s.id === id) ?? BOOK_SECTIONS[1]
}
