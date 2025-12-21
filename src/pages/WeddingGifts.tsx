import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { CategorySection } from "@/components/CategorySection";
import { useProducts } from "@/hooks/useProducts";
import { useSortedProducts } from "@/hooks/useSortedProducts";

const WeddingGifts = () => {
  const { data: products = [] } = useProducts("Wedding"); // Fetch Wedding products
  const [sortBy, setSortBy] = useState("default");
  const sortedProducts = useSortedProducts(products, sortBy);

  // Wedding gift categories with Unsplash images
  const categories = [
    {
      title: "Trays",
      description: "Elegant trays for gifting",
      image: "/WeddingPhotos/trays.jpg",
      link: "/wedding/tray",
      gradient: "bg-gradient-to-br from-rose-pink/20 to-sunshine-yellow/20",
    },
    {
      title: "Return Favors",
      description: "Thoughtful keepsakes for guests",
      image: "/WeddingPhotos/ReturnFavours.jpeg",
      link: "/wedding/return-favour",
      gradient: "bg-gradient-to-br from-lavender/20 to-mint-green/20",
    },
    {
      title: "Jewellery",
      description: "Timeless pieces to treasure",
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600",
      link: "/wedding/jewellery",
      gradient: "bg-gradient-to-br from-mint-green/20 to-lavender/20",
    },
    {
      title: "Props",
      description: "Decorative items for special occasions",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600",
      link: "/wedding/props",
      gradient: "bg-gradient-to-br from-sunshine-yellow/20 to-rose-pink/20",
    },
    {
      title: "Hampers",
      description: "Curated gift boxes",
      image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600",
      link: "/wedding/hampers",
      gradient: "bg-gradient-to-br from-rose-pink/20 to-lavender/20",
    },
    {
      title: "Gifts",
      description: "Perfect gifts for every taste",
      image: "https://images.unsplash.com/photo-1612197525106-36be9c2f8933?w=600",
      link: "/wedding/gift",
      gradient: "bg-gradient-to-br from-sky-400/20 to-indigo-400/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-lavender/30 to-mint-green/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Wedding Gifts</h1>
            <p className="text-lg text-muted-foreground">
              Bless their new journey with elegant and memorable wedding gifts
            </p>
          </div>
        </div>
      </section>

      {/* Wedding Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground">Find the perfect wedding gift for every taste</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <CategorySection key={index} {...cat} />
          ))}
        </div>
      </section>

      {/* Wedding Products */}
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
              price={Number(product.price) || 0}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default WeddingGifts;
