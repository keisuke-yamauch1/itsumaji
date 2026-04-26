import {fetchApplePodcastEpisodes} from "./episodes";
import {PLATFORM_IDS} from "../constants/platforms";
import {findGuidsByTitles} from "../repositories/episodes";
import {bulkInsertEpisodePlatforms} from "../repositories/episode_platforms";

export async function syncApplePodcasts(env: CloudflareBindings): Promise<void> {
    const episodes = await fetchApplePodcastEpisodes()

    const guidByTitle = await findGuidsByTitles(env.DB, episodes.map(e => e.trackName))

    const rows = episodes
        .filter(episode => guidByTitle.has(episode.trackName))
        .map(episode => ({
            episodeId: guidByTitle.get(episode.trackName)!,
            platformId: PLATFORM_IDS.APPLE_PODCASTS,
            url: episode.trackViewUrl,
        }))

    await bulkInsertEpisodePlatforms(env.DB, rows)
}
