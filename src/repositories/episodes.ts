import {Episode} from "../models/db/episode";
import {PlatformEpisode} from "../models/api/platform_episode";

type EpisodeRow = {
    guid: string
    title: string
    description: string
    published_at: string
    duration: string
    thumbnail_url: string
    name: string
    icon_url: string
    url: string
}

export async function listEpisodes(db: D1Database): Promise<Episode[]> {
    const result = await db.prepare("SELECT * FROM episodes ORDER BY published_at DESC").all<Episode>()
    return result.results
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
        },
        platforms: result.results.map((row) => ({
            name: row.name,
            icon_url: row.icon_url,
            url: row.url,
        })),
    }
}