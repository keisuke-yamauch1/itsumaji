import {parseRss} from "./parser";
import {PLATFORM_IDS} from "../constants/platforms";

export
async function syncRss(env: CloudflareBindings) {
    const response = await fetch("https://rss.listen.style/p/itsumaji-radio/rss")

    if (!response.ok) {
        throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`)
    }

    const xml = await response.text()
    const rssEpisodes = parseRss(xml)

    if (rssEpisodes.length === 0) {
        return
    }

    const episodeStatements = rssEpisodes.map((rssEpisode) =>
        env.DB.prepare(`INSERT OR IGNORE INTO episodes
       (guid, title, description, published_at, duration, thumbnail_url, category_id, season, episode_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(rssEpisode.episode.guid, rssEpisode.episode.title, rssEpisode.episode.description, rssEpisode.episode.published_at, rssEpisode.episode.duration, rssEpisode.episode.thumbnail_url, rssEpisode.episode.category_id, rssEpisode.episode.season, rssEpisode.episode.episode_number)
    )

    const platformStatements = rssEpisodes.map((rssEpisode) =>
        env.DB.prepare(`INSERT OR IGNORE INTO episode_platforms (episode_id, platform_id, url) VALUES (?, ?, ?)`)
            .bind(rssEpisode.episode.guid, PLATFORM_IDS.LISTEN, rssEpisode.url)
    )

    await env.DB.batch([...episodeStatements, ...platformStatements])
}