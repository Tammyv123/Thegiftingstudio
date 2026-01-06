import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";
import { Card, CardContent } from "@/components/ui/card";
import { AdminAddProductButton } from "@/components/AdminAddProductButton";

const festiveCategories = [
  { name: "Holi", path: "/festive/holi", image: "https://images.unsplash.com/photo-1583241800698-c318921e0f01?w=400", description: "Festival of Colors" },
  { name: "Diwali", path: "/festive/diwali", image: "https://images.unsplash.com/photo-1605649487212-47b9e5ffbb2f?w=400", description: "Festival of Lights" },
  { name: "Christmas", path: "/festive/christmas", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400", description: "Season of Joy" },
  { name: "New Year", path: "/festive/new-year", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400", description: "New Beginnings" },
  { name: "Rakshabandhan", path: "/festive/rakshabandhan", image: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?w=400", description: "Bond of Siblings" },
  { name: "Eid", path: "/festive/eid", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", description: "Blessed Celebrations" },
  { name: "Lohri", path: "/festive/lohri", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400", description: "Harvest Festival" },
];

const FestiveGifts = () => {
  const { data: products = [] } = useProducts("Festive");
  const [sortBy, setSortBy] = useState("default");
  const sortedProducts = useSortedProducts(products, sortBy);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      {/* Banner */}
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-rose-pink/30 to-sunshine-yellow/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Festive Gifts</h1>
            <p className="text-lg text-muted-foreground">
              Celebrate every festival with our handpicked collection of traditional and modern gift hampers
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Shop by Festival</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {festiveCategories.map((category) => (
            <Link key={category.name} to={category.path}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* All Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">All Festive Products</h2>
        <div className="flex items-center justify-between mb-6">
          <ProductFilters 
            sortBy={sortBy}
            onSortChange={setSortBy}
            productsCount={sortedProducts.length}
          />
          <AdminAddProductButton defaultCategory="Festive" />
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

export default FestiveGifts;
