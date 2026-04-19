import { Hono } from 'hono'
import { findEpisodeWithPlatforms, listEpisodes } from '../repositories/episodes'
import { Home } from '../views/home'
import { EpisodeDetail } from '../views/episode_detail'

const pages = new Hono<{ Bindings: CloudflareBindings }>()

pages.get('/', async (c) => {
  const episodes = await listEpisodes(c.env.DB)
  return c.html(<Home episodes={episodes} />)
})

pages.get('/episodes/:guid', async (c) => {
  const episode = await findEpisodeWithPlatforms(c.env.DB, c.req.param('guid'))
  if (episode === null) {
    return c.notFound()
  }
  return c.html(<EpisodeDetail data={episode} />)
})

export default pages