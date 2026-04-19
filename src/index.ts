import { Hono } from 'hono'
import episodes from './routes/episodes'
import {parseRss} from "./rss/parser";

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

async function syncRss(env: CloudflareBindings) {
  const response = await fetch("https://rss.listen.style/p/itsumaji-radio/rss")
  const xml = await response.text()
  const episodes = parseRss(xml)

  const statements = episodes.map((episode) => {
    return env.itsumaji_db.prepare(
        `INSERT OR IGNORE INTO episodes
       (guid, title, description, published_at, duration, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(episode.guid, episode.title, episode.description, episode.published_at, episode.duration, episode.thumbnail_url)
  })
  await env.itsumaji_db.batch(statements)
}
