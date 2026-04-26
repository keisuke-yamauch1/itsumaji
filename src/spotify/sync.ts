import {getSpotifyToken} from "./auth";
import {fetchSpotifyEpisodes} from "./episodes";
import {PLATFORM_IDS} from "../constants/platforms";
import {findGuidsByTitles} from "../repositories/episodes";
import {bulkInsertEpisodePlatforms} from "../repositories/episode_platforms";

export async function syncSpotify(env: CloudflareBindings): Promise<void> {
    const token = await getSpotifyToken(env);
    const episodes = await fetchSpotifyEpisodes(token);

    const guidByTitle = await findGuidsByTitles(env.DB, episodes.map(e => e.name))

    const rows = episodes
        .filter(episode => guidByTitle.has(episode.name))
        .map(episode => ({
            episodeId: guidByTitle.get(episode.name)!,
            platformId: PLATFORM_IDS.SPOTIFY,
            url: `https://open.spotify.com/episode/${episode.id}`,
        }))

    await bulkInsertEpisodePlatforms(env.DB, rows)
}
