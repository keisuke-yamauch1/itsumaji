import type { FC } from 'hono/jsx'
import { AdminLayout } from './layout'

type Props = {
    error?: string
}

export const EpisodeForm: FC<Props> = ({ error }) => (
    <AdminLayout title="エピソード事前登録">
        <div style="margin-bottom:20px;">
            <a href="/admin" class="btn btn--secondary btn--sm">← ダッシュボード</a>
        </div>

        {error && <div class="alert alert--error">{error}</div>}

        <div class="admin-card">
            <p class="admin-card__title">エピソード事前登録</p>
            <form method="post" action="/admin/episodes">
                <div class="form-group">
                    <label class="form-label" for="guid">
                        GUID <span>*</span>
                    </label>
                    <input
                        class="form-input mono"
                        type="text"
                        id="guid"
                        name="guid"
                        required
                        placeholder="01ksq1z00aq7dj43qh9fb3fbdy"
                        autocomplete="off"
                    />
                    <p class="form-hint">listen.style のページソース内の ULID。エピソードURLになる。</p>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="form-group">
                        <label class="form-label" for="episode_number">
                            EP番号 <span>*</span>
                        </label>
                        <input
                            class="form-input"
                            type="number"
                            id="episode_number"
                            name="episode_number"
                            required
                            min="0"
                            placeholder="17"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="category_id">
                            カテゴリ <span>*</span>
                        </label>
                        <select class="form-select" id="category_id" name="category_id" required>
                            <option value="2">技術</option>
                            <option value="1">雑談</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="title">
                        タイトル <span>*</span>
                    </label>
                    <input
                        class="form-input"
                        type="text"
                        id="title"
                        name="title"
                        required
                        placeholder="エピソードタイトル（仮でも可）"
                    />
                </div>

                <div class="form-group">
                    <label class="form-label" for="description">説明文</label>
                    <textarea
                        class="form-textarea"
                        id="description"
                        name="description"
                        placeholder="（空欄可 — RSS同期後に上書きされる）"
                    />
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="form-group">
                        <label class="form-label" for="published_at">公開予定日</label>
                        <input
                            class="form-input"
                            type="date"
                            id="published_at"
                            name="published_at"
                        />
                        <p class="form-hint">空欄可。RSS同期後に正式な日時で上書きされる。</p>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="duration">再生時間</label>
                        <input
                            class="form-input mono"
                            type="text"
                            id="duration"
                            name="duration"
                            placeholder="00:00:00"
                        />
                        <p class="form-hint">空欄可。形式: HH:MM:SS</p>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn--primary">登録する</button>
                    <a href="/admin" class="btn btn--secondary">キャンセル</a>
                </div>
            </form>
        </div>
    </AdminLayout>
)
