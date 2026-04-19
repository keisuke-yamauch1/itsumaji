CREATE TABLE IF NOT EXISTS episodes (
    guid         TEXT PRIMARY KEY,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL,
    published_at DATE NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration     TEXT NOT NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_episodes_published_at
    ON episodes(published_at DESC);

CREATE TABLE IF NOT EXISTS platforms (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    icon_url   TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS episode_platforms (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    episode_id  TEXT    NOT NULL REFERENCES episodes(guid),
    platform_id INTEGER NOT NULL REFERENCES platforms(id),
    url         TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE (episode_id, platform_id)
);

INSERT INTO platforms (name, icon_url) VALUES
    ('LISTEN',         'https://listen.style/images/LISTEN_logo.svg'),
    ('Spotify',        'https://images.kechiiiiin.com/itsumaji/20260329092716.svg'),
    ('Apple Podcasts', 'https://images.kechiiiiin.com/itsumaji/20260329092433.png'),
    ('Amazon Music',   'https://images.kechiiiiin.com/itsumaji/20260329092942.svg');