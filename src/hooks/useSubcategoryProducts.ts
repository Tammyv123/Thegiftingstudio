import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./useProducts";

export const useSubcategoryProducts = (category: string, subcategory: string) => {
  return useQuery({
    queryKey: ["products", category, subcategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .eq("subcategory", subcategory);
      
      if (error) throw error;
      
      return data as Product[];
    },
  });
};
