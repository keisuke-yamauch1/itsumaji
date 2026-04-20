import { Hono } from 'hono'
import { findAdjacentEpisodes, findEpisodeWithPlatforms, listEpisodes } from '../repositories/episodes'
import { Home } from '../views/home'
import { EpisodeDetail } from '../views/episode_detail'
import { About } from '../views/about'

const pages = new Hono<{ Bindings: CloudflareBindings }>()

pages.get('/', async (c) => {
  const episodes = await listEpisodes(c.env.DB)
  return c.html(<Home episodes={episodes} />)
})

pages.get('/about', async (c) => {
  const episodes = await listEpisodes(c.env.DB)
  return c.html(<About episodes={episodes} />)
})

pages.get('/episodes/:guid', async (c) => {
  const guid = c.req.param('guid')
  const [episode, neighbors] = await Promise.all([
    findEpisodeWithPlatforms(c.env.DB, guid),
    findAdjacentEpisodes(c.env.DB, guid),
  ])
  if (episode === null) {
    return c.notFound()
  }
  return c.html(<EpisodeDetail data={episode} neighbors={neighbors} />)
})

export default pages