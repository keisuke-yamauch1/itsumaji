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
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO platforms (name, icon_url) VALUES
    ('Spotify',        'https://images.kechiiiiin.com/itsumaji/20260329092716.svg'),
    ('Apple Podcasts', 'https://images.kechiiiiin.com/itsumaji/20260329092433.png'),
    ('LISTEN',         'https://listen.style/images/LISTEN_logo.svg'),
    ('Amazon Music',   'https://images.kechiiiiin.com/itsumaji/20260329092942.svg');
