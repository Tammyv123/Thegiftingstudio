import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";
import { AdminAddProductButton } from "@/components/AdminAddProductButton";

const HomeEssentials = () => {
  const { data: allProducts = [], isLoading } = useProducts();
  const [sortBy, setSortBy] = useState("default");
  
  const homeProducts = allProducts.filter(p => p.category === "Home Essentials");
  const sortedProducts = useSortedProducts(homeProducts, sortBy);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold">Home Essentials</h1>
          <p className="text-muted-foreground">Make your home special with our curated collection</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <ProductFilters 
            sortBy={sortBy}
            onSortChange={setSortBy}
            productsCount={sortedProducts.length}
          />
          <AdminAddProductButton defaultCategory="Home Essentials" />
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <p className="text-center text-muted-foreground">No products available. We'll be launching some soon!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeEssentials;
