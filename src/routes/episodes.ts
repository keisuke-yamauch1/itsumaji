import { Hono } from 'hono'

const episodes = new Hono<{ Bindings: CloudflareBindings }>()

episodes.get('/', async (c) => {
  const result = await c.env.itsumaji_db.prepare('SELECT * FROM episodes').all()
  return c.json(result.results)
})

export default episodes