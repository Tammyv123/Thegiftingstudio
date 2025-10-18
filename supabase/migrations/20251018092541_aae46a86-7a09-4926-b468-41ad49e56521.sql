-- Create products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create cart items table
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create wishlist items table
CREATE TABLE public.wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL,
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products policies (public read)
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- Cart policies
CREATE POLICY "Users can view their own cart"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their cart"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cart"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their cart"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their wishlist"
  ON public.wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their order items"
  ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

-- Insert sample products
INSERT INTO public.products (name, price, image, category, description) VALUES
('Diwali Gift Hamper', 1299, 'https://images.unsplash.com/photo-1607081692251-5e8f8e5f2dc3?w=400', 'Festive', 'Beautiful Diwali gift hamper with traditional items'),
('Holi Color Set', 899, 'https://images.unsplash.com/photo-1583780810752-abd5dd6bc3dd?w=400', 'Festive', 'Premium Holi colors set'),
('Christmas Decoration Pack', 1599, 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400', 'Festive', 'Complete Christmas decoration package'),
('Birthday Surprise Box', 999, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400', 'Birthday', 'Special birthday surprise box'),
('Birthday Cake & Flowers', 1499, 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400', 'Birthday', 'Fresh cake and flowers combo'),
('Romantic Gift Set', 1499, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400', 'Anniversary', 'Perfect romantic anniversary gift'),
('Wedding Gift Hamper', 2499, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400', 'Wedding', 'Premium wedding gift hamper'),
('Personalized Photo Frame', 799, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400', 'Personalised', 'Custom photo frame with engraving'),
('Engraved Jewelry Box', 1299, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 'Personalised', 'Beautiful personalized jewelry box');