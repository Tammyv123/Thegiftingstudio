import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useSubcategoryProducts } from "@/hooks/useSubcategoryProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";
import { AdminAddProductButton } from "@/components/AdminAddProductButton";

const Rakshabandhan = () => {
  const { data: products = [] } = useSubcategoryProducts("Festive", "Rakshabandhan");
  const [sortBy, setSortBy] = useState("default");
  const sortedProducts = useSortedProducts(products, sortBy);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-sunshine-yellow/30 to-rose-pink/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598520106830-8c45c2035460?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Rakshabandhan Gifts</h1>
            <p className="text-lg text-muted-foreground">
              Celebrate the bond of siblings with special gifts
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <ProductFilters 
            sortBy={sortBy}
            onSortChange={setSortBy}
            productsCount={sortedProducts.length}
          />
          <AdminAddProductButton defaultCategory="Festive" defaultSubcategory="Rakshabandhan" />
        </div>
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

export default Rakshabandhan;
