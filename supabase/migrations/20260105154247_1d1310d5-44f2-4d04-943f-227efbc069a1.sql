-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subcategories table
CREATE TABLE public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Anyone can view categories" ON public.categories
FOR SELECT USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can insert categories" ON public.categories
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update categories" ON public.categories
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete categories" ON public.categories
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view subcategories
CREATE POLICY "Anyone can view subcategories" ON public.subcategories
FOR SELECT USING (true);

-- Admins can manage subcategories
CREATE POLICY "Admins can insert subcategories" ON public.subcategories
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update subcategories" ON public.subcategories
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete subcategories" ON public.subcategories
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default categories
INSERT INTO public.categories (name, slug) VALUES
  ('Festive Gift', 'festive gift'),
  ('Wedding Gift', 'wedding gift'),
  ('Birthday Gift', 'birthday gift'),
  ('Anniversary Gift', 'anniversary gift'),
  ('Personalised Gift', 'personalised gift'),
  ('Premium Gift', 'premium gift'),
  ('Home Essentials', 'home essentials'),
  ('Accessories', 'accessories'),
  ('Party Supplies', 'party supplies'),
  ('Corporate Gift', 'corporate gift'),
  ('Gourmet Hampers', 'gourmet hampers');

-- Insert default subcategories
INSERT INTO public.subcategories (category_id, name, slug)
SELECT c.id, s.name, s.slug
FROM public.categories c
CROSS JOIN (VALUES 
  ('wedding gift', 'Trays', 'trays'),
  ('wedding gift', 'Return Favours', 'return favours'),
  ('wedding gift', 'Jewellery', 'jewellery'),
  ('wedding gift', 'Props', 'props'),
  ('wedding gift', 'Hampers', 'hampers'),
  ('wedding gift', 'Gifts', 'gifts'),
  ('festive gift', 'Diwali', 'diwali'),
  ('festive gift', 'Holi', 'holi'),
  ('festive gift', 'Christmas', 'christmas'),
  ('festive gift', 'Eid', 'eid'),
  ('festive gift', 'Rakshabandhan', 'rakshabandhan'),
  ('festive gift', 'New Year', 'new year'),
  ('festive gift', 'Lohri', 'lohri'),
  ('festive gift', 'Diyas and Candles', 'diyas and candles'),
  ('birthday gift', 'Gift For Her', 'gift for her'),
  ('birthday gift', 'Gift For Him', 'gift for him'),
  ('birthday gift', 'Gift For Mother', 'gift for mother'),
  ('birthday gift', 'Gift For Father', 'gift for father'),
  ('birthday gift', 'Gift For Sibling', 'gift for sibling'),
  ('accessories', 'Earrings', 'earrings'),
  ('accessories', 'Necklace', 'necklace'),
  ('accessories', 'Hand', 'hand'),
  ('accessories', 'Hair', 'hair')
) AS s(category_slug, name, slug)
WHERE c.slug = s.category_slug;