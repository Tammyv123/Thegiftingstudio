import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useSubcategoryProducts } from "@/hooks/useSubcategoryProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";
import { Card } from "@/components/ui/card";
import { AdminAddProductButton } from "@/components/AdminAddProductButton";

const diwaliSubcategories = [
  { 
    name: "Diyas & Candles", 
    path: "/festive/diwali/diyas-candles", 
    image: "https://images.unsplash.com/photo-1574265935498-66a82e9f0a82?w=400", 
    description: "Traditional diyas & decorative candles" 
  },
];

const Diwali = () => {
  const { data: products = [] } = useSubcategoryProducts("Festive", "Diwali");
  const [sortBy, setSortBy] = useState("default");
  const sortedProducts = useSortedProducts(products, sortBy);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-sunshine-yellow/30 to-rose-pink/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605649487212-47b9e5ffbb2f?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Diwali Gifts</h1>
            <p className="text-lg text-muted-foreground">
              Celebrate the festival of lights with special gifts
            </p>
          </div>
        </div>
      </section>

      {/* Subcategories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold">Shop by Category</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {diwaliSubcategories.map((category) => (
            <Link key={category.name} to={category.path}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-6 text-center text-2xl font-bold">All Diwali Products</h2>
        <div className="flex items-center justify-between mb-6">
          <ProductFilters 
            sortBy={sortBy}
            onSortChange={setSortBy}
            productsCount={sortedProducts.length}
          />
          <AdminAddProductButton defaultCategory="Festive" defaultSubcategory="Diwali" />
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

export default Diwali;
