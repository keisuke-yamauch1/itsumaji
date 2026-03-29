import { Hono } from 'hono'

const episodes = new Hono<{ Bindings: CloudflareBindings }>()

type Episode = {
  guid: string
  title: string
  description: string
  published_at: string
  audio_url: string
}
type Platform = {
  name: string
  icon_url: string
  url: string
}
type EpisodeWithPlatforms = {
  episode: Episode
  platforms: Platform[]
}
type EpisodeRow = {
  guid: string
  title: string
  description: string
  published_at: string
  audio_url: string
  name: string
  icon_url: string
  url: string
}

episodes.get('/', async (c) => {
  const result = await c.env.itsumaji_db.prepare('SELECT * FROM episodes').all<Episode>()
  return c.json(result.results)
})

episodes.get('/:id', async (c) => {
  const episode_id = c.req.param('id')
  const result = await c.env.itsumaji_db.prepare(`
    SELECT *
    FROM episodes e
    INNER JOIN episode_platforms ep ON e.guid = ep.episode_id
    INNER JOIN platforms p ON p.id = ep.platform_id
    WHERE e.guid = ?
    `).bind(episode_id).all<EpisodeRow>()
  
  if (result.results.length === 0) {
    return c.json({error: 'Not Found'}, 404)
  }
  
  const first_row = result.results[0]
  const episode_with_platform: EpisodeWithPlatforms = {
    episode: {
      guid: first_row.guid,
      title: first_row.title,
      description: first_row.description,
      published_at: first_row.published_at,
      audio_url: first_row.audio_url,
    },
    platforms: []
  }
  for (const row of result.results) {
    episode_with_platform.platforms.push({ name: row.name, icon_url: row.icon_url, url: row.url })
  }
  
  return c.json(episode_with_platform)
})

export default episodes