import {Episode} from "../db/episode";
import {Platform} from "./platform";

export type PlatformEpisode = {
    episode: Episode & { url: string }
    platforms: Platform[]
}