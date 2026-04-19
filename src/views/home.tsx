import type { FC } from 'hono/jsx'
import type { Episode } from '../models/db/episode'
import { Layout } from './layout'
import { formatDate, formatEpisodeNumber, parseTitle } from '../utils/episode_title'

const RSS_URL = 'https://rss.listen.style/p/itsumaji-radio/rss'

function buildBadge(episodes: Episode[]): string | undefined {
  const numbers = episodes
    .map((ep) => parseTitle(ep.title).number)
    .filter((n): n is number => n !== null)
  if (numbers.length === 0) return undefined
  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  return `EP.${formatEpisodeNumber(min)} – EP.${formatEpisodeNumber(max)}`
}

export const Home: FC<{ episodes: Episode[] }> = ({ episodes }) => (
  <Layout
    title="いつまじラジオ｜いつもの雑談、まじめな技術"
    badge={buildBadge(episodes)}
  >
    <a class="rss-link" href={RSS_URL} target="_blank" rel="noopener noreferrer">
      <svg class="rss-link__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.18 15.64a2.18 2.18 0 012.18 2.18C8.36 19 7.38 20 6.18 20A2.18 2.18 0 014 17.82a2.18 2.18 0 012.18-2.18zM4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44zm0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93V10.1z"/>
      </svg>
      <span>RSS</span>
    </a>

    <div class="section-header">
      <div class="section-header__marker" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <h2 class="section-header__title">エピソード</h2>
      <span class="section-header__count">全 {episodes.length} 本</span>
      <div class="section-header__rule" aria-hidden="true"></div>
    </div>

    {episodes.length === 0 ? (
      <p class="episodes-empty">まだエピソードがありません</p>
    ) : (
      <ul class="episodes">
        {episodes.map((ep) => {
          const parsed = parseTitle(ep.title)
          return (
            <li>
              <a
                class={`episode episode--${parsed.category}`}
                href={`/episodes/${encodeURIComponent(ep.guid)}`}
              >
                <div class="episode__meta">
                  <span class={`episode__tag episode__tag--${parsed.category}`}>
                    {parsed.categoryLabel}
                  </span>
                  <time class="episode__date" dateTime={ep.published_at}>
                    {formatDate(ep.published_at)}
                  </time>
                  <span class="episode__duration">{ep.duration}</span>
                </div>
                <p class="episode__title">
                  {parsed.cleanTitle}
                  {parsed.number !== null && (
                    <span class="episode__number">#{parsed.number}</span>
                  )}
                </p>
              </a>
            </li>
          )
        })}
      </ul>
    )}
  </Layout>
)