import type { FC } from 'hono/jsx'
import { raw } from 'hono/html'
import type { PlatformEpisode } from '../models/api/platform_episode'
import { Layout } from './layout'
import { formatDate, formatEpisodeNumber, parseTitle } from '../utils/episode_title'

function toListenEmbedUrl(listenUrl: string): string {
  return `${listenUrl}/player?theme=auto`
}

export const EpisodeDetail: FC<{ data: PlatformEpisode }> = ({ data }) => {
  const { episode, platforms } = data
  const listen = platforms.find((p) => p.name === 'LISTEN')
  const parsed = parseTitle(episode.title)
  const badge = parsed.number !== null ? `EP.${formatEpisodeNumber(parsed.number)}` : undefined

  return (
    <Layout title={`${episode.title}｜いつまじラジオ`} badge={badge}>
      <article class="episode-detail">
        <p class="back-link">
          <a href="/">← エピソード一覧へ</a>
        </p>

        <header class="episode-detail-head">
          <img class="detail-thumb" src={episode.thumbnail_url} alt="" />
          <div class="detail-meta">
            <div class="detail-meta__top">
              <span class={`episode__tag episode__tag--${parsed.category}`}>
                {parsed.categoryLabel}
              </span>
              <time dateTime={episode.published_at}>{formatDate(episode.published_at)}</time>
              <span class="detail-meta__duration">{episode.duration}</span>
            </div>
            <h2>
              {parsed.cleanTitle}
              {parsed.number !== null && (
                <span class="detail-meta__number">#{parsed.number}</span>
              )}
            </h2>
          </div>
        </header>

        {listen && (
          <div class="player-wrap">
            <iframe
              src={toListenEmbedUrl(listen.url)}
              width="100%"
              height="178"
              frameborder="0"
              scrolling="no"
              title="音声プレーヤー"
            />
          </div>
        )}

        <section class="episode-description">{raw(episode.description)}</section>

        {platforms.length > 0 && (
          <section class="platform-links">
            <h3>配信プラットフォーム</h3>
            <ul>
              {platforms.map((p) => (
                <li>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <img src={p.icon_url} alt="" />
                    <span>{p.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </Layout>
  )
}