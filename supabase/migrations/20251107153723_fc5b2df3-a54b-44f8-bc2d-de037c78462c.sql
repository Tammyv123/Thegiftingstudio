-- Add stock management columns to products table
ALTER TABLE public.products
ADD COLUMN stock INTEGER NOT NULL DEFAULT 0,
ADD COLUMN low_stock_threshold INTEGER DEFAULT 10;