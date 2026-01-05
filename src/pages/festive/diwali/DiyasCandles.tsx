import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useSubcategoryProducts } from "@/hooks/useSubcategoryProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";

const DiyasCandles = () => {
  const { data: products = [] } = useSubcategoryProducts("Festive", "Diyas and Candles");
  const [sortBy, setSortBy] = useState("default");
  const sortedProducts = useSortedProducts(products, sortBy);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-amber-500/30 to-orange-600/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574265935498-66a82e9f0a82?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Diyas & Candles</h1>
            <p className="text-lg text-muted-foreground">
              Illuminate your Diwali with our beautiful collection of traditional diyas and decorative candles
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
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DiyasCandles;
