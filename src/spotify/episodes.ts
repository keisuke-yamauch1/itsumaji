type SpotifyEpisode = {
    id: string
    name: string
}

export async function fetchSpotifyEpisodes(token: string): Promise<SpotifyEpisode[]> {
    const response = await fetch("https://api.spotify.com/v1/shows/7wnK0m81hAeA29zn9R9GVj/episodes?market=JP&limit=50", {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Spotify episodes fetch failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as { items: SpotifyEpisode[] }
    return data.items;
}
