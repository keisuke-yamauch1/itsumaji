import { Hono } from 'hono'
import episodes from './routes/episodes'

const app = new Hono<{ Bindings: CloudflareBindings}>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.route('/episodes', episodes)

export default app
