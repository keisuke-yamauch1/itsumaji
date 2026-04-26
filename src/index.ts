import { Hono } from 'hono'
import pages from './routes/pages'
import admin from './routes/admin'
import {syncRss} from "./rss/sync";
import {syncSpotify} from "./spotify/sync";
import {syncApplePodcasts} from "./apple_podcasts/sync";
import {runWithNotify} from "./discord";

const app = new Hono<{ Bindings: CloudflareBindings}>()

app.route('/', pages)
app.route('/admin', admin)

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledController, env: CloudflareBindings, ctx: ExecutionContext) {
    if (event.cron === "0 0 * * SUN") {
      ctx.waitUntil(runWithNotify("RSS sync", () => syncRss(env), env.DISCORD_WEBHOOK_URL))
    } else if (event.cron === "0 1 * * SUN") {
      ctx.waitUntil(runWithNotify("Spotify sync", () => syncSpotify(env), env.DISCORD_WEBHOOK_URL))
      ctx.waitUntil(runWithNotify("Apple Podcasts sync", () => syncApplePodcasts(env), env.DISCORD_WEBHOOK_URL))
    }
  }
}