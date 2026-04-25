import { Hono } from 'hono'
import pages from './routes/pages'
import {syncRss} from "./rss/sync";
import {syncSpotify} from "./spotify/sync";

const app = new Hono<{ Bindings: CloudflareBindings}>()

app.route('/', pages)

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledController, env: CloudflareBindings, ctx: ExecutionContext) {
    if (event.cron === "0 0 * * SUN") {
      ctx.waitUntil(syncRss(env))
    } else if (event.cron === "0 1 * * SUN") {
      ctx.waitUntil(syncSpotify(env))
    }
  }
}

