import type { FC, Child } from 'hono/jsx'
import { raw } from 'hono/html'

const styles = `
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; padding: 0; }

  :root {
    --color-bg: #fefcf7;
    --color-surface: #ffffff;
    --color-text: #1a1a1a;
    --color-text-muted: #6b6b6b;
    --color-warm: #e8823e;
    --color-warm-soft: #f6c9a8;
    --color-cool: #2b87a8;
    --color-cool-soft: #b6dbe6;
    --color-border: #ece8df;
    --radius: 14px;
    --radius-lg: 22px;
    --shadow: 0 2px 10px rgba(26, 26, 46, 0.05);
    --shadow-hover: 0 14px 34px rgba(26, 26, 46, 0.10);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic UI", "Meiryo", sans-serif;
    background: var(--color-bg);
    color: var(--color-text);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }

  img { display: block; max-width: 100%; }
  a { color: inherit; }

  .container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .site-header {
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, #fff7ec 0%, #eaf4f7 100%);
    padding: 1.75rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .visually-hidden {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .site-header::before,
  .site-header::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    opacity: 0.35;
    pointer-events: none;
  }
  .site-header::before {
    width: 240px; height: 240px;
    background: radial-gradient(circle at 30% 30%, #f5a96a, #e8823e);
    left: -60px; top: -40px;
  }
  .site-header::after {
    width: 280px; height: 280px;
    background: radial-gradient(circle at 70% 70%, #5fb3cf, #2b87a8);
    right: -80px; bottom: -80px;
  }

  .site-header .container { position: relative; z-index: 1; }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .brand-link {
    display: inline-flex;
    align-items: center;
    gap: 0.9rem;
    text-decoration: none;
    color: inherit;
  }

  .brand-logo {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(26, 26, 46, 0.10);
    flex-shrink: 0;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .brand-title {
    font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", sans-serif;
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    font-weight: 900;
    letter-spacing: 0.01em;
    line-height: 1.1;
    color: var(--color-text);
  }

  .brand-tagline {
    font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", sans-serif;
    font-size: clamp(0.8rem, 1.3vw, 0.9rem);
    color: var(--color-text-muted);
    font-weight: 500;
  }

  .brand-tagline .chat { color: var(--color-warm); font-weight: 700; }
  .brand-tagline .tech { color: var(--color-cool); font-weight: 700; }

  main { padding: 3rem 0 5rem; }

  .section-head {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
  }

  .section-head h2 {
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .section-head h2::before {
    content: "";
    display: inline-block;
    width: 8px; height: 8px;
    background: var(--color-warm);
    border-radius: 2px;
    margin-right: 0.5rem;
    transform: translateY(-2px);
    box-shadow: 10px 0 0 var(--color-cool);
  }

  .section-head .count {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    font-weight: 500;
  }

  .episode-grid {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 760px;
    margin: 0 auto;
  }

  .episode-card {
    background: var(--color-surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    border: 1px solid var(--color-border);
  }

  .episode-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
    border-color: var(--color-cool-soft);
  }

  .episode-card a {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem;
    color: inherit;
    text-decoration: none;
  }

  .episode-card .thumb-wrap {
    position: relative;
    width: 112px;
    height: 112px;
    flex-shrink: 0;
    border-radius: 10px;
    overflow: hidden;
    background: linear-gradient(135deg, #fff0df, #dff0f4);
  }

  .episode-card .thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .episode-body {
    flex: 1;
    min-width: 0;
    padding: 0;
  }

  .episode-body time {
    font-size: 0.76rem;
    color: var(--color-cool);
    font-weight: 600;
    display: block;
    margin-bottom: 0.35rem;
    letter-spacing: 0.04em;
  }

  .episode-body h3 {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: 0.6rem;
    color: var(--color-text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (max-width: 520px) {
    .episode-card a { gap: 0.75rem; padding: 0.75rem; }
    .episode-card .thumb-wrap { width: 88px; height: 88px; }
    .episode-body h3 { font-size: 0.95rem; }
  }

  .duration-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-warm);
    background: #fdf1e5;
    padding: 0.22rem 0.6rem;
    border-radius: 999px;
  }
  .duration-badge::before {
    content: "";
    width: 6px; height: 6px;
    background: var(--color-warm);
    border-radius: 50%;
  }

  .empty {
    text-align: center;
    padding: 4rem 1rem;
    color: var(--color-text-muted);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    border: 1px dashed var(--color-border);
  }

  .site-footer {
    padding: 2.25rem 0;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.82rem;
    border-top: 1px solid var(--color-border);
  }
`

export const Layout: FC<{ title: string; children?: Child }> = ({ title, children }) => (
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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&display=swap"
        />
        <style>{raw(styles)}</style>
      </head>
      <body>
        <header class="site-header">
          <div class="container">
            <div class="brand">
              <a class="brand-link" href="/">
                <img
                  class="brand-logo"
                  src="https://images.kechiiiiin.com/icon/%E3%81%84%E3%81%A4%E3%81%BE%E3%81%97%E3%82%99%E3%83%A9%E3%82%B7%E3%82%99%E3%82%AA.jpg"
                  alt=""
                />
                <span class="brand-text">
                  <span class="brand-title">いつまじラジオ</span>
                  <span class="brand-tagline">
                    いつもの<span class="chat">雑談</span>、まじめな<span class="tech">技術</span>
                  </span>
                </span>
              </a>
            </div>
            <h1 class="visually-hidden">いつまじラジオ — いつもの雑談、まじめな技術</h1>
          </div>
        </header>
        <main>
          <div class="container">{children}</div>
        </main>
        <footer class="site-footer">
          <div class="container">© いつまじラジオ</div>
        </footer>
      </body>
    </html>
  </>
)