import type { FC } from 'hono/jsx'
import type { Episode } from '../models/db/episode'
import { Layout } from './layout'
import { formatDate, formatEpisodeNumber, parseTitle } from '../utils/episode_title'

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