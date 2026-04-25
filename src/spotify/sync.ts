import {getSpotifyToken} from "./auth";
import {fetchSpotifyEpisodes} from "./episodes";
import {PLATFORM_IDS} from "../constants/platforms";

export async function syncSpotify(env: CloudflareBindings): Promise<void> {
    const token = await getSpotifyToken(env);
    const episodes = await fetchSpotifyEpisodes(token);

    const titles = episodes.map(e => e.name)
    const placeholders = titles.map(() => "?").join(", ")
    const rows = await env.DB.prepare(
        `SELECT guid, title FROM episodes WHERE title IN (${placeholders})`
    ).bind(...titles).all<{ guid: string; title: string }>()

    const guidByTitle = new Map(rows.results.map(r => [r.title, r.guid]))

    const statements = episodes
        .filter(episode => guidByTitle.has(episode.name))
        .map(episode =>
            env.DB.prepare(
                `INSERT OR IGNORE INTO episode_platforms (episode_id, platform_id, url) VALUES (?, ?, ?)`
            ).bind(guidByTitle.get(episode.name), PLATFORM_IDS.SPOTIFY, `https://open.spotify.com/episode/${episode.id}`)
        )

    await env.DB.batch(statements);
}
