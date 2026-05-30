import type { FC } from 'hono/jsx'
import { AdminLayout } from './layout'
import type { Episode } from '../../models/db/episode'
import { PLATFORM_INFO } from '../../constants/platforms'

type Props = {
    episode: Episode
    platformId: number
    currentUrl?: string | null
    error?: string
}

export const PlatformUrlForm: FC<Props> = ({ episode, platformId, currentUrl, error }) => {
    const platform = PLATFORM_INFO[platformId]
    return (
        <AdminLayout title={`${platform.name} 登録`}>
            <div style="margin-bottom:20px;">
                <a href="/admin" class="btn btn--secondary btn--sm">← ダッシュボード</a>
            </div>

            {error && <div class="alert alert--error">{error}</div>}

            <div class="admin-card">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <img src={platform.icon_url} alt={platform.name} style="width:20px;height:20px;object-fit:contain;" />
                    <p class="admin-card__title" style="margin-bottom:0;">{platform.name} URL 登録</p>
                </div>
                <p style="font-size:14px;color:var(--ink-subtle);margin-bottom:20px;">
                    EP#{episode.episode_number} — {episode.title}
                </p>
                <form method="post" action={`/admin/episodes/${episode.guid}/platforms/${platformId}`}>
                    <div class="form-group">
                        <label class="form-label" for="url">URL</label>
                        <input
                            class="form-input"
                            type="url"
                            id="url"
                            name="url"
                            required
                            value={currentUrl ?? ''}
                            autocomplete="off"
                        />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn--primary">
                            {currentUrl ? '更新する' : '登録する'}
                        </button>
                        <a href="/admin" class="btn btn--secondary">キャンセル</a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
