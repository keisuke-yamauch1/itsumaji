import { Hono } from 'hono'
import {findEpisodeWithPlatforms, listEpisodes} from "../repositories/episodes";

const episodes = new Hono<{ Bindings: CloudflareBindings }>()

episodes.get('/', async (c) => {
  const result = await listEpisodes(c.env.DB)
  return c.json(result)
})

episodes.get('/:id', async (c) => {
  const episode = await findEpisodeWithPlatforms(c.env.DB, c.req.param('id'))
  if (episode === null) {
    return c.json({error: 'Not Found'}, 404)
  }
  return c.json(episode)
})

export default episodes