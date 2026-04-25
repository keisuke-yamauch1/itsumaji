export async function getSpotifyToken(env: CloudflareBindings): Promise<string> {
    const credentials = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${credentials}`
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json() as { access_token: string };
    return data.access_token;
}
