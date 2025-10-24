-- Add notes column to events table
-- Run this in your Supabase SQL editor

ALTER TABLE public.events 
ADD COLUMN notes TEXT;

-- Update the comment to reflect the new column
COMMENT ON COLUMN public.events.notes IS 'User notes about the event';

SELECT 'Notes column added successfully to events table' as result;