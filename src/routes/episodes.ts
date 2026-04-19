import { Hono } from 'hono'
import {Episode} from "../models/db/episode";
import {Platform} from "../models/api/platform";

const episodes = new Hono<{ Bindings: CloudflareBindings }>()

type EpisodeRow = {
  guid: string
  title: string
  description: string
  published_at: string
  duration: string
  thumbnail_url: string
  name: string
  icon_url: string
  url: string
}

type PlatformEpisode = {
  episode: Episode
  platforms: Platform[]
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
  
  const firstResult = result.results[0]
  const platformEpisode: PlatformEpisode = {
    episode: {
      guid: firstResult.guid,
      title: firstResult.title,
      description: firstResult.description,
      published_at: firstResult.published_at,
      duration: firstResult.duration,
      thumbnail_url: firstResult.thumbnail_url,
    },
    platforms: [],
  }
  for (const row of result.results) {
    platformEpisode.platforms.push({ name: row.name, icon_url: row.icon_url, url: row.url })
  }
  
  return c.json(platformEpisode)
})

export default episodes