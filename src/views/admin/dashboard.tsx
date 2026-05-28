import type { FC } from 'hono/jsx'
import { AdminLayout } from './layout'
import type { Episode } from '../../models/db/episode'
import { CATEGORY_IDS } from '../../constants/categories'

type Props = {
    episodes: Episode[]
    message?: string
    error?: string
}

export const Dashboard: FC<Props> = ({ episodes, message, error }) => (
    <AdminLayout title="Dashboard">
        {message && <div class="alert alert--success">{message}</div>}
        {error && <div class="alert alert--error">{error}</div>}

        <div class="admin-card">
            <p class="admin-card__title">同期</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <form method="post" action="/admin/sync/rss">
                    <button type="submit" class="btn btn--secondary btn--sm">RSS 同期</button>
                </form>
                <form method="post" action="/admin/sync/spotify">
                    <button type="submit" class="btn btn--secondary btn--sm">Spotify 同期</button>
                </form>
                <form method="post" action="/admin/sync/apple-podcasts">
                    <button type="submit" class="btn btn--secondary btn--sm">Apple Podcasts 同期</button>
                </form>
            </div>
        </div>

        <div class="admin-card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                <p class="admin-card__title" style="margin-bottom:0;">エピソード一覧</p>
                <a href="/admin/episodes/new" class="btn btn--primary btn--sm">＋ 事前登録</a>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead>
                    <tr style="border-bottom:1px solid var(--border);">
                        <th style="text-align:left;padding:8px 10px;color:var(--ink-faint);font-weight:600;font-size:12px;">EP</th>
                        <th style="text-align:left;padding:8px 10px;color:var(--ink-faint);font-weight:600;font-size:12px;">タイトル</th>
                        <th style="text-align:left;padding:8px 10px;color:var(--ink-faint);font-weight:600;font-size:12px;">カテゴリ</th>
                        <th style="text-align:left;padding:8px 10px;color:var(--ink-faint);font-weight:600;font-size:12px;">日付</th>
                        <th style="text-align:left;padding:8px 10px;color:var(--ink-faint);font-weight:600;font-size:12px;">GUID</th>
                    </tr>
                </thead>
                <tbody>
                    {episodes.map((ep) => (
                        <tr key={ep.guid} style="border-bottom:1px solid var(--border-soft);">
                            <td style="padding:10px;font-family:var(--font-mono);font-size:13px;color:var(--ink-subtle);">
                                #{ep.episode_number}
                            </td>
                            <td style="padding:10px;">
                                <a href={`/episodes/${ep.guid}`} target="_blank" style="color:var(--ink);">{ep.title || '—'}</a>
                            </td>
                            <td style="padding:10px;font-size:13px;color:var(--ink-subtle);">
                                {ep.category_id === CATEGORY_IDS.ZATSUDAN ? '雑談' : '技術'}
                            </td>
                            <td style="padding:10px;font-size:13px;color:var(--ink-subtle);">
                                {ep.published_at ? ep.published_at.slice(0, 10) : '未公開'}
                            </td>
                            <td style="padding:10px;font-family:var(--font-mono);font-size:11px;color:var(--ink-faint);">
                                {ep.guid}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </AdminLayout>
)
