import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const crossRef = z.object({
  marker: z.string(),
  ref: z.string(),
})

const verse = z.object({
  number: z.number(),
  text: z.string(),
  hasComment: z.boolean(),
  subheading: z.string().optional(),
  crossRefs: z.array(crossRef).optional(),
})

const commentEntry = z.object({
  lemma: z.string(),
  body: z.string(),
})

const comment = z.object({
  key: z.string(),
  verseStart: z.number(),
  verseEnd: z.number(),
  verses: z.array(z.number()),
  entries: z.array(commentEntry),
})

const chapter = z.object({
  number: z.number(),
  verses: z.array(verse),
  comments: z.array(comment),
})

const prose = z.object({
  heading: z.string().optional(),
  title: z.string().optional(),
  paragraphs: z.array(z.string()),
})

const books = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/books" }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    fullName: z.string(),
    abbr: z.string(),
    testament: z.enum(["ot", "nt"]),
    order: z.number(),
    chaptersCount: z.number(),
    introduction: z.array(prose),
    articles: z.array(prose),
    chapters: z.array(chapter),
  }),
})

export const collections = { books }
