import type { FC, Child } from 'hono/jsx'
import { raw } from 'hono/html'

const styles = `
  :root {
    --bg:            #FCFBF7;
    --surface:       #FFFFFF;
    --ink:           #2A2724;
    --ink-muted:     rgba(42, 39, 36, 0.65);
    --ink-subtle:    rgba(42, 39, 36, 0.5);
    --ink-faint:     rgba(42, 39, 36, 0.35);
    --border:        rgba(42, 39, 36, 0.1);
    --border-soft:   rgba(42, 39, 36, 0.06);

    --zatsu:         #D4673A;
    --zatsu-dark:    #C55E2E;
    --zatsu-bg:      #FBEAE1;

    --gijutsu:       #3C8CA3;
    --gijutsu-dark:  #2C6F83;
    --gijutsu-bg:    #DDEEF2;

    --radius-sm:     3px;
    --radius-md:     8px;
    --radius-lg:     12px;

    --font-jp: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", sans-serif;
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
    -moz-osx-font-smoothing: grayscale;
  }
  h1, h2, h3, p { margin: 0; }
  ul { list-style: none; padding: 0; margin: 0; }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }

  .page {
    max-width: 720px;
    margin: 0 auto;
    padding: 3.5rem 1.5rem 4rem;
  }

  .site-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 1.5rem;
    border-bottom: 0.5px solid var(--border);
  }
  .site-header__logo {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    background: var(--surface);
    border-radius: var(--radius-md);
    border: 0.5px solid var(--border);
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
    gap: 12px;
    flex-wrap: wrap;
  }
  .site-header__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--ink);
    letter-spacing: 0.02em;
  }
  .site-header__badge {
    font-size: 11px;
    color: var(--ink-subtle);
    letter-spacing: 0.12em;
    font-weight: 500;
  }
  .site-header__subtitle {
    font-size: 13px;
    color: var(--ink-muted);
    margin-top: 4px;
    letter-spacing: 0.04em;
  }
  .accent--zatsu   { color: var(--zatsu-dark); }
  .accent--gijutsu { color: var(--gijutsu); }

  .pixel-decor {
    display: grid;
    grid-template-columns: repeat(3, 4px);
    gap: 3px;
    padding-top: 10px;
    flex-shrink: 0;
  }
  .pixel-decor span {
    width: 4px; height: 4px;
    background: var(--gijutsu);
    display: block;
  }
  .pixel-decor span.empty   { background: transparent; }
  .pixel-decor span.dim-70  { opacity: 0.7; }
  .pixel-decor span.dim-50  { opacity: 0.5; }
  .pixel-decor span.dim-40  { opacity: 0.4; }
  .pixel-decor span.dim-30  { opacity: 0.3; }

  .footer-decor {
    display: flex;
    justify-content: center;
    gap: 3px;
    margin-top: 2.5rem;
    opacity: 0.4;
  }
  .footer-decor span {
    width: 4px; height: 4px;
    display: block;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 2rem 0 1rem;
  }
  .section-header__marker { display: flex; gap: 2px; }
  .section-header__marker span { width: 6px; height: 6px; display: block; }
  .section-header__marker span:nth-child(1) { background: var(--zatsu); }
  .section-header__marker span:nth-child(2) { background: transparent; }
  .section-header__marker span:nth-child(3) { background: var(--gijutsu); }
  .section-header__title {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
    letter-spacing: 0.08em;
  }
  .section-header__count {
    font-size: 11px;
    color: var(--ink-faint);
    letter-spacing: 0.05em;
  }
  .section-header__rule {
    flex: 1;
    height: 0.5px;
    background: var(--border);
  }

  .episodes {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .episode {
    display: block;
    padding: 16px 18px;
    background: var(--surface);
    border-radius: var(--radius-md);
    border: 0.5px solid var(--border);
    border-left-width: 3px;
    border-left-style: solid;
    transition: transform 120ms ease, border-color 120ms ease;
  }
  .episode:hover {
    border-color: rgba(42, 39, 36, 0.18);
    transform: translateY(-1px);
    cursor: pointer;
  }
  .episode--zatsu   { border-left-color: var(--zatsu); }
  .episode--gijutsu { border-left-color: var(--gijutsu); }

  .episode__meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }
  .episode__tag {
    font-size: 10px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    letter-spacing: 0.12em;
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
    font-size: 11px;
    color: var(--ink-subtle);
    font-variant-numeric: tabular-nums;
  }
  .episode__duration {
    font-size: 11px;
    color: var(--ink-faint);
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }
  .episode__title {
    font-size: 15px;
    color: var(--ink);
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .episode__number {
    color: var(--ink-faint);
    font-weight: 400;
    margin-left: 4px;
  }

  .episodes-empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--ink-muted);
    font-size: 13px;
  }

  .episode-detail { margin-top: 1.5rem; }

  .back-link {
    margin-bottom: 1.25rem;
    font-size: 12px;
    letter-spacing: 0.05em;
  }
  .back-link a { color: var(--ink-muted); }
  .back-link a:hover { color: var(--ink); }

  .episode-detail-head {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 1.75rem;
  }
  .detail-thumb {
    width: 120px;
    height: 120px;
    border-radius: var(--radius-md);
    object-fit: cover;
    flex-shrink: 0;
    border: 0.5px solid var(--border);
  }
  .detail-meta { flex: 1; min-width: 0; }
  .detail-meta__top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }
  .detail-meta time {
    font-size: 11px;
    color: var(--ink-subtle);
    font-variant-numeric: tabular-nums;
  }
  .detail-meta__duration {
    font-size: 11px;
    color: var(--ink-faint);
    font-variant-numeric: tabular-nums;
  }
  .detail-meta h2 {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--ink);
    letter-spacing: 0.02em;
  }
  .detail-meta__number {
    color: var(--ink-faint);
    font-weight: 400;
    margin-left: 4px;
  }

  .player-wrap {
    margin-bottom: 2rem;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 0.5px solid var(--border);
  }
  .player-wrap iframe { display: block; width: 100%; border: 0; }

  .episode-description {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    margin-bottom: 2rem;
    font-size: 14px;
    line-height: 1.8;
    word-wrap: break-word;
  }
  .episode-description a { color: var(--gijutsu-dark); }
  .episode-description p { margin-bottom: 0.75rem; }
  .episode-description p:last-child { margin-bottom: 0; }
  .episode-description ul {
    list-style: disc;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  .episode-description ul ul { list-style: circle; }
  .episode-description ul ul ul { list-style: square; }
  .episode-description li { margin-bottom: 0.25rem; }

  .platform-links h3 {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: var(--ink-muted);
    letter-spacing: 0.08em;
  }
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
    border: 0.5px solid var(--border);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    transition: border-color 120ms ease, transform 120ms ease;
  }
  .platform-links a:hover {
    border-color: rgba(42, 39, 36, 0.18);
    transform: translateY(-1px);
  }
  .platform-links img { width: 16px; height: 16px; }

  @media (max-width: 520px) {
    .page { padding: 2.5rem 1rem 3rem; }
    .site-header { gap: 12px; }
    .site-header__logo { width: 48px; height: 48px; }
    .site-header__title { font-size: 19px; }
    .pixel-decor { display: none; }
    .episode { padding: 14px 14px; }
    .detail-thumb { width: 88px; height: 88px; }
    .detail-meta h2 { font-size: 16px; }
  }
`

const LOGO_SRC = 'https://images.kechiiiiin.com/icon/%E3%81%84%E3%81%A4%E3%81%BE%E3%81%97%E3%82%99%E3%83%A9%E3%82%B7%E3%82%99%E3%82%AA.jpg'

export const Layout: FC<{ title: string; badge?: string; children?: Child }> = ({ title, badge, children }) => (
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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
        />
        <style>{raw(styles)}</style>
      </head>
      <body>
        <main class="page">
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
            </div>
            <div class="pixel-decor" aria-hidden="true">
              <span></span><span class="dim-40"></span><span class="empty"></span>
              <span class="empty"></span><span></span><span class="dim-70"></span>
              <span class="dim-30"></span><span class="empty"></span><span class="dim-50"></span>
            </div>
          </header>

          {children}

          <div class="footer-decor" aria-hidden="true">
            <span style="background: var(--zatsu);"></span>
            <span></span>
            <span style="background: var(--zatsu);"></span>
            <span style="background: var(--gijutsu);"></span>
            <span></span>
            <span style="background: var(--gijutsu);"></span>
          </div>
        </main>
      </body>
    </html>
  </>
)