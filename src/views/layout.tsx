import type { FC, Child } from 'hono/jsx'
import { raw } from 'hono/html'

const styles = `
  :root {
    --bg:          #ffffff;
    --bg-sub:      #f7f6f3;
    --surface:     #ffffff;
    --line:        #eae6df;
    --line-soft:   #f2efe8;

    --ink:         #1f1a15;
    --ink-muted:   #3a332c;
    --ink-subtle:  #6b6258;
    --ink-faint:   #a39a8e;
    --border:      #eae6df;
    --border-soft: #f2efe8;
    --bg-subtle:   #f7f6f3;

    --zatsu:      oklch(0.72 0.15 45);
    --zatsu-dark: oklch(0.48 0.15 38);
    --zatsu-bg:   oklch(0.94 0.05 50);

    --gijutsu:      oklch(0.65 0.12 240);
    --gijutsu-dark: oklch(0.45 0.12 240);
    --gijutsu-bg:   oklch(0.94 0.035 235);

    --radius-sm:   4px;
    --radius-md:   10px;
    --radius-lg:   14px;
    --radius-pill: 999px;

    --shadow-card: 0 1px 2px rgba(31,26,21,0.04), 0 6px 20px -12px rgba(31,26,21,0.08);

    --font-jp:    "Noto Sans JP", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --font-serif: "Noto Serif JP", "Hiragino Mincho ProN", serif;
    --font-mono:  "JetBrains Mono", ui-monospace, monospace;
  }

  .theme-zatsu {
    --accent:      var(--zatsu);
    --accent-dark: var(--zatsu-dark);
    --accent-bg:   var(--zatsu-bg);
  }
  .theme-gijutsu {
    --accent:      var(--gijutsu);
    --accent-dark: var(--gijutsu-dark);
    --accent-bg:   var(--gijutsu-bg);
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--font-jp);
    font-weight: 400;
    font-size: 15px;
    line-height: 1.7;
    letter-spacing: 0.02em;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: "palt";
  }
  h1, h2, h3, p, ol, ul { margin: 0; padding: 0; }
  ol, ul { list-style: none; }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }

  .page {
    max-width: 880px;
    margin: 0 auto;
    padding: 56px 32px 100px;
  }

  /* === サイトヘッダー (一覧ページ) === */
  .site-header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }
  .site-header__logo {
    flex-shrink: 0;
    width: 76px;
    height: 76px;
    background: var(--surface);
    border-radius: 14px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .site-header__logo img { width: 100%; height: 100%; object-fit: contain; }
  .site-header__text { flex: 1; min-width: 0; }
  .site-header__titleRow {
    display: flex;
    align-items: baseline;
    gap: 14px;
    flex-wrap: wrap;
  }
  .site-header__title {
    font-size: 28px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.02em;
  }
  .site-header__badge {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink-faint);
    letter-spacing: 0.1em;
    font-weight: 500;
  }
  .site-header__subtitle {
    font-size: 15px;
    color: var(--ink-subtle);
    margin-top: 6px;
    letter-spacing: 0.02em;
  }
  .accent--zatsu   { color: var(--zatsu-dark); }
  .accent--gijutsu { color: var(--gijutsu-dark); }

  /* === ナビゲーション === */
  .main-nav {
    display: flex;
    gap: 4px;
    margin-top: 20px;
    align-items: center;
  }
  .main-nav__btn {
    font-family: var(--font-jp);
    background: transparent;
    border: 1px solid transparent;
    padding: 7px 14px;
    color: var(--ink-subtle);
    font-size: 14px;
    border-radius: var(--radius-pill);
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.15s, color 0.15s;
  }
  .main-nav__btn:hover { color: var(--ink); background: var(--bg-sub); }
  .main-nav__btn--active {
    color: var(--ink);
    background: var(--surface);
    border-color: var(--border);
    font-weight: 500;
  }
  .rss-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface);
    color: var(--ink-muted);
    font-size: 13px;
    font-family: var(--font-mono);
    font-weight: 500;
    letter-spacing: 0.05em;
    text-decoration: none;
    transition: border-color 0.15s, color 0.15s;
  }
  .rss-btn:hover { border-color: var(--zatsu); color: var(--zatsu-dark); }

  /* === 区切り線 === */
  .site-divider {
    height: 0;
    border: none;
    border-top: 0.5px solid var(--ink);
    margin: 28px 0 0;
  }

  /* === RSS + セクションエリア === */
  .list-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 24px;
  }

  /* === セクション見出し === */
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 0;
  }
  .section-header__marker {
    display: flex;
    gap: 4px;
  }
  .section-header__marker span {
    width: 8px; height: 8px;
    display: block;
    border-radius: 1px;
  }
  .section-header__marker span:nth-child(1) { background: var(--zatsu); }
  .section-header__marker span:nth-child(2) { background: var(--gijutsu); }
  .section-header__title {
    font-family: var(--font-jp);
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.08em;
  }
  .section-header__count {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-faint);
    letter-spacing: 0.08em;
  }
  .section-header__rule {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* === エピソードリスト (フラットスタイル) === */
  .episodes {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 4px;
  }
  .episode {
    position: relative;
    display: block;
    padding: 18px 8px 18px 20px;
    background: transparent;
    border-radius: 0;
    border-bottom: 1px dashed var(--border);
    transition: background 0.15s, padding-left 0.15s;
    overflow: visible;
  }
  .episode:hover { background: var(--bg-sub); padding-left: 24px; }
  .episode::before {
    content: "";
    position: absolute;
    left: 0; top: 50%;
    width: 6px; height: 6px;
    border-radius: 1px;
    transform: translateY(-50%);
  }
  .episode--zatsu::before   { background: var(--zatsu); }
  .episode--gijutsu::before { background: var(--gijutsu); }

  .episode__meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 5px;
    flex-wrap: wrap;
  }
  .episode__tag {
    font-size: 10px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    letter-spacing: 0.1em;
  }
  .episode__tag--zatsu {
    color: var(--zatsu-dark);
    background: var(--zatsu-bg);
  }
  .episode__tag--gijutsu {
    color: var(--gijutsu-dark);
    background: var(--gijutsu-bg);
  }
  .episode__date {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink-subtle);
    letter-spacing: 0.04em;
  }
  .episode__duration {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink-faint);
    margin-left: auto;
    letter-spacing: 0.04em;
  }
  .episode__title {
    font-size: 17px;
    color: var(--ink);
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.5;
  }
  .episode__number {
    color: var(--ink-faint);
    font-weight: 400;
    font-family: var(--font-mono);
    font-size: 13px;
    margin-left: 6px;
  }

  .episodes-empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--ink-subtle);
    font-size: 13px;
  }

  /* === 詳細ページのトップナビ === */
  .top-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1.25rem;
    border-bottom: 0.5px solid var(--ink);
    margin-bottom: 2rem;
  }
  .top-nav__back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--ink-subtle);
    padding: 6px 10px;
    margin-left: -10px;
    border-radius: var(--radius-md);
    transition: background 0.15s, color 0.15s;
    text-decoration: none;
  }
  .top-nav__back:hover { background: var(--bg-sub); color: var(--ink); }
  .top-nav__back svg { width: 14px; height: 14px; }
  .top-nav__brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .top-nav__brand-logo {
    width: 36px;
    height: 36px;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid var(--border);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .top-nav__brand-logo img { width: 100%; height: 100%; object-fit: contain; }
  .top-nav__brand-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
  }

  /* === 詳細ページ: ヘッダー === */
  .ep-header { margin-bottom: 2rem; }
  .ep-header__meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .ep-tag {
    font-size: 10px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: var(--radius-sm);
    letter-spacing: 0.1em;
    color: var(--accent-dark, var(--ink-subtle));
    background: var(--accent-bg, var(--bg-sub));
  }
  .ep-header__date {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink-subtle);
    letter-spacing: 0.04em;
  }
  .ep-header__duration {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink-faint);
    letter-spacing: 0.04em;
  }
  .ep-header__sep {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--ink-faint);
  }
  .ep-header__title {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.4;
    color: var(--ink);
    letter-spacing: 0.01em;
  }
  .ep-header__number {
    color: var(--ink-faint);
    font-weight: 400;
    font-family: var(--font-mono);
    font-size: 22px;
    margin-left: 10px;
  }

  /* === プラットフォームアイコン === */
  .ep-platform-icons {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
  }
  .ep-platform-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    transition: opacity 0.15s, transform 0.1s;
    flex-shrink: 0;
  }
  .ep-platform-icon:hover { opacity: 1; transform: translateY(-1px); }
  .ep-platform-icon img { width: 28px; height: 28px; object-fit: contain; display: block; }

  /* === プレーヤー === */
  .player {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 4px;
    margin-bottom: 2.5rem;
    overflow: hidden;
    position: relative;
  }
  .player::before {
    content: "";
    position: absolute;
    left: 0; top: 12px; bottom: 12px;
    width: 4px;
    border-radius: 2px;
    background: var(--accent, var(--zatsu));
  }
  .player iframe {
    display: block;
    width: 100%;
    border: 0;
    border-radius: calc(var(--radius-lg) - 3px);
    margin-left: 4px;
    width: calc(100% - 4px);
  }

  /* === 詳細: セクション見出し === */
  .section { margin-bottom: 2.5rem; }
  .section__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1rem;
  }
  .section__marker {
    display: flex;
    gap: 4px;
  }
  .section__marker span {
    width: 8px; height: 8px;
    display: block;
    border-radius: 1px;
  }
  .section__marker span:nth-child(1) { background: var(--zatsu); }
  .section__marker span:nth-child(2) { background: var(--gijutsu); }
  .section__title {
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.08em;
  }
  .section__rule {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* === show-notes (プラットフォームリンク上のコンテンツ) === */
  .show-notes p {
    font-size: 14px;
    color: var(--ink-muted);
    line-height: 1.9;
    margin-bottom: 1rem;
  }
  .show-notes p:last-child { margin-bottom: 0; }
  .show-notes a {
    color: var(--accent-dark, var(--gijutsu-dark));
    border-bottom: 1px solid var(--border);
  }
  .show-notes a:hover { border-bottom-color: currentColor; }
  .show-notes ul {
    list-style: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  .show-notes li { margin-bottom: 0.25rem; line-height: 1.8; }

  /* === 配信プラットフォーム === */
  .platform-links ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .platform-links a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    transition: border-color 0.15s, transform 0.1s;
  }
  .platform-links a:hover {
    border-color: var(--ink-subtle);
    transform: translateY(-1px);
  }
  .platform-links img { width: 16px; height: 16px; }

  /* === 前後エピソード === */
  .ep-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
  }
  .ep-nav__item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    transition: transform 0.1s, border-color 0.15s;
    cursor: pointer;
    text-decoration: none;
  }
  .ep-nav__item:hover {
    transform: translateY(-1px);
    border-color: var(--ink-subtle);
  }
  .ep-nav__item--disabled {
    opacity: 0.4;
    pointer-events: none;
  }
  .ep-nav__direction {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--ink-faint);
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ep-nav__direction svg { width: 12px; height: 12px; }
  .ep-nav__item--next { text-align: right; }
  .ep-nav__item--next .ep-nav__direction { justify-content: flex-end; }
  .ep-nav__title {
    font-family: var(--font-jp);
    font-weight: 500;
    font-size: 14px;
    color: var(--ink);
    line-height: 1.5;
  }
  .ep-nav__number {
    color: var(--ink-faint);
    font-weight: 400;
    font-family: var(--font-mono);
    font-size: 12px;
    margin-left: 4px;
  }

  /* === 番組についてページ === */
  .about-hero {
    margin-top: 32px;
    padding: 40px 36px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    position: relative;
    overflow: hidden;
  }
  .about-hero::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--zatsu) 0%, var(--zatsu) 50%, var(--gijutsu) 50%, var(--gijutsu) 100%);
  }
  .about-heading {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.02em;
    margin-bottom: 16px;
  }
  .about-heading .accent-o { color: var(--zatsu-dark); }
  .about-heading .accent-b { color: var(--gijutsu-dark); }
  .about-lead {
    color: var(--ink-muted);
    font-size: 15px;
    line-height: 1.9;
    max-width: 620px;
  }

  .hosts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 0;
  }
  .host-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 24px;
  }
  .host-card__avatar {
    width: 52px; height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-serif);
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 14px;
  }
  .host-card--a .host-card__avatar { background: var(--zatsu-bg); color: var(--zatsu-dark); }
  .host-card--b .host-card__avatar { background: var(--gijutsu-bg); color: var(--gijutsu-dark); }
  .host-card__name {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .host-card__role {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-faint);
    letter-spacing: 0.1em;
    margin-bottom: 12px;
  }
  .host-card__bio {
    color: var(--ink-muted);
    font-size: 13px;
    line-height: 1.8;
    margin: 0;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 0;
  }
  .stat {
    background: var(--bg-sub);
    border-radius: var(--radius-md);
    padding: 18px 20px;
  }
  .stat__num {
    font-family: var(--font-serif);
    font-size: 32px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }
  .stat__num--zatsu  { color: var(--zatsu-dark); }
  .stat__num--gijutsu { color: var(--gijutsu-dark); }
  .stat__label {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-faint);
    letter-spacing: 0.08em;
    margin-top: 8px;
  }

  /* === フッター装飾 === */
  .footer-decor {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin-top: 3rem;
    opacity: 0.35;
  }
  .footer-decor span {
    width: 4px; height: 4px;
    display: block;
    border-radius: 1px;
  }

  @media (max-width: 640px) {
    .page { padding: 32px 20px 80px; }
    .site-header { gap: 14px; }
    .site-header__logo { width: 56px; height: 56px; border-radius: 10px; }
    .site-header__title { font-size: 22px; }
    .ep-header__title { font-size: 24px; }
    .ep-header__number { font-size: 18px; }
    .ep-nav { grid-template-columns: 1fr; }
    .ep-nav__item--next { text-align: left; }
    .ep-nav__item--next .ep-nav__direction { justify-content: flex-start; }
    .hosts-grid { grid-template-columns: 1fr; }
    .stats-row { gap: 8px; }
    .about-hero { padding: 28px 24px; }
    .about-heading { font-size: 22px; }
    .episode { padding: 16px 6px 16px 18px; }
  }
`

const LOGO_SRC = 'https://images.kechiiiiin.com/icon/%E3%81%84%E3%81%A4%E3%81%BE%E3%81%97%E3%82%99%E3%83%A9%E3%82%B7%E3%82%99%E3%82%AA.jpg'

type LayoutProps = {
  title: string
  badge?: string
  variant?: 'home' | 'detail' | 'about'
  bodyThemeClass?: string
  children?: Child
}

const HomeHeader: FC<{ badge?: string; activeNav: 'episodes' | 'about' }> = ({ badge, activeNav }) => (
  <header class="site-header">
    <a class="site-header__logo" href="/" aria-label="いつまじラジオ トップへ">
      <img src={LOGO_SRC} alt="いつまじラジオ ロゴ" />
    </a>
    <div class="site-header__text">
      <div class="site-header__titleRow">
        <h1 class="site-header__title">いつまじラジオ</h1>
        {badge && <span class="site-header__badge">{badge}</span>}
      </div>
      <p class="site-header__subtitle">
        いつもの<span class="accent--zatsu">雑談</span>、まじめな<span class="accent--gijutsu">技術</span>
      </p>
      <nav class="main-nav" aria-label="メインナビゲーション">
        <a
          href="/"
          class={`main-nav__btn${activeNav === 'episodes' ? ' main-nav__btn--active' : ''}`}
        >
          エピソード
        </a>
        <a
          href="/about"
          class={`main-nav__btn${activeNav === 'about' ? ' main-nav__btn--active' : ''}`}
        >
          番組について
        </a>
      </nav>
    </div>
  </header>
)

const DetailTopNav: FC = () => (
  <nav class="top-nav">
    <a class="top-nav__back" href="/">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" />
      </svg>
      エピソード一覧
    </a>
    <a class="top-nav__brand" href="/">
      <span class="top-nav__brand-logo">
        <img src={LOGO_SRC} alt="" />
      </span>
      <span class="top-nav__brand-name">いつまじラジオ</span>
    </a>
  </nav>
)

export const Layout: FC<LayoutProps> = ({ title, badge, variant = 'home', bodyThemeClass, children }) => {
  const activeNav = variant === 'about' ? 'about' : 'episodes'
  return (
    <>
      {raw('<!DOCTYPE html>')}
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          />
          <style>{raw(styles)}</style>
        </head>
        <body class={bodyThemeClass}>
          <main class="page">
            {variant === 'detail' ? (
              <DetailTopNav />
            ) : (
              <>
                <HomeHeader badge={badge} activeNav={activeNav} />
                <hr class="site-divider" aria-hidden="true" />
              </>
            )}

            {children}

            <div class="footer-decor" aria-hidden="true">
              <span style="background: var(--zatsu);"></span>
              <span style="background: transparent; width:3px;"></span>
              <span style="background: var(--zatsu);"></span>
              <span style="background: var(--gijutsu);"></span>
              <span style="background: transparent; width:3px;"></span>
              <span style="background: var(--gijutsu);"></span>
            </div>
          </main>
        </body>
      </html>
    </>
  )
}