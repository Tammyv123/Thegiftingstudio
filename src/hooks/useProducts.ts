import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[] | null;
  colors?: string[] | null;
  category: string;
  description?: string | null;
  subcategory?: string | null;
  stock?: number;
  low_stock_threshold?: number | null;
}

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*");
      
      if (category) {
        // Extract the first word for pattern matching (e.g., "Festive" from "Festive Gift")
        const categoryPattern = category.split(' ')[0];
        // Use ilike for case-insensitive pattern matching to include all related products
        query = query.ilike("category", `%${categoryPattern}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as Product[];
    },
  });
};
