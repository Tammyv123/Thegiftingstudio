import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./useProducts";

export const useSubcategoryProducts = (category: string, subcategory: string) => {
  return useQuery({
    queryKey: ["products", category.toLowerCase(), subcategory.toLowerCase()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("category", category)
        .ilike("subcategory", subcategory);
      
      if (error) throw error;
      
      return data as Product[];
    },
  });
};
