import {parseRss} from "./parser";
import {PLATFORM_IDS} from "../constants/platforms";
import {bulkInsertEpisodes} from "../repositories/episodes";
import {bulkInsertEpisodePlatforms} from "../repositories/episode_platforms";

export async function syncRss(env: CloudflareBindings) {
    const response = await fetch("https://rss.listen.style/p/itsumaji-radio/rss")

    if (!response.ok) {
        throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`)
    }

    const xml = await response.text()
    const rssEpisodes = parseRss(xml)

    if (rssEpisodes.length === 0) {
        return
    }

    await bulkInsertEpisodes(env.DB, rssEpisodes.map((rssEpisode) => rssEpisode.episode))
    await bulkInsertEpisodePlatforms(env.DB, rssEpisodes.map((rssEpisode) => ({
        episodeId: rssEpisode.episode.guid,
        platformId: PLATFORM_IDS.LISTEN,
        url: rssEpisode.url,
    })))
}
