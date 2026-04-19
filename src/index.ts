import { Hono } from 'hono'
import pages from './routes/pages'
import {syncRss} from "./rss/sync";

const app = new Hono<{ Bindings: CloudflareBindings}>()

app.route('/', pages)

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledController, env: CloudflareBindings, ctx: ExecutionContext) {
    ctx.waitUntil(syncRss(env))
  }
}

