import { Fragment, useState } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading } from "@astryxdesign/core/Heading"
import { Text } from "@astryxdesign/core/Text"
import { Badge } from "@astryxdesign/core/Badge"
import { Button } from "@astryxdesign/core/Button"
import { Switch } from "@astryxdesign/core/Switch"
import { Divider } from "@astryxdesign/core/Divider"
import { Popover } from "@astryxdesign/core/Popover"
import { Breadcrumbs, BreadcrumbItem } from "@astryxdesign/core/Breadcrumbs"
import { Shell } from "./reader/Shell"
import {
  type Chapter,
  type Comment,
  type CrossRef,
  type Verse,
  commentsForVerse,
} from "../lib/bible"

interface Props {
  book: { slug: string; name: string; chaptersCount: number }
  chapter: Chapter
  nav: { prev: number | null; next: number | null }
}

function rangeLabel(c: Comment): string {
  return c.verseStart === c.verseEnd ? `ст. ${c.verseStart}` : `ст. ${c.verseStart}–${c.verseEnd}`
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <VStack gap={1}>
      <HStack gap={2} vAlign="center">
        <Badge variant="blue" label={comment.key} />
        <Text type="supporting">{rangeLabel(comment)}</Text>
      </HStack>
      <VStack gap={1}>
        {comment.entries.map((e, i) => (
          <Text key={i} as="p">
            {e.lemma && <span className="tb-lemma">{e.lemma}. </span>}
            {e.body}
          </Text>
        ))}
      </VStack>
    </VStack>
  )
}

function CommentsPopover({ verse, comments }: { verse: Verse; comments: Comment[] }) {
  return (
    <Popover
      label={`Толкования к стиху ${verse.number}`}
      placement="below"
      width={360}
      content={
        <div className="tb-popover-comments">
          <VStack gap={3}>
            {comments.map((c, i) => (
              <div key={c.key + i}>
                {i > 0 && <Divider />}
                <CommentCard comment={c} />
              </div>
            ))}
          </VStack>
        </div>
      }
    >
      <button className="tb-star" aria-label={`Толкование к стиху ${verse.number}`}>
        ∗
      </button>
    </Popover>
  )
}

function CrossRefsPopover({ verse }: { verse: Verse }) {
  const refs = verse.crossRefs as CrossRef[]
  return (
    <Popover
      label={`Параллельные места к стиху ${verse.number}`}
      placement="below"
      width={240}
      content={
        <VStack gap={1}>
          <Text type="label" color="secondary">
            Параллельные места
          </Text>
          {refs.map((r, i) => (
            <Text key={i} as="p" type="supporting">
              {r.ref}
            </Text>
          ))}
        </VStack>
      }
    >
      <button className="tb-xref" aria-label={`Параллельные места к стиху ${verse.number}`}>
        ⌖
      </button>
    </Popover>
  )
}

function VerseView({ verse, chapter }: { verse: Verse; chapter: Chapter }) {
  const comments = verse.hasComment ? commentsForVerse(chapter, verse.number) : []
  return (
    <Text as="span" type="inherit">
      <span className="tb-verse-num">{verse.number}</span>
      {verse.hasComment && comments.length > 0 && (
        <CommentsPopover verse={verse} comments={comments} />
      )}
      {verse.crossRefs && verse.crossRefs.length > 0 && <CrossRefsPopover verse={verse} />}{" "}
      {verse.text}{" "}
    </Text>
  )
}

function ChapterPicker({ book, current }: { book: Props["book"]; current: number }) {
  return (
    <Popover
      label="Выбрать главу"
      placement="below"
      width={320}
      content={
        <div className="tb-chapter-grid" style={{ maxWidth: 300 }}>
          {Array.from({ length: book.chaptersCount }, (_, i) => i + 1).map((n) => (
            <a
              key={n}
              className="tb-chapter-cell"
              href={`/${book.slug}/${n}`}
              aria-current={n === current ? "page" : undefined}
              style={
                n === current
                  ? { borderColor: "var(--color-accent)", color: "var(--color-text-accent)" }
                  : undefined
              }
            >
              {n}
            </a>
          ))}
        </div>
      }
    >
      <button
        className="tb-chapter-cell"
        style={{ width: "auto", aspectRatio: "auto", padding: "0 var(--spacing-3)", height: 32 }}
      >
        Глава {current} ▾
      </button>
    </Popover>
  )
}

export default function ChapterPage({ book, chapter, nav }: Props) {
  const [showPanel, setShowPanel] = useState(false)
  const go = (n: number) => {
    window.location.href = `/${book.slug}/${n}`
  }

  const NavButtons = () => (
    <HStack gap={2} vAlign="center">
      <Button
        label="Предыдущая глава"
        variant="secondary"
        size="sm"
        isDisabled={nav.prev === null}
        onClick={() => nav.prev && go(nav.prev)}
      >
        ← Пред.
      </Button>
      <ChapterPicker book={book} current={chapter.number} />
      <Button
        label="Следующая глава"
        variant="secondary"
        size="sm"
        isDisabled={nav.next === null}
        onClick={() => nav.next && go(nav.next)}
      >
        След. →
      </Button>
    </HStack>
  )

  return (
    <Shell>
      <div className="tb-reader">
        <div className="tb-reader-toolbar">
          <HStack hAlign="between" vAlign="center" gap={3} wrap="wrap">
            <Breadcrumbs variant="supporting">
              <BreadcrumbItem href="/">Главная</BreadcrumbItem>
              <BreadcrumbItem href={`/${book.slug}`}>{book.name}</BreadcrumbItem>
              <BreadcrumbItem isCurrent>Глава {chapter.number}</BreadcrumbItem>
            </Breadcrumbs>
            <HStack gap={4} vAlign="center" wrap="wrap">
              <Switch
                value={showPanel}
                onChange={(checked) => setShowPanel(checked)}
                label="Толкования рядом"
              />
              <NavButtons />
            </HStack>
          </HStack>
        </div>

        <div className={`tb-reader-grid${showPanel ? " has-aside" : ""}`}>
          <article className="tb-scripture">
            <Heading level={1} accessibilityLevel={1}>
              {book.name}. Глава {chapter.number}
            </Heading>
            <div className="tb-verse" style={{ marginTop: "var(--spacing-5)" }}>
              {chapter.verses.map((v) => (
                <Fragment key={v.number}>
                  {v.subheading && (
                    <Heading level={3} color="accent">
                      <span className="tb-subheading">{v.subheading}</span>
                    </Heading>
                  )}
                  <VerseView verse={v} chapter={chapter} />
                </Fragment>
              ))}
            </div>

            <Divider />
            <div className="tb-center" style={{ paddingBlock: "var(--spacing-4)" }}>
              <NavButtons />
            </div>
          </article>

          {showPanel && (
            <aside className="tb-aside">
              <VStack gap={4}>
                <Heading level={2}>Толкования</Heading>
                {chapter.comments.length === 0 && (
                  <Text type="supporting">К этой главе нет толкований.</Text>
                )}
                {chapter.comments.map((c, i) => (
                  <div key={c.key + i} className="tb-comment">
                    <CommentCard comment={c} />
                    {i < chapter.comments.length - 1 && <Divider />}
                  </div>
                ))}
              </VStack>
            </aside>
          )}
        </div>
      </div>
    </Shell>
  )
}
