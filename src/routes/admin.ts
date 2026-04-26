import { Hono } from 'hono'
import { syncRss } from '../rss/sync'
import { syncSpotify } from '../spotify/sync'
import { syncApplePodcasts } from '../apple_podcasts/sync'
import { notifyError } from '../discord'

const admin = new Hono<{ Bindings: CloudflareBindings }>()

admin.onError((err, c) => {
    c.executionCtx.waitUntil(
        notifyError(c.env.DISCORD_WEBHOOK_URL, `${c.req.method} ${c.req.path}`, err)
    )
    return c.json({ ok: false, error: 'internal error' }, 500)
})

admin.post('/sync/rss', async (c) => {
    await syncRss(c.env)
    return c.json({ ok: true })
})

admin.post('/sync/spotify', async (c) => {
    await syncSpotify(c.env)
    return c.json({ ok: true })
})

admin.post('/sync/apple-podcasts', async (c) => {
    await syncApplePodcasts(c.env)
    return c.json({ ok: true })
})

// amazonのapiの登録が面倒なので、泣く泣く手動で登録するエンドポイントを作る
admin.post('/episode-platforms', async (c) => {
    const body = await c.req.json<{ episode_title: string; platform_id: number; url: string }>()
    const { episode_title, platform_id, url } = body

    if (!episode_title || !platform_id || !url) {
        return c.json({ ok: false, error: 'episode_title, platform_id, url are required' }, 400)
    }

    const episode = await c.env.DB.prepare(
        'SELECT guid FROM episodes WHERE title = ?'
    ).bind(episode_title.normalize('NFD')).first<{ guid: string }>()

    if (!episode) {
        return c.json({ ok: false, error: 'episode not found' }, 404)
    }

    await c.env.DB.prepare(
        'INSERT OR IGNORE INTO episode_platforms (episode_id, platform_id, url) VALUES (?, ?, ?)'
    ).bind(episode.guid, platform_id, url).run()

    return c.json({ ok: true })
})

export default admin