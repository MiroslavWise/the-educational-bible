import { VStack, HStack } from "@astryxdesign/core/Layout"
import { Heading } from "@astryxdesign/core/Heading"
import { Text } from "@astryxdesign/core/Text"
import { Badge } from "@astryxdesign/core/Badge"
import { ClickableCard } from "@astryxdesign/core/ClickableCard"
import { Divider } from "@astryxdesign/core/Divider"
import { Shell } from "./reader/Shell"
import {
  type BookSummary,
  TESTAMENT_LABEL,
  groupByTestament,
  type Testament,
} from "../lib/bible"

interface Props {
  books: BookSummary[]
}

function BookCard({ book }: { book: BookSummary }) {
  return (
    <ClickableCard href={`/${book.slug}`} label={`Открыть книгу «${book.name}»`} padding={5}>
      <VStack gap={2}>
        <HStack hAlign="between" vAlign="center" gap={2}>
          <Heading level={3}>{book.name}</Heading>
          <Badge variant="blue" label={`${book.chaptersCount} гл.`} />
        </HStack>
        <Text type="supporting">{book.fullName}</Text>
      </VStack>
    </ClickableCard>
  )
}

function TestamentSection({
  testament,
  books,
}: {
  testament: Testament
  books: BookSummary[]
}) {
  return (
    <VStack gap={4}>
      <HStack vAlign="center" gap={3}>
        <Heading level={2}>{TESTAMENT_LABEL[testament]}</Heading>
        <Badge variant="neutral" label={`${books.length}`} />
      </HStack>
      {books.length > 0 ? (
        <div className="tb-book-grid">
          {books.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
      ) : (
        <Text type="supporting">Скоро будет добавлено.</Text>
      )}
    </VStack>
  )
}

export default function HomePage({ books }: Props) {
  const grouped = groupByTestament(books)
  return (
    <Shell>
      <section className="tb-hero">
        <VStack gap={4} hAlign="center">
          <Heading level={1} type="display-2">
            Новая учебная Женевская Библия
          </Heading>
          <Text type="large" color="secondary">
            Синодальный текст с подробными толкованиями, подзаголовками разделов и
            перекрёстными ссылками. Стихи, к которым есть комментарий, отмечены
            звёздочкой&nbsp;<span className="tb-star" style={{ fontSize: "0.9em" }}>∗</span>.
          </Text>
        </VStack>
      </section>

      <div className="tb-page">
        <VStack gap={8}>
          <TestamentSection testament="ot" books={grouped.ot} />
          <Divider />
          <TestamentSection testament="nt" books={grouped.nt} />
        </VStack>
      </div>
    </Shell>
  )
}
