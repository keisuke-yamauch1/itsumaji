import { Hono } from 'hono'
import episodes from './routes/episodes'
import {syncRss} from "./rss/sync";

const app = new Hono<{ Bindings: CloudflareBindings}>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.route('/episodes', episodes)

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledController, env: CloudflareBindings, ctx: ExecutionContext) {
    ctx.waitUntil(syncRss(env))
  }
}

