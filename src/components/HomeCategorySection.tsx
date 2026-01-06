import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  images?: string[] | null;
  colors?: string[] | null;
  category: string;
}

interface HomeCategorySectionProps {
  categoryName: string;
  categorySlug: string;
  categoryImage: string | null;
  products: Product[];
  fallbackBanner?: string;
}

export const HomeCategorySection = ({
  categoryName,
  categorySlug,
  categoryImage,
  products,
  fallbackBanner = "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200"
}: HomeCategorySectionProps) => {
  if (products.length === 0) return null;

  const bannerImage = categoryImage || fallbackBanner;
  const categoryLink = `/${categorySlug.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <section className="py-8">
      <div className="relative overflow-hidden h-[280px] flex items-center justify-center mb-8">
        <img 
          src={bannerImage} 
          alt={categoryName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        <div className="relative text-center text-primary-foreground z-10">
          <p className="text-sm uppercase tracking-widest mb-2 opacity-80">The Gifting Studio</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h2>
          <Button variant="secondary" size="sm" asChild className="gap-2">
            <Link to={categoryLink}>
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.slice(0, 10).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={Number(product.price)}
              image={product.image || ""}
              images={product.images}
              colors={product.colors}
              category={product.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
