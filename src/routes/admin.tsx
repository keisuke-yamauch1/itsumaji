import { Hono } from 'hono'
import { syncRss } from '../rss/sync'
import { syncSpotify } from '../spotify/sync'
import { syncApplePodcasts } from '../apple_podcasts/sync'
import { notifyError } from '../discord'
import { findEpisodeByGuid, insertEpisode, listEpisodes } from '../repositories/episodes'
import { insertEpisodePlatform } from '../repositories/episode_platforms'
import { Dashboard } from '../views/admin/dashboard'
import { EpisodeForm } from '../views/admin/episode_form'

const admin = new Hono<{ Bindings: CloudflareBindings }>()

admin.use('/*', async (c, next) => {
    // Cloudflare Access (UI経由) — CF Accessが設定されていればこのヘッダーを信頼する
    const cfEmail = c.req.header('Cf-Access-Authenticated-User-Email')
    if (cfEmail) {
        await next()
        return
    }
    // Bearer Token (既存API・curl・ローカル開発用)
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

// ダッシュボード
admin.get('/', async (c) => {
    const episodes = await listEpisodes(c.env.DB)
    const message = c.req.query('message')
    const error = c.req.query('error')
    return c.html(<Dashboard episodes={episodes} message={message} error={error} />)
})

// エピソード事前登録フォーム
admin.get('/episodes/new', (c) => {
    return c.html(<EpisodeForm />)
})

// エピソード事前登録処理
admin.post('/episodes', async (c) => {
    const body = await c.req.parseBody()
    const guid = String(body.guid ?? '').trim()
    const title = String(body.title ?? '').trim()
    const episodeNumberRaw = String(body.episode_number ?? '').trim()
    const categoryId = Number(body.category_id)
    const description = String(body.description ?? '').trim()
    const publishedAt = String(body.published_at ?? '').trim()
    const duration = String(body.duration ?? '').trim()

    if (!guid || !title || !episodeNumberRaw || !categoryId) {
        return c.html(<EpisodeForm error="guid・タイトル・EP番号・カテゴリは必須です" />, 400)
    }

    const episodeNumber = parseInt(episodeNumberRaw, 10)
    if (isNaN(episodeNumber)) {
        return c.html(<EpisodeForm error="EP番号は数値で入力してください" />, 400)
    }

    const existing = await findEpisodeByGuid(c.env.DB, guid)
    if (existing) {
        return c.html(<EpisodeForm error={`GUID "${guid}" は既に登録済みです`} />, 409)
    }

    await insertEpisode(c.env.DB, {
        guid,
        title,
        description,
        published_at: publishedAt || new Date().toISOString().slice(0, 10),
        duration: duration || '00:00:00',
        thumbnail_url: '',
        category_id: categoryId,
        season: null,
        episode_number: episodeNumber,
    })

    return c.redirect(`/admin?message=EP${episodeNumber}「${title}」を登録しました`)
})

admin.post('/sync/rss', async (c) => {
    await syncRss(c.env)
    const acceptsHtml = c.req.header('Accept')?.includes('text/html')
    if (acceptsHtml) return c.redirect('/admin?message=RSS同期が完了しました')
    return c.json({ ok: true })
})

admin.post('/sync/spotify', async (c) => {
    await syncSpotify(c.env)
    const acceptsHtml = c.req.header('Accept')?.includes('text/html')
    if (acceptsHtml) return c.redirect('/admin?message=Spotify同期が完了しました')
    return c.json({ ok: true })
})

admin.post('/sync/apple-podcasts', async (c) => {
    await syncApplePodcasts(c.env)
    const acceptsHtml = c.req.header('Accept')?.includes('text/html')
    if (acceptsHtml) return c.redirect('/admin?message=Apple Podcasts同期が完了しました')
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
