export type Episode = {
    guid: string
    title: string
    description: string
    published_at: string
    duration: string
    thumbnail_url: string
    category_id: number
    season: number | null
    episode_number: number
}
