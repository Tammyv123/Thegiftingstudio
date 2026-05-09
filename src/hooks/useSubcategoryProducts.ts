import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./useProducts";

export const useSubcategoryProducts = (category: string, subcategory: string) => {
  return useQuery({
    queryKey: ["products", category.toLowerCase(), subcategory.toLowerCase()],
    queryFn: async () => {
      // Use wildcard pattern to match both "wedding" and "wedding gift" etc.
      const categoryPattern = `%${category.split(' ')[0]}%`;
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("category", categoryPattern)
        .ilike("subcategory", `%${subcategory}%`);
      
      if (error) throw error;
      
      return data as Product[];
    },
  });
};
