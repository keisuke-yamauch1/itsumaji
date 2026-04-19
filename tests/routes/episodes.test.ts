import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import episodes from '../../src/routes/episodes'

function mockDb(result: { results: unknown[] }): D1Database {
  const stmt = {
    bind: () => stmt,
    all: async () => result,
  }
  return {
    prepare: () => stmt,
  } as unknown as D1Database
}

function createApp(db: D1Database) {
  const app = new Hono<{ Bindings: CloudflareBindings }>()
  app.route('/episodes', episodes)
  return app
}

describe('GET /episodes', () => {
  it('episodes を配列で返す', async () => {
    const db = mockDb({
      results: [
        { guid: 'g1', title: 't1', description: 'd1', published_at: '2026-04-01', duration: '00:10:00', thumbnail_url: 'https://example.com/1.jpg' },
        { guid: 'g2', title: 't2', description: 'd2', published_at: '2026-04-02', duration: '00:20:00', thumbnail_url: 'https://example.com/2.jpg' },
      ],
    })
    const app = createApp(db)
    const res = await app.request('/episodes', {}, { DB: db } as CloudflareBindings)

    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{ guid: string }>
    expect(body).toHaveLength(2)
    expect(body[0].guid).toBe('g1')
    expect(body[1].guid).toBe('g2')
  })

  it('episodes が 0 件なら空配列を返す', async () => {
    const db = mockDb({ results: [] })
    const app = createApp(db)
    const res = await app.request('/episodes', {}, { DB: db } as CloudflareBindings)

    expect(res.status).toBe(200)
    const body = (await res.json()) as unknown[]
    expect(body).toEqual([])
  })
})

describe('GET /episodes/:id', () => {
  it('該当 guid の episode と platforms を返す', async () => {
    const rows = [
      {
        guid: 'g1', title: 't1', description: 'd1', published_at: '2026-04-01',
        duration: '00:10:00', thumbnail_url: 'https://example.com/1.jpg',
        name: 'LISTEN', icon_url: 'https://listen.style/logo.svg', url: 'https://listen.style/ep1',
      },
      {
        guid: 'g1', title: 't1', description: 'd1', published_at: '2026-04-01',
        duration: '00:10:00', thumbnail_url: 'https://example.com/1.jpg',
        name: 'Spotify', icon_url: 'https://spotify.com/logo.svg', url: 'https://spotify.com/ep1',
      },
    ]
    const db = mockDb({ results: rows })
    const app = createApp(db)
    const res = await app.request('/episodes/g1', {}, { DB: db } as CloudflareBindings)

    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      episode: { guid: string; title: string }
      platforms: Array<{ name: string; icon_url: string; url: string }>
    }
    expect(body.episode.guid).toBe('g1')
    expect(body.episode.title).toBe('t1')
    expect(body).not.toHaveProperty('episode.url')
    expect(body.platforms).toHaveLength(2)
    expect(body.platforms[0]).toEqual({
      name: 'LISTEN',
      icon_url: 'https://listen.style/logo.svg',
      url: 'https://listen.style/ep1',
    })
    expect(body.platforms[1]).toEqual({
      name: 'Spotify',
      icon_url: 'https://spotify.com/logo.svg',
      url: 'https://spotify.com/ep1',
    })
  })

  it('存在しない guid の場合は 404 を返す', async () => {
    const db = mockDb({ results: [] })
    const app = createApp(db)
    const res = await app.request('/episodes/nonexistent', {}, { DB: db } as CloudflareBindings)

    expect(res.status).toBe(404)
    const body = (await res.json()) as { error: string }
    expect(body.error).toBe('Not Found')
  })
})