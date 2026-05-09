-- Add photos column to reviews table
ALTER TABLE public.reviews ADD COLUMN photos TEXT[] DEFAULT '{}';

-- Remove title column from reviews table
ALTER TABLE public.reviews DROP COLUMN title;