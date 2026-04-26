import { Hono } from 'hono'
import { syncRss } from '../rss/sync'
import { syncSpotify } from '../spotify/sync'

const admin = new Hono<{ Bindings: CloudflareBindings }>()

admin.post('/sync/rss', async (c) => {
    await syncRss(c.env)
    return c.json({ ok: true })
})

admin.post('/sync/spotify', async (c) => {
    await syncSpotify(c.env)
    return c.json({ ok: true })
})

export default admin