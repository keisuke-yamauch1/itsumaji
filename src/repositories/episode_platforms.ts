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

export async function upsertEpisodePlatform(
    db: D1Database,
    episodeId: string,
    platformId: number,
    url: string,
): Promise<void> {
    await db.prepare(
        'INSERT OR REPLACE INTO episode_platforms (episode_id, platform_id, url) VALUES (?, ?, ?)'
    ).bind(episodeId, platformId, url).run()
}

export async function findEpisodePlatformUrl(
    db: D1Database,
    episodeId: string,
    platformId: number,
): Promise<string | null> {
    const row = await db.prepare(
        'SELECT url FROM episode_platforms WHERE episode_id = ? AND platform_id = ?'
    ).bind(episodeId, platformId).first<{ url: string }>()
    return row?.url ?? null
}

export async function listRegisteredPlatformsByGuid(
    db: D1Database,
): Promise<Map<string, Set<number>>> {
    const result = await db.prepare(
        'SELECT episode_id, platform_id FROM episode_platforms'
    ).all<{ episode_id: string; platform_id: number }>()
    const map = new Map<string, Set<number>>()
    for (const row of result.results) {
        if (!map.has(row.episode_id)) map.set(row.episode_id, new Set())
        map.get(row.episode_id)!.add(row.platform_id)
    }
    return map
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