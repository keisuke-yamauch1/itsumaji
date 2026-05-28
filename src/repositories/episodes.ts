import {Episode} from "../models/db/episode";
import {PlatformEpisode} from "../models/api/platform_episode";

type EpisodeRow = {
    guid: string
    title: string
    description: string
    published_at: string
    duration: string
    thumbnail_url: string
    category_id: number
    season: number | null
    episode_number: number
    name: string
    icon_url: string
    url: string
}

export async function listEpisodes(db: D1Database): Promise<Episode[]> {
    const result = await db.prepare("SELECT * FROM episodes ORDER BY episode_number DESC").all<Episode>()
    return result.results
}

export async function findEpisodeByTitle(db: D1Database, title: string): Promise<Episode | null> {
    const result = await db.prepare("SELECT * FROM episodes WHERE title = ?")
        .bind(title.normalize('NFD'))
        .first<Episode>()
    return result ?? null
}

export async function findEpisodeByGuid(db: D1Database, guid: string): Promise<Episode | null> {
    const result = await db.prepare("SELECT * FROM episodes WHERE guid = ?")
        .bind(guid)
        .first<Episode>()
    return result ?? null
}

export async function findGuidsByTitles(db: D1Database, titles: string[]): Promise<Map<string, string>> {
    if (titles.length === 0) {
        return new Map()
    }
    const placeholders = titles.map(() => "?").join(", ")
    const result = await db.prepare(
        `SELECT guid, title FROM episodes WHERE title IN (${placeholders})`
    ).bind(...titles).all<{ guid: string; title: string }>()
    return new Map(result.results.map((row) => [row.title, row.guid]))
}

export async function insertEpisode(db: D1Database, episode: Episode): Promise<void> {
    await db.prepare(
        `INSERT INTO episodes (guid, title, description, published_at, duration, thumbnail_url, category_id, season, episode_number)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        episode.guid,
        episode.title,
        episode.description,
        episode.published_at,
        episode.duration,
        episode.thumbnail_url,
        episode.category_id,
        episode.season,
        episode.episode_number,
    ).run()
}

export async function bulkInsertEpisodes(db: D1Database, episodes: Episode[]): Promise<void> {
    if (episodes.length === 0) {
        return
    }
    const statements = episodes.map((episode) =>
        db.prepare(
            `INSERT OR REPLACE INTO episodes
             (guid, title, description, published_at, duration, thumbnail_url, category_id, season, episode_number)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            episode.guid,
            episode.title,
            episode.description,
            episode.published_at,
            episode.duration,
            episode.thumbnail_url,
            episode.category_id,
            episode.season,
            episode.episode_number,
        )
    )
    await db.batch(statements)
}

export type AdjacentEpisodes = {
    prev: Episode | null
    next: Episode | null
}

export async function findAdjacentEpisodes(db: D1Database, currentGuid: string): Promise<AdjacentEpisodes> {
    const episodes = await listEpisodes(db)
    const index = episodes.findIndex((ep) => ep.guid === currentGuid)
    if (index === -1) {
        return { prev: null, next: null }
    }
    return {
        next: index > 0 ? episodes[index - 1] : null,
        prev: index < episodes.length - 1 ? episodes[index + 1] : null,
    }
}

export async function findEpisodeWithPlatforms(db: D1Database, episode_id: string): Promise<PlatformEpisode | null> {
    const result = await db.prepare(`
        SELECT *
        FROM episodes e
        INNER JOIN episode_platforms ep ON e.guid = ep.episode_id
        INNER JOIN platforms p ON p.id = ep.platform_id
        WHERE e.guid = ?
    `).bind(episode_id).all<EpisodeRow>()

    if (result.results.length === 0) {
        return null
    }

    const first = result.results[0]
    return {
        episode: {
            guid: first.guid,
            title: first.title,
            description: first.description,
            published_at: first.published_at,
            duration: first.duration,
            thumbnail_url: first.thumbnail_url,
            category_id: first.category_id,
            season: first.season,
            episode_number: first.episode_number,
        },
        platforms: result.results.map((row) => ({
            name: row.name,
            icon_url: row.icon_url,
            url: row.url,
        })),
    }
}