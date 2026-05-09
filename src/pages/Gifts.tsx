import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";
import { Card } from "@/components/ui/card";
import { AdminAddProductButton } from "@/components/AdminAddProductButton";

const giftCategories = [
  { name: "Gifts for Mother", path: "/gifts/gift-for-mother", image: "/images/mom.png", description: "Make mom feel special" },
  { name: "Gifts for Father", path: "/gifts/gift-for-father", image: "/images/dad.png", description: "For the best dad" },
  { name: "Gifts for Siblings", path: "/gifts/gift-for-sibling", image: "/images/sibling.png", description: "Sibling love" },
  { name: "Gifts for Him", path: "/gifts/gift-for-him", image: "/images/him.png", description: "Perfect for him" },
  { name: "Gifts for Her", path: "/gifts/gift-for-her", image: "/images/her.png", description: "Perfect for her" },
    { name: "Gifts for Corporate", path: "/gifts/gift-for-corporate", image: "/images/corporate.png", description: "For your colleagues" },

];

const Gifts = () => {
  const { data: products = [] } = useProducts("Gifts");
  const [sortBy, setSortBy] = useState("default");
  const sortedProducts = useSortedProducts(products, sortBy);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-rose-pink/30 to-lavender/30">
        <div className="absolute inset-0 bg-[url('/images/gifts.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex h-full items-center justify-center text-center">
          {/* <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Gifts</h1>
            <p className="text-lg text-muted-foreground">
              Perfect gifts for birthdays, anniversaries, and every special moment
            </p>
          </div> */}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Shop by Recipient</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {giftCategories.map((category) => (
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
        <h2 className="mb-8 text-center text-3xl font-bold">All Gift Products</h2>
        <div className="flex items-center justify-between mb-6">
          <ProductFilters 
            sortBy={sortBy}
            onSortChange={setSortBy}
            productsCount={sortedProducts.length}
          />
          <AdminAddProductButton defaultCategory="Gifts" />
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

export default Gifts;
