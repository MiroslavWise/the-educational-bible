import { Fragment } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading } from "@astryxdesign/core/Heading"
import { Text } from "@astryxdesign/core/Text"
import { Badge } from "@astryxdesign/core/Badge"
import { Button } from "@astryxdesign/core/Button"
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

function CommentsBody({
  verse,
  comments,
}: {
  verse: Verse
  comments: Comment[]
}) {
  const refs = verse.crossRefs
  return (
    <div className="tb-popover-comments">
      <VStack gap={3}>
        {comments.map((c, i) => (
          <div key={c.key + i}>
            {i > 0 && <Divider />}
            <CommentCard comment={c} />
          </div>
        ))}
        {refs && refs.length > 0 && (
          <>
            <Divider />
            <VStack gap={1}>
              <Text type="label" color="secondary">
                Параллельные места
              </Text>
              {refs.map((r: CrossRef, i) => (
                <Text key={i} as="p" type="supporting">
                  {r.ref}
                </Text>
              ))}
            </VStack>
          </>
        )}
      </VStack>
    </div>
  )
}

function CrossRefsPopover({ verse }: { verse: Verse }) {
  const refs = verse.crossRefs as CrossRef[]
  return (
    <Popover
      label={`Параллельные места к стиху ${verse.number}`}
      placement="below"
      width={240}
      hasCloseButton={false}
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
  const hasComment = verse.hasComment && comments.length > 0
  const hasXref = Boolean(verse.crossRefs && verse.crossRefs.length > 0)

  const marks = (hasComment || hasXref) && (
    <sup className="tb-verse-marks">
      {hasComment && (
        <span className="tb-star" aria-hidden="true">
          ∗
        </span>
      )}
      {!hasComment && hasXref && <CrossRefsPopover verse={verse} />}
      {hasComment && hasXref && (
        <span className="tb-xref" aria-hidden="true">
          ⌖
        </span>
      )}
    </sup>
  )

  const inner = (
    <>
      <span className="tb-verse-ref">
        <span className="tb-verse-num">{verse.number}</span>
        {marks}
      </span>
      {verse.text}
    </>
  )

  if (!hasComment) {
    return (
      <p className="tb-verse" id={`v${verse.number}`}>
        {inner}
      </p>
    )
  }

  return (
    <Popover
      label={`Толкования к стиху ${verse.number}`}
      placement="below"
      width={360}
      hasCloseButton={false}
      content={<CommentsBody verse={verse} comments={comments} />}
    >
      <button
        type="button"
        className="tb-verse tb-verse--has-comment"
        id={`v${verse.number}`}
        aria-label={`Стих ${verse.number}. Открыть толкование`}
      >
        {inner}
      </button>
    </Popover>
  )
}

function ChapterPicker({ book, current }: { book: Props["book"]; current: number }) {
  return (
    <Popover
      label="Выбрать главу"
      placement="below"
      width={280}
      hasCloseButton={false}
      content={
        <div className="tb-chapter-grid tb-chapter-grid--compact">
          {Array.from({ length: book.chaptersCount }, (_, i) => i + 1).map((n) => (
            <a
              key={n}
              className="tb-chapter-cell"
              href={`/${book.slug}/${n}`}
              aria-current={n === current ? "page" : undefined}
            >
              {n}
            </a>
          ))}
        </div>
      }
    >
      <button type="button" className="tb-chapter-cell tb-chapter-picker-trigger">
        Глава {current} ▾
      </button>
    </Popover>
  )
}

export default function ChapterPage({ book, chapter, nav }: Props) {
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
            <NavButtons />
          </HStack>
        </div>

        <div className="tb-reader-grid">
          <article className="tb-scripture">
            <Heading level={1} accessibilityLevel={1}>
              {book.name}. Глава {chapter.number}
            </Heading>
            <div className="tb-verses" style={{ marginTop: "var(--spacing-5)" }}>
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
        </div>
      </div>
    </Shell>
  )
}
