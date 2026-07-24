import type { Testament } from "./bible"
import bookVideos from "../data/book-videos.json"

export interface BookVideo {
  id: string
  title: string
}

export interface BookVideosData {
  playlists: { ot: string; nt: string; lukeActs?: string }
  byBook: Record<string, BookVideo[]>
}

const data = bookVideos as BookVideosData

export function getVideosForBook(slug: string): BookVideo[] {
  return data.byBook[slug] ?? []
}

export function getPlaylistUrl(testament: Testament): string {
  const id = data.playlists[testament]
  return `https://www.youtube.com/playlist?list=${id}`
}

/** Extra series playlist for Luke / Acts books, if present. */
export function getLukeActsPlaylistUrl(): string | null {
  const id = data.playlists.lukeActs
  return id ? `https://www.youtube.com/playlist?list=${id}` : null
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export function youtubeThumbUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}
