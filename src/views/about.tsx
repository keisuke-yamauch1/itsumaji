import type { FC } from 'hono/jsx'
import type { Episode } from '../models/db/episode'
import { Layout } from './layout'
import { CATEGORY_IDS } from '../constants/categories'

export const About: FC<{ episodes: Episode[] }> = ({ episodes }) => {
  const zCount = episodes.filter((e) => e.category_id === CATEGORY_IDS.ZATSUDAN).length
  const gCount = episodes.filter((e) => e.category_id === CATEGORY_IDS.TECH).length

  return (
    <Layout
      title="番組について — いつまじラジオ"
      variant="about"
    >
      <div class="about-hero">
        <h2 class="about-heading">
          いつもの<span class="accent--zatsu">雑談</span>、まじめな<span class="accent--gijutsu">技術</span>
        </h2>
        <p class="about-lead">
          「いつもの<span class="accent--zatsu">雑談</span>、まじめな<span class="accent--gijutsu">技術</span>」略していつまじラジオです。
          福岡県で医療系のITエンジニアをしているJと上原が普段の学びを話したり、好きに雑談をするポッドキャストです。
        </p>
        <p class="about-lead">
          毎週日曜日更新です。
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
        <div class="host-card host-card--a">
          <div class="host-card__name">
            J／けちーん
            <a class="host-card__x-link" href="https://x.com/kechiiin_" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.737-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
          <div class="host-card__role">HOST / ENGINEER</div>
          <p class="host-card__bio">1991/03/21生まれ、北海道出身。ソフトウェアエンジニア</p>
        </div>
        <div class="host-card host-card--b">
          <div class="host-card__name">
            上原
            <a class="host-card__x-link" href="https://x.com/fumiya_uehara" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.737-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
          <div class="host-card__role">HOST / ENGINEERING MANAGER</div>
          <p class="host-card__bio">1992/05/15生まれ、鹿児島出身。エンジニアリングマネージャー</p>
        </div>
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