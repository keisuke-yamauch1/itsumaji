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
  const platformEpisodes = parseRss(xml)

  const episodeStatements = platformEpisodes.map((platformEpisode) =>
    env.itsumaji_db.prepare(`INSERT OR IGNORE INTO episodes
       (guid, title, description, published_at, duration, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(platformEpisode.episode.guid, platformEpisode.episode.title, platformEpisode.episode.description, platformEpisode.episode.published_at, platformEpisode.episode.duration, platformEpisode.episode.thumbnail_url)
  )

  const platformStatements = platformEpisodes.map((platformEpisode) =>
    env.itsumaji_db.prepare(`INSERT OR IGNORE INTO episode_platforms (episode_id, platform_id, url) VALUES (?, ?, ?)`)
        .bind(platformEpisode.episode.guid, 1, platformEpisode.episode.url)
  )

  await env.itsumaji_db.batch([...episodeStatements, ...platformStatements])
}
