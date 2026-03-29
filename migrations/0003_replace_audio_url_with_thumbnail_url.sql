ALTER TABLE episodes RENAME COLUMN audio_url TO thumbnail_url;
ALTER TABLE episodes DROP COLUMN episode_num;
