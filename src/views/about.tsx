import type { FC } from 'hono/jsx'
import type { Episode } from '../models/db/episode'
import { Layout } from './layout'
import { parseTitle } from '../utils/episode_title'

const HOSTS = [
  {
    id: 'a',
    initial: 'い',
    name: 'いつき',
    role: 'HOST / ENGINEER',
    bio: '普段はWebエンジニア。雑談パートを担当。サウナと本と自作キーボード沼の住人。',
  },
  {
    id: 'b',
    initial: 'ま',
    name: 'まじめ',
    role: 'HOST / ENGINEER',
    bio: '普段はインフラエンジニア。技術パートを担当。読書家で年間80冊目標。勉強会運営歴6年。',
  },
] as const

export const About: FC<{ episodes: Episode[] }> = ({ episodes }) => {
  const zCount = episodes.filter((e) => parseTitle(e.title).category === 'zatsu').length
  const gCount = episodes.filter((e) => parseTitle(e.title).category === 'gijutsu').length

  return (
    <Layout
      title="番組について — いつまじラジオ"
      variant="about"
    >
      <div class="about-hero">
        <h2 class="about-heading">
          いつもの<span class="accent--zatsu">雑談</span>、まじめな<span class="accent--gijutsu">技術</span>。
        </h2>
        <p class="about-lead">
          エンジニア二人が、その週にあったどうでもいい話と、ちょっとまじめな技術の話を交互にする番組です。毎週日曜の夜、だいたい30分〜50分。作業のおともに、散歩のおともに。
        </p>
      </div>

      <div class="section-header" style="margin-top: 40px;">
        <div class="section-header__marker" aria-hidden="true">
          <span></span><span></span>
        </div>
        <h2 class="section-header__title">パーソナリティ</h2>
        <div class="section-header__rule" aria-hidden="true"></div>
      </div>

      <div class="hosts-grid">
        {HOSTS.map((h) => (
          <div class={`host-card host-card--${h.id}`}>
            <div class="host-card__avatar">{h.initial}</div>
            <div class="host-card__name">{h.name}</div>
            <div class="host-card__role">{h.role}</div>
            <p class="host-card__bio">{h.bio}</p>
          </div>
        ))}
      </div>

      <div class="section-header" style="margin-top: 40px;">
        <div class="section-header__marker" aria-hidden="true">
          <span></span><span></span>
        </div>
        <h2 class="section-header__title">これまでの配信</h2>
        <div class="section-header__rule" aria-hidden="true"></div>
      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat__num">{episodes.length}</div>
          <div class="stat__label">EPISODES</div>
        </div>
        <div class="stat">
          <div class="stat__num stat__num--zatsu">{zCount}</div>
          <div class="stat__label">雑談</div>
        </div>
        <div class="stat">
          <div class="stat__num stat__num--gijutsu">{gCount}</div>
          <div class="stat__label">技術</div>
        </div>
      </div>
    </Layout>
  )
}