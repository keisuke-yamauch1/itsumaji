export type EpisodeCategory = 'zatsu' | 'gijutsu'

export type ParsedTitle = {
  category: EpisodeCategory
  categoryLabel: '雑談' | '技術'
  number: number | null
  cleanTitle: string
}

const ZATSU_PREFIX = '雑談：'
const ZATSU_TITLES = new Set(['自己紹介'])

export function parseTitle(title: string): ParsedTitle {
  const numMatch = title.match(/\s*#(\d+)\s*$/)
  const number = numMatch ? Number(numMatch[1]) : null
  const stripped = numMatch
    ? title.slice(0, numMatch.index ?? title.length).trim()
    : title

  if (stripped.startsWith(ZATSU_PREFIX)) {
    return {
      category: 'zatsu',
      categoryLabel: '雑談',
      number,
      cleanTitle: stripped.slice(ZATSU_PREFIX.length).trim(),
    }
  }
  if (ZATSU_TITLES.has(stripped)) {
    return {
      category: 'zatsu',
      categoryLabel: '雑談',
      number,
      cleanTitle: stripped,
    }
  }
  return {
    category: 'gijutsu',
    categoryLabel: '技術',
    number,
    cleanTitle: stripped,
  }
}

export function formatDate(iso: string): string {
  return iso.replaceAll('-', '.')
}

export function formatDuration(d: string): string {
  return d.replace(/^00:/, '')
}

export function formatEpisodeNumber(n: number): string {
  return n.toString().padStart(2, '0')
}