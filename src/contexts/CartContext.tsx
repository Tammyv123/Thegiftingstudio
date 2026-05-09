import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  selected_color: string | null;
  products: {
    id: string;
    name: string;
    price: number;
    image: string;
    images: string[] | null;
    colors: string[] | null;
    category: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, selectedColor?: string | null) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, products(id, name, price, image, images, colors, category)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error loading cart");
    } else {
      setCartItems(data || []);
    }
    setLoading(false);
  };

  const addToCart = async (productId: string, selectedColor?: string | null) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    // Check if item with same color already exists
    const existingItem = cartItems.find(
      item => item.product_id === productId && item.selected_color === (selectedColor || null)
    );

    if (existingItem) {
      // Update quantity instead
      await updateQuantity(existingItem.id, existingItem.quantity + 1);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({ 
        user_id: user.id, 
        product_id: productId, 
        quantity: 1,
        selected_color: selectedColor || null
      });

    if (error) {
      toast.error("Error adding to cart");
    } else {
      toast.success("Added to cart!");
      fetchCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (error) {
      toast.error("Error removing from cart");
    } else {
      toast.success("Removed from cart");
      fetchCart();
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);

    if (error) {
      toast.error("Error updating quantity");
    } else {
      fetchCart();
    }
  };

  const clearCart = async () => {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", user?.id);

    if (error) {
      toast.error("Error clearing cart");
    } else {
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
