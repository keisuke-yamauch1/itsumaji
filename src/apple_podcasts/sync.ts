import {fetchApplePodcastEpisodes} from "./episodes";
import {PLATFORM_IDS} from "../constants/platforms";

export async function syncApplePodcasts(env: CloudflareBindings): Promise<void> {
    const episodes = await fetchApplePodcastEpisodes()

    const titles = episodes.map(e => e.trackName)
    const placeholders = titles.map(() => "?").join(", ")
    const rows = await env.DB.prepare(
        `SELECT guid, title FROM episodes WHERE title IN (${placeholders})`
    ).bind(...titles).all<{ guid: string; title: string }>()

    const guidByTitle = new Map(rows.results.map(r => [r.title, r.guid]))

    const statements = episodes
        .filter(episode => guidByTitle.has(episode.trackName))
        .map(episode =>
            env.DB.prepare(
                `INSERT OR IGNORE INTO episode_platforms (episode_id, platform_id, url) VALUES (?, ?, ?)`
            ).bind(guidByTitle.get(episode.trackName), PLATFORM_IDS.APPLE_PODCASTS, episode.trackViewUrl)
        )

    await env.DB.batch(statements)
}