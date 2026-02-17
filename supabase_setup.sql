-- ============================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- ============================================

-- 1. Add 'tags' column to gigs table
ALTER TABLE gigs
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. (Optional) Run this if you want to reset and re-seed clean data
-- TRUNCATE TABLE gigs CASCADE;
