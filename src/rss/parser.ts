import {Episode} from "../models/db/episode";
import {XMLParser} from "fast-xml-parser";
import {PlatformEpisode} from "../models/api/platform_episode";

type RssItem = {
    guid: { "#text": string, isPermalink: "false" }
    title: string
    description: string
    pubDate: string
    link: string
    "itunes:duration": string
    "itunes:image": { href: string }
}

export function parseRss(xml: string): PlatformEpisode[] {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        isArray: (tagName) => tagName === 'item',
    })

    const parsed = parser.parse(xml)
    const items: RssItem[] = parsed.rss.channel.item

    return items.map((item: RssItem): PlatformEpisode => {
        return {
            episode: {
                guid: item.guid["#text"],
                title: item.title,
                description: item.description,
                published_at: item.pubDate,
                duration: item["itunes:duration"],
                thumbnail_url: item["itunes:image"].href,
                url: item.link,
            },
            platforms: [
                { name: "Listen Style", icon_url: "https://listen.style/favicon.ico", url: item.link }
            ]
        }
    })
}