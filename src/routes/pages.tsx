import { Hono } from 'hono'
import { listEpisodes } from '../repositories/episodes'
import { Home } from '../views/home'

const pages = new Hono<{ Bindings: CloudflareBindings }>()

pages.get('/', async (c) => {
  const episodes = await listEpisodes(c.env.DB)
  return c.html(<Home episodes={episodes} />)
})

export default pages