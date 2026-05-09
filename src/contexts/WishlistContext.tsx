import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  product_id: string;
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

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*, products(id, name, price, image, images, colors, category)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error loading wishlist");
    } else {
      setWishlistItems(data || []);
    }
    setLoading(false);
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to wishlist");
      return;
    }

    const { error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: user.id, product_id: productId });

    if (error) {
      toast.error("Error adding to wishlist");
    } else {
      toast.success("Added to wishlist!");
      fetchWishlist();
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user?.id);

    if (error) {
      toast.error("Error removing from wishlist");
    } else {
      toast.success("Removed from wishlist");
      fetchWishlist();
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
