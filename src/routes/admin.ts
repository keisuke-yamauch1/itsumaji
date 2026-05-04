import { Hono } from 'hono'
import { syncRss } from '../rss/sync'
import { syncSpotify } from '../spotify/sync'
import { syncApplePodcasts } from '../apple_podcasts/sync'
import { notifyError } from '../discord'
import { findEpisodeByGuid } from '../repositories/episodes'
import { insertEpisodePlatform } from '../repositories/episode_platforms'

const admin = new Hono<{ Bindings: CloudflareBindings }>()

admin.use('/*', async (c, next) => {
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token || token !== c.env.ADMIN_TOKEN) {
        return c.json({ ok: false, error: 'unauthorized' }, 401)
    }
    await next()
})

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
    const body = await c.req.json<{ guid: string; platform_id: number; url: string }>()
    const { guid, platform_id, url } = body

    if (!guid || !platform_id || !url) {
        return c.json({ ok: false, error: 'guid, platform_id, url are required' }, 400)
    }

    const episode = await findEpisodeByGuid(c.env.DB, guid)
    if (!episode) {
        return c.json({ ok: false, error: 'episode not found' }, 404)
    }

    await insertEpisodePlatform(c.env.DB, episode.guid, platform_id, url)
    return c.json({ ok: true })
})

export default admin