import type { FC, Child } from 'hono/jsx'
import { raw } from 'hono/html'

const styles = `
  :root {
    --bg:          #ffffff;
    --bg-sub:      #f7f6f3;
    --surface:     #ffffff;
    --line:        #eae6df;
    --ink:         #1f1a15;
    --ink-muted:   #3a332c;
    --ink-subtle:  #6b6258;
    --ink-faint:   #a39a8e;
    --border:      #eae6df;
    --border-soft: #f2efe8;
    --bg-subtle:   #f7f6f3;

    --accent:      oklch(0.65 0.12 240);
    --accent-dark: oklch(0.45 0.12 240);
    --accent-bg:   oklch(0.94 0.035 235);

    --radius-sm:   4px;
    --radius-md:   10px;
    --radius-lg:   14px;
    --radius-pill: 999px;

    --font-jp:    "Noto Sans JP", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --font-mono:  "JetBrains Mono", ui-monospace, monospace;
  }

  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg-sub);
    color: var(--ink);
    font-family: var(--font-jp);
    font-size: 15px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, p, ol, ul { margin: 0; padding: 0; }
  ol, ul { list-style: none; }
  a { color: inherit; text-decoration: none; }

  .admin-wrap {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  .admin-header__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink-subtle);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-size: 13px;
  }
  .admin-header__site {
    font-size: 13px;
    color: var(--ink-faint);
  }
  .admin-header__site a:hover { color: var(--ink-subtle); }

  .admin-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px 28px;
    margin-bottom: 20px;
  }
  .admin-card__title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--ink);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: var(--radius-pill);
    font-family: var(--font-jp);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    transition: opacity 0.15s;
    text-decoration: none;
  }
  .btn:hover { opacity: 0.8; }
  .btn--primary {
    background: var(--accent);
    color: #fff;
  }
  .btn--secondary {
    background: transparent;
    border-color: var(--border);
    color: var(--ink-subtle);
  }
  .btn--sm {
    padding: 6px 14px;
    font-size: 13px;
  }

  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-subtle);
    margin-bottom: 6px;
    letter-spacing: 0.03em;
  }
  .form-label span {
    color: var(--accent);
    margin-left: 3px;
  }
  .form-input, .form-select, .form-textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-family: var(--font-jp);
    font-size: 15px;
    color: var(--ink);
    background: var(--surface);
    outline: none;
    transition: border-color 0.15s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--accent);
  }
  .form-input.mono {
    font-family: var(--font-mono);
    font-size: 14px;
  }
  .form-textarea { resize: vertical; min-height: 90px; }
  .form-hint {
    font-size: 12px;
    color: var(--ink-faint);
    margin-top: 5px;
  }
  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 28px;
  }

  .alert {
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: 14px;
    margin-bottom: 20px;
  }
  .alert--success {
    background: oklch(0.94 0.06 145);
    color: oklch(0.35 0.1 145);
    border: 1px solid oklch(0.82 0.1 145);
  }
  .alert--error {
    background: oklch(0.96 0.04 20);
    color: oklch(0.4 0.15 20);
    border: 1px solid oklch(0.85 0.1 20);
  }
`

type Props = {
    children: Child
    title?: string
}

export const AdminLayout: FC<Props> = ({ children, title = 'Admin' }) => (
    <html lang="ja">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{title} — itsumaji admin</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
            <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
            <style>{raw(styles)}</style>
        </head>
        <body>
            <div class="admin-wrap">
                <header class="admin-header">
                    <span class="admin-header__title">itsumaji admin</span>
                    <span class="admin-header__site">
                        <a href="/" target="_blank">↗ itsumaji-radio.net</a>
                    </span>
                </header>
                {children}
            </div>
        </body>
    </html>
)
