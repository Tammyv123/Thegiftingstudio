-- Delete subcategories for Birthday Gift and Personalised Gift
DELETE FROM subcategories WHERE category_id IN (
  SELECT id FROM categories WHERE slug IN ('birthday gift', 'personalised gift')
);

-- Delete the old categories
DELETE FROM categories WHERE slug IN ('birthday gift', 'personalised gift');

-- Insert new "Gifts" category
INSERT INTO categories (name, slug) VALUES ('Gifts', 'gifts')
ON CONFLICT DO NOTHING;