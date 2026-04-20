CREATE TABLE IF NOT EXISTS categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO categories (name) VALUES
    ('zatsudan'),
    ('tech');

ALTER TABLE episodes ADD COLUMN category_id INTEGER REFERENCES categories(id);