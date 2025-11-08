import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useSubcategoryProducts } from "@/hooks/useSubcategoryProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";

const WeddingTray = () => {
  const { data: products = [] } = useSubcategoryProducts("Wedding", "Tray");
  const [sortBy, setSortBy] = useState("default");
  const sortedProducts = useSortedProducts(products, sortBy);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-rose-pink/30 to-lavender/30">
        <div className="absolute inset-0 bg-[url('/WeddingPhotos/trays.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Wedding Trays</h1>
            <p className="text-lg text-muted-foreground">
              Elegant trays for your special day
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <ProductFilters 
          sortBy={sortBy}
          onSortChange={setSortBy}
          productsCount={sortedProducts.length}
        />
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
      </section>
    </div>
  );
};

export default WeddingTray;
