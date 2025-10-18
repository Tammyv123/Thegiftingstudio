import { Navbar } from "@/components/Navbar";
import { CategorySection } from "@/components/CategorySection";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Heart, MessageCircle } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const Index = () => {
  const { data: allProducts = [] } = useProducts();
  
  const festiveProducts = allProducts.filter(p => p.category === "Festive").slice(0, 4);
  const birthdayProducts = allProducts.filter(p => p.category === "Birthday").slice(0, 4);

  const whatsappMessage = "Hi! I'd like to place an order from The Gifting Studio.";
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary py-20 px-4">
        <div className="container mx-auto text-center text-primary-foreground">
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
            <Button size="lg" variant="secondary" className="shadow-hover">
              <Gift className="mr-2 h-5 w-5" />
              Browse Collections
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-primary-foreground hover:bg-white/10"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Order on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold">Shop by Occasion</h2>
          <p className="text-muted-foreground">Find the perfect gift for every special moment</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CategorySection
            title="Festive Gifts"
            description="Celebrate traditions with joy"
            image="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600"
            link="/festive"
            gradient="bg-gradient-to-br from-rose-pink/20 to-sunshine-yellow/20"
          />
          <CategorySection
            title="Wedding Gifts"
            description="Bless their new beginning"
            image="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600"
            link="/wedding"
            gradient="bg-gradient-to-br from-lavender/20 to-mint-green/20"
          />
          <CategorySection
            title="Personalised Gifts"
            description="Make it uniquely theirs"
            image="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600"
            link="/personalised"
            gradient="bg-gradient-to-br from-mint-green/20 to-lavender/20"
          />
          <CategorySection
            title="Birthday Gifts"
            description="Celebrate another wonderful year"
            image="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600"
            link="/birthday"
            gradient="bg-gradient-to-br from-sunshine-yellow/20 to-rose-pink/20"
          />
          <CategorySection
            title="Anniversary Gifts"
            description="Honor love that lasts"
            image="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600"
            link="/anniversary"
            gradient="bg-gradient-to-br from-rose-pink/20 to-lavender/20"
          />
        </div>
      </section>

      {/* Festival Essentials */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Festival Essentials</h2>
              <p className="text-muted-foreground">Trending gifts for the season</p>
            </div>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {festiveProducts.map((product) => (
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
        </div>
      </section>

      {/* Birthday Gifts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Birthday Specials</h2>
              <p className="text-muted-foreground">Make their day unforgettable</p>
            </div>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {birthdayProducts.map((product) => (
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
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-4 text-3xl font-bold">Love Every Moment</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-95">
            Join thousands of happy customers who trust us to make their celebrations special
          </p>
          <Button size="lg" variant="secondary" className="shadow-hover">
            Start Shopping
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 The Gifting Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
