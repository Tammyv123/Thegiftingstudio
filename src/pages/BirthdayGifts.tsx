import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";
import { Card } from "@/components/ui/card";
import { AdminAddProductButton } from "@/components/AdminAddProductButton";

const birthdayCategories = [
  { name: "Gifts for Mother", path: "/birthday/gift-for-mother", image: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=400", description: "Make mom feel special" },
  { name: "Gifts for Father", path: "/birthday/gift-for-father", image: "https://images.unsplash.com/photo-1560003355-5270b2e45da6?w=400", description: "For the best dad" },
  { name: "Gifts for Siblings", path: "/birthday/gift-for-sibling", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", description: "Sibling love" },
  { name: "Gifts for Him", path: "/birthday/gift-for-him", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400", description: "Perfect for him" },
  { name: "Gifts for Her", path: "/birthday/gift-for-her", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", description: "Perfect for her" },
];

const BirthdayGifts = () => {
  const { data: products = [] } = useProducts("Birthday");
  const [sortBy, setSortBy] = useState("default");
  const sortedProducts = useSortedProducts(products, sortBy);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-sunshine-yellow/30 to-rose-pink/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Birthday Gifts</h1>
            <p className="text-lg text-muted-foreground">
              Celebrate their special day with unforgettable birthday gifts
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Shop by Recipient</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {birthdayCategories.map((category) => (
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
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-xs opacity-90">{category.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* All Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">All Birthday Products</h2>
        <div className="flex items-center justify-between mb-6">
          <ProductFilters 
            sortBy={sortBy}
            onSortChange={setSortBy}
            productsCount={sortedProducts.length}
          />
          <AdminAddProductButton defaultCategory="Birthday" />
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

export default BirthdayGifts;
