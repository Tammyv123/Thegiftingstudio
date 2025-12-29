import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

interface SearchResultsProps {
  searchQuery: string;
}

export const SearchResults = ({ searchQuery }: SearchResultsProps) => {
  const { data: allProducts = [], isLoading } = useProducts();

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <p className="text-sm text-muted-foreground mb-4 px-2">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
      </p>
      <div className="grid grid-cols-2 gap-4 px-2">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={Number(product.price)}
            image={product.image}
            images={product.images}
            colors={product.colors}
            category={product.category}
            description={product.description}
            subcategory={product.subcategory}
            stock={product.stock}
            low_stock_threshold={product.low_stock_threshold}
          />
        ))}
      </div>
    </div>
  );
};
