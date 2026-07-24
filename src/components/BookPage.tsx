import { useState } from "react"
import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading } from "@astryxdesign/core/Heading"
import { Text } from "@astryxdesign/core/Text"
import { Badge } from "@astryxdesign/core/Badge"
import { Divider } from "@astryxdesign/core/Divider"
import { Breadcrumbs, BreadcrumbItem } from "@astryxdesign/core/Breadcrumbs"
import { Shell } from "./reader/Shell"
import { type Prose, type Testament, TESTAMENT_LABEL } from "../lib/bible"
import {
  type BookVideo,
  getLukeActsPlaylistUrl,
  getPlaylistUrl,
  youtubeEmbedUrl,
  youtubeThumbUrl,
} from "../lib/videos"

interface Props {
  book: {
    slug: string
    name: string
    fullName: string
    testament: Testament
    chaptersCount: number
    introduction: Prose[]
    articles: Prose[]
  }
  videos?: BookVideo[]
}

function ProseBlock({ items }: { items: Prose[] }) {
  return (
    <VStack gap={3}>
      {items.map((s, i) => (
        <details key={i} open={i === 0}>
          <summary>
            <Text weight="semibold">{s.heading || s.title || "Раздел"}</Text>
          </summary>
          <div className="tb-prose">
            {s.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        </details>
      ))}
    </VStack>
  )
}

function BookVideos({
  videos,
  testament,
  bookSlug,
}: {
  videos: BookVideo[]
  testament: Testament
  bookSlug: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = videos[activeIndex] ?? videos[0]
  if (!active) return null

  const playlistUrl = getPlaylistUrl(testament)
  const lukeActsUrl =
    bookSlug === "luke" || bookSlug === "acts" ? getLukeActsPlaylistUrl() : null

  return (
    <VStack gap={4}>
      <HStack gap={3} vAlign="center" wrap="wrap">
        <Heading level={2}>Видео</Heading>
        <Badge variant="neutral" label={`${videos.length}`} />
      </HStack>

      <div className="tb-video-embed">
        <iframe
          key={active.id}
          src={youtubeEmbedUrl(active.id)}
          title={active.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <Text type="supporting">{active.title}</Text>

      {videos.length > 1 && (
        <div className="tb-video-switcher" role="tablist" aria-label="Выбор видео">
          {videos.map((video, i) => {
            const selected = i === activeIndex
            return (
              <button
                key={`${video.id}-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                className="tb-video-switcher-item"
                data-active={selected ? "true" : undefined}
                onClick={() => setActiveIndex(i)}
              >
                <img
                  src={youtubeThumbUrl(video.id)}
                  alt=""
                  width={120}
                  height={68}
                  loading="lazy"
                />
                <span className="tb-video-switcher-title">{video.title}</span>
              </button>
            )
          })}
        </div>
      )}

      <Text type="supporting">
        Обзоры{" "}
        <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
          BibleProject
        </a>
        {lukeActsUrl && (
          <>
            {" · "}
            <a href={lukeActsUrl} target="_blank" rel="noopener noreferrer">
              серия «Лука–Деяния»
            </a>
          </>
        )}
      </Text>
    </VStack>
  )
}

export default function BookPage({ book, videos = [] }: Props) {
  return (
    <Shell>
      <div className="tb-page">
        <VStack gap={6}>
          <Breadcrumbs>
            <BreadcrumbItem href="/">Главная</BreadcrumbItem>
            <BreadcrumbItem isCurrent>{book.name}</BreadcrumbItem>
          </Breadcrumbs>

          <VStack gap={2}>
            <Heading level={1}>{book.fullName}</Heading>
            <HStack gap={2} vAlign="center">
              <Badge variant="blue" label={TESTAMENT_LABEL[book.testament]} />
              <Text type="supporting">{book.chaptersCount} глав</Text>
            </HStack>
          </VStack>

          <VStack gap={4}>
            <Heading level={2}>Главы</Heading>
            <div className="tb-chapter-grid">
              {Array.from({ length: book.chaptersCount }, (_, i) => i + 1).map((n) => (
                <a key={n} className="tb-chapter-cell" href={`/${book.slug}/${n}`}>
                  {n}
                </a>
              ))}
            </div>
          </VStack>

          {videos.length > 0 && (
            <>
              <Divider />
              <BookVideos videos={videos} testament={book.testament} bookSlug={book.slug} />
            </>
          )}

          {book.introduction.length > 0 && (
            <>
              <Divider />
              <VStack gap={4}>
                <Heading level={2}>Введение</Heading>
                <ProseBlock items={book.introduction} />
              </VStack>
            </>
          )}

          {book.articles.length > 0 && (
            <>
              <Divider />
              <VStack gap={4}>
                <HStack gap={3} vAlign="center">
                  <Heading level={2}>Тематические статьи</Heading>
                  <Badge variant="purple" label={`${book.articles.length}`} />
                </HStack>
                <ProseBlock items={book.articles} />
              </VStack>
            </>
          )}
        </VStack>
      </div>
    </Shell>
  )
}
