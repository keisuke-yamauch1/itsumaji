CREATE TABLE IF NOT EXISTS episodes (
    guid        　TEXT PRIMARY KEY,
    title       　TEXT NOT NULL,
    description 　TEXT,
    published_at TEXT NOT NULL,
    audio_url   　TEXT NOT NULL,
    duration    　TEXT,
    episode_num 　INTEGER,
    created_at  　TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_episodes_published_at
    ON episodes(published_at DESC);
