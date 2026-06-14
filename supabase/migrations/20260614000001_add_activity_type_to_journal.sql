-- Add activity_type column to journal_entries
-- Supports categorization of journal entries by activity type.
-- Down: alter table journal_entries drop column if exists activity_type;

alter table journal_entries
  add column if not exists activity_type text
    check (activity_type in ('shrine', 'food', 'eco', 'shopping', 'other'))
    default 'other';
