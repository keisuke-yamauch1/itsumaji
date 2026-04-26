import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest'
import { env, fetchMock } from 'cloudflare:test'
import { syncSpotify } from '../../src/spotify/sync'
import { PLATFORM_IDS } from '../../src/constants/platforms'
import { CATEGORY_IDS } from '../../src/constants/categories'

const TOKEN_ORIGIN = 'https://accounts.spotify.com'
const TOKEN_PATH = '/api/token'
const EPISODES_ORIGIN = 'https://api.spotify.com'
const EPISODES_PATH = '/v1/shows/7wnK0m81hAeA29zn9R9GVj/episodes?market=JP&limit=50'

beforeAll(() => {
  fetchMock.activate()
  fetchMock.disableNetConnect()
})

afterEach(() => {
  fetchMock.assertNoPendingInterceptors()
})

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM episode_platforms'),
    env.DB.prepare('DELETE FROM episodes'),
  ])
})

function interceptToken(times = 1) {
  fetchMock
    .get(TOKEN_ORIGIN)
    .intercept({ path: TOKEN_PATH, method: 'POST' })
    .reply(200, { access_token: 'test-token' }, { headers: { 'Content-Type': 'application/json' } })
    .times(times)
}

function interceptEpisodes(items: { id: string; name: string }[], times = 1) {
  fetchMock
    .get(EPISODES_ORIGIN)
    .intercept({ path: EPISODES_PATH })
    .reply(200, { items }, { headers: { 'Content-Type': 'application/json' } })
    .times(times)
}

async function insertEpisode(guid: string, title: string) {
  await env.DB.prepare(
    `INSERT INTO episodes (guid, title, description, published_at, duration, thumbnail_url, category_id, season, episode_number)
     VALUES (?, ?, '', '2026-04-01', '00:10:00', '', ?, NULL, 0)`
  ).bind(guid, title, CATEGORY_IDS.TECH).run()
}

describe('syncSpotify', () => {
  it('title が一致するエピソードのみ episode_platforms に Spotify URL が登録される', async () => {
    await insertEpisode('guid-1', 'Hono 入門')
    await insertEpisode('guid-2', 'TypeScript の話')

    interceptToken()
    interceptEpisodes([
      { id: 'spotify-id-1', name: 'Hono 入門' },
      { id: 'spotify-id-2', name: 'TypeScript の話' },
      { id: 'spotify-id-3', name: 'マッチしないタイトル' },
    ])

    await syncSpotify(env)

    const platforms = await env.DB
      .prepare('SELECT episode_id, platform_id, url FROM episode_platforms ORDER BY episode_id')
      .all<{ episode_id: string; platform_id: number; url: string }>()
    expect(platforms.results).toEqual([
      {
        episode_id: 'guid-1',
        platform_id: PLATFORM_IDS.SPOTIFY,
        url: 'https://open.spotify.com/episode/spotify-id-1',
      },
      {
        episode_id: 'guid-2',
        platform_id: PLATFORM_IDS.SPOTIFY,
        url: 'https://open.spotify.com/episode/spotify-id-2',
      },
    ])
  })

  it('一致するエピソードが無いときは episode_platforms に何も入らない', async () => {
    await insertEpisode('guid-1', '保存済みタイトル')

    interceptToken()
    interceptEpisodes([
      { id: 'spotify-id-1', name: '別のタイトル' },
    ])

    await syncSpotify(env)

    const count = await env.DB
      .prepare('SELECT COUNT(*) as c FROM episode_platforms')
      .first<{ c: number }>()
    expect(count?.c).toBe(0)
  })

  it('同じエピソードを再度 sync しても重複しない', async () => {
    await insertEpisode('guid-1', 'Hono 入門')

    interceptToken(2)
    interceptEpisodes([{ id: 'spotify-id-1', name: 'Hono 入門' }], 2)

    await syncSpotify(env)
    await syncSpotify(env)

    const count = await env.DB
      .prepare('SELECT COUNT(*) as c FROM episode_platforms')
      .first<{ c: number }>()
    expect(count?.c).toBe(1)
  })
})
