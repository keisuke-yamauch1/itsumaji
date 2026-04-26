export type EpisodePlatformRow = {
    episodeId: string
    platformId: number
    url: string
}

export async function insertEpisodePlatform(
    db: D1Database,
    episodeId: string,
    platformId: number,
    url: string,
): Promise<void> {
    await db.prepare(
        'INSERT OR IGNORE INTO episode_platforms (episode_id, platform_id, url) VALUES (?, ?, ?)'
    ).bind(episodeId, platformId, url).run()
}

export async function bulkInsertEpisodePlatforms(
    db: D1Database,
    rows: EpisodePlatformRow[],
): Promise<void> {
    if (rows.length === 0) {
        return
    }
    const statements = rows.map((row) =>
        db.prepare(
            'INSERT OR IGNORE INTO episode_platforms (episode_id, platform_id, url) VALUES (?, ?, ?)'
        ).bind(row.episodeId, row.platformId, row.url)
    )
    await db.batch(statements)
}