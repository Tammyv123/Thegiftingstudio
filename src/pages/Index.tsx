import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CategorySection } from "@/components/CategorySection";
import { HomeCategorySection } from "@/components/HomeCategorySection";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Heart, MessageCircle, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import giftsHeroBanner from "@/assets/banners/gifts-hero.jpg";

// Carousel Banner Images
import weddingBanner from "@/assets/banners/wedding.jpg";
import newYearBanner from "@/assets/banners/new-year.jpg";
import christmasBanner from "@/assets/banners/christmas.jpg";
import birthdayBanner from "@/assets/banners/birthday.jpg";

// Individual Section Banner Images (Fallbacks)
import festiveBanner from "@/assets/banners/festive-banner.jpg";
import personalisedBanner from "@/assets/banners/personalised-banner.jpg";
import hampersBanner from "@/assets/banners/hampers-banner.jpg";
import homeEssentialsBanner from "@/assets/banners/home-essentials-banner.jpg";
import accessoriesBanner from "@/assets/banners/accessories-banner.jpg";
import partySuppliesBanner from "@/assets/banners/party-supplies-banner.jpg";

import { ImageCarousel } from "@/components/ImageCarousel";

// Define the data for the ImageCarousel
const carouselBanners = [
  {
    image: weddingBanner,
    title: "This Wedding Season",
    subtitle: "Find the perfect gift to bless their journey.",
    link: "/wedding",
  },
  {
    image: christmasBanner,
    title: "Merry Christmas Cheer",
    subtitle: "Wonderful gifts to spread joy this festive season.",
    link: "/festive",
  },
  {
    image: newYearBanner,
    title: "Celebrate New Beginnings",
    subtitle: "Start the year fresh with thoughtful new year gifts.",
    link: "/products",
  },
  {
    image: birthdayBanner,
    title: "Make a Birthday Smile",
    subtitle: "Handpicked gifts for the ultimate surprise.",
    link: "/birthday",
  },
];

// Fallback banners mapping for categories without images
const categoryFallbackBanners: Record<string, string> = {
  "wedding gift": weddingBanner,
  "birthday gift": birthdayBanner,
  "festive gift": festiveBanner,
  "personalised gift": personalisedBanner,
  "gourmet hampers": hampersBanner,
  "premium gift": hampersBanner,
  "home essentials": homeEssentialsBanner,
  "accessories": accessoriesBanner,
  "party supplies": partySuppliesBanner,
  "anniversary gift": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200",
  "corporate gift": "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200",
};

const Index = () => {
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  // WhatsApp link
  const phoneNumber = "918447717322";
  const message = "Hi! I'd like to place an order from The Gifting Studio.";

  // Get products for a category (mix of all subcategories, up to 10)
  const getProductsForCategory = (categoryName: string) => {
    return allProducts
      .filter(p => p.category.toLowerCase() === categoryName.toLowerCase())
      .slice(0, 10);
  };

  // Get fallback banner for category
  const getFallbackBanner = (categorySlug: string) => {
    return categoryFallbackBanners[categorySlug.toLowerCase()] || 
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200";
  };

  // Category cards data for "Shop by Occasion" section
  const occasionCards = [
    {
      title: "Festive Gifts",
      description: "Celebrate traditions with joy",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600",
      link: "/festive",
      gradient: "bg-gradient-to-br from-rose-pink/20 to-sunshine-yellow/20",
    },
    {
      title: "Wedding Gifts",
      description: "Bless their new beginning",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
      link: "/wedding",
      gradient: "bg-gradient-to-br from-lavender/20 to-mint-green/20",
    },
    {
      title: "Personalised Gifts",
      description: "Make it uniquely theirs",
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600",
      link: "/personalised",
      gradient: "bg-gradient-to-br from-mint-green/20 to-lavender/20",
    },
    {
      title: "Birthday Gifts",
      description: "Celebrate another wonderful year",
      image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600",
      link: "/birthday",
      gradient: "bg-gradient-to-br from-sunshine-yellow/20 to-rose-pink/20",
    },
    {
      title: "Anniversary Gifts",
      description: "Honor love that lasts",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600",
      link: "/anniversary",
      gradient: "bg-gradient-to-br from-rose-pink/20 to-lavender/20",
    },
    {
      title: "Corporate Gifts",
      description: "Appreciate your team",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600",
      link: "/corporate",
      gradient: "bg-gradient-to-br from-sky-400/20 to-indigo-400/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden h-[500px] flex items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${giftsHeroBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto text-primary-foreground">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">India's Premium Gifting Destination</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Gifts That Make
            <br />
            Hearts Smile
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-95">
            Discover thoughtfully curated gifts for every celebration. From festive hampers to personalized treasures.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="shadow-hover" asChild>
              <Link to="/products">
                <Gift className="mr-2 h-5 w-5" />
                Browse Collections
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="shadow-hover text-green-600"
              asChild
            >
              <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Order on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="container mx-auto px-4 pt-8">
        <ImageCarousel items={carouselBanners} interval={6000} />
      </section>

      {/* Shop by Occasion */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold">Shop by Occasion</h2>
          <p className="text-muted-foreground">Find the perfect gift for every special moment</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {occasionCards.map((cat, index) => (
            <CategorySection key={index} {...cat} />
          ))}
        </div>
      </section>

      {/* Dynamic Category Sections with Banners and Products */}
      {categoriesLoading || productsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        categories.map((category) => {
          const categoryProducts = getProductsForCategory(category.name);
          if (categoryProducts.length === 0) return null;

          return (
            <HomeCategorySection
              key={category.id}
              categoryName={category.name}
              categorySlug={category.slug}
              categoryImage={category.image}
              products={categoryProducts}
              fallbackBanner={getFallbackBanner(category.slug)}
            />
          );
        })
      )}

      {/* CTA Banner */}
      <section className="bg-gradient-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-4 text-3xl font-bold">Love Every Moment</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-95">
            Join thousands of happy customers who trust us to make their celebrations special
          </p>
          <Button size="lg" variant="secondary" className="shadow-hover" asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 The Gifting Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
