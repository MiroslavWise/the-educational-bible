import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading } from "@astryxdesign/core/Heading"
import { Text } from "@astryxdesign/core/Text"
import { Badge } from "@astryxdesign/core/Badge"
import { Divider } from "@astryxdesign/core/Divider"
import { Breadcrumbs, BreadcrumbItem } from "@astryxdesign/core/Breadcrumbs"
import { Shell } from "./reader/Shell"
import { type Prose, type Testament, TESTAMENT_LABEL } from "../lib/bible"

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

export default function BookPage({ book }: Props) {
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
