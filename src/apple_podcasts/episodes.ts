type ApplePodcastEpisode = {
    wrapperType: "podcastEpisode"
    trackName: string
    trackViewUrl: string
}

type ItunesResult = ApplePodcastEpisode | { wrapperType: "collection" }

export async function fetchApplePodcastEpisodes(): Promise<ApplePodcastEpisode[]> {
    const response = await fetch(
        "https://itunes.apple.com/lookup?id=1871831407&entity=podcastEpisode&limit=200"
    )

    if (!response.ok) {
        throw new Error(`Apple Podcasts fetch failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as { results: ItunesResult[] }

    return data.results.filter(
        (r): r is ApplePodcastEpisode => r.wrapperType === "podcastEpisode"
    )
}