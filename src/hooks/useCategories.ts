import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image: string | null;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name")
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (subcategoriesRes.error) throw subcategoriesRes.error;

      setCategories(categoriesRes.data || []);
      setSubcategories(subcategoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoriesForCategory = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug);
    if (!category) return [];
    return subcategories.filter(sub => sub.category_id === category.id);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find(c => c.slug === slug);
  };

  const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string) => {
    const category = getCategoryBySlug(categorySlug);
    if (!category) return null;
    return subcategories.find(
      sub => sub.category_id === category.id && sub.slug === subcategorySlug
    );
  };

  return {
    categories,
    subcategories,
    loading,
    getSubcategoriesForCategory,
    getCategoryBySlug,
    getSubcategoryBySlug,
    refetch: fetchData
  };
};
