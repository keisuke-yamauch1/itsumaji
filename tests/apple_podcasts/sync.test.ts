import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest'
import { env, fetchMock } from 'cloudflare:test'
import { syncApplePodcasts } from '../../src/apple_podcasts/sync'
import { PLATFORM_IDS } from '../../src/constants/platforms'
import { CATEGORY_IDS } from '../../src/constants/categories'

const ITUNES_ORIGIN = 'https://itunes.apple.com'
const ITUNES_PATH = '/lookup?id=1871831407&entity=podcastEpisode&limit=200'

type ItunesResult =
  | { wrapperType: 'podcastEpisode'; trackName: string; trackViewUrl: string }
  | { wrapperType: 'collection' }

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

function interceptLookup(results: ItunesResult[], times = 1) {
  fetchMock
    .get(ITUNES_ORIGIN)
    .intercept({ path: ITUNES_PATH })
    .reply(200, { results }, { headers: { 'Content-Type': 'application/json' } })
    .times(times)
}

async function insertEpisode(guid: string, title: string) {
  await env.DB.prepare(
    `INSERT INTO episodes (guid, title, description, published_at, duration, thumbnail_url, category_id, season, episode_number)
     VALUES (?, ?, '', '2026-04-01', '00:10:00', '', ?, NULL, 0)`
  ).bind(guid, title, CATEGORY_IDS.TECH).run()
}

describe('syncApplePodcasts', () => {
  it('title が一致するエピソードのみ episode_platforms に trackViewUrl が登録される', async () => {
    await insertEpisode('guid-1', 'Hono 入門')
    await insertEpisode('guid-2', 'TypeScript の話')

    interceptLookup([
      { wrapperType: 'collection' },
      { wrapperType: 'podcastEpisode', trackName: 'Hono 入門', trackViewUrl: 'https://podcasts.apple.com/ep1' },
      { wrapperType: 'podcastEpisode', trackName: 'TypeScript の話', trackViewUrl: 'https://podcasts.apple.com/ep2' },
      { wrapperType: 'podcastEpisode', trackName: 'マッチしないタイトル', trackViewUrl: 'https://podcasts.apple.com/ep3' },
    ])

    await syncApplePodcasts(env)

    const platforms = await env.DB
      .prepare('SELECT episode_id, platform_id, url FROM episode_platforms ORDER BY episode_id')
      .all<{ episode_id: string; platform_id: number; url: string }>()
    expect(platforms.results).toEqual([
      {
        episode_id: 'guid-1',
        platform_id: PLATFORM_IDS.APPLE_PODCASTS,
        url: 'https://podcasts.apple.com/ep1',
      },
      {
        episode_id: 'guid-2',
        platform_id: PLATFORM_IDS.APPLE_PODCASTS,
        url: 'https://podcasts.apple.com/ep2',
      },
    ])
  })

  it('一致するエピソードが無いときは episode_platforms に何も入らない', async () => {
    await insertEpisode('guid-1', '保存済みタイトル')

    interceptLookup([
      { wrapperType: 'podcastEpisode', trackName: '別のタイトル', trackViewUrl: 'https://podcasts.apple.com/ep1' },
    ])

    await syncApplePodcasts(env)

    const count = await env.DB
      .prepare('SELECT COUNT(*) as c FROM episode_platforms')
      .first<{ c: number }>()
    expect(count?.c).toBe(0)
  })

  it('同じエピソードを再度 sync しても重複しない', async () => {
    await insertEpisode('guid-1', 'Hono 入門')

    interceptLookup(
      [{ wrapperType: 'podcastEpisode', trackName: 'Hono 入門', trackViewUrl: 'https://podcasts.apple.com/ep1' }],
      2,
    )

    await syncApplePodcasts(env)
    await syncApplePodcasts(env)

    const count = await env.DB
      .prepare('SELECT COUNT(*) as c FROM episode_platforms')
      .first<{ c: number }>()
    expect(count?.c).toBe(1)
  })
})
