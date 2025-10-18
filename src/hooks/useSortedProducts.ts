import { useMemo } from "react";
import { Product } from "./useProducts";

export const useSortedProducts = (products: Product[], sortBy: string) => {
  return useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-high":
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [products, sortBy]);
};
