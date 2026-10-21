CREATE TABLE IF NOT EXISTS scout_meta (id INTEGER PRIMARY KEY CHECK (id=1), revision INTEGER NOT NULL);
INSERT OR IGNORE INTO scout_meta VALUES (1,0);
CREATE TABLE IF NOT EXISTS scout_layouts (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, author TEXT NOT NULL,
  headquarters_level INTEGER NOT NULL CHECK(headquarters_level BETWEEN 1 AND 10),
  raw TEXT NOT NULL, compiled TEXT NOT NULL, created_at TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1 CHECK(published IN (0,1))
);
CREATE TABLE IF NOT EXISTS scout_limits (bucket TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS scout_limits_expiry ON scout_limits(expires);
CREATE TRIGGER IF NOT EXISTS scout_insert AFTER INSERT ON scout_layouts BEGIN
  UPDATE scout_meta SET revision=revision+1 WHERE id=1;
END;
CREATE TRIGGER IF NOT EXISTS scout_update AFTER UPDATE ON scout_layouts BEGIN
  UPDATE scout_meta SET revision=revision+1 WHERE id=1;
END;
CREATE TRIGGER IF NOT EXISTS scout_delete AFTER DELETE ON scout_layouts BEGIN
  UPDATE scout_meta SET revision=revision+1 WHERE id=1;
END;
