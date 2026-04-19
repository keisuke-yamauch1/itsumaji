import type { FC } from 'hono/jsx'
import type { Episode } from '../models/db/episode'
import { Layout } from './layout'

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function formatPublishedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return dateFormatter.format(date)
}

export const Home: FC<{ episodes: Episode[] }> = ({ episodes }) => (
  <Layout title="いつまじラジオ｜いつもの雑談、まじめな技術">
    <div class="section-head">
      <h2>エピソード一覧</h2>
      {episodes.length > 0 && <span class="count">全 {episodes.length} 本</span>}
    </div>
    {episodes.length === 0 ? (
      <p class="empty">まだエピソードがありません</p>
    ) : (
      <ul class="episode-grid">
        {episodes.map((ep) => (
          <li class="episode-card">
            <a href={`/episodes/${encodeURIComponent(ep.guid)}`}>
              <div class="thumb-wrap">
                <img class="thumb" src={ep.thumbnail_url} alt="" loading="lazy" />
              </div>
              <div class="episode-body">
                <time dateTime={ep.published_at}>{formatPublishedAt(ep.published_at)}</time>
                <h3>{ep.title}</h3>
                <span class="duration-badge">{ep.duration}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    )}
  </Layout>
)