import { Hono } from 'hono'
import episodes from './routes/episodes'
import pages from './routes/pages'
import {syncRss} from "./rss/sync";

const app = new Hono<{ Bindings: CloudflareBindings}>()

app.route('/', pages)
app.route('/episodes', episodes)

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledController, env: CloudflareBindings, ctx: ExecutionContext) {
    ctx.waitUntil(syncRss(env))
  }
}

