import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const FestiveGifts = () => {
  const products = [
    { id: "1", name: "Diwali Gift Hamper Deluxe", price: 1299, image: "https://images.unsplash.com/photo-1607081692251-5e8f8e5f2dc3?w=400", category: "Festive" },
    { id: "2", name: "Raksha Bandhan Special Box", price: 899, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", category: "Festive" },
    { id: "3", name: "Christmas Gift Collection", price: 1499, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400", category: "Festive" },
    { id: "4", name: "Holi Color Festival Set", price: 699, image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400", category: "Festive" },
    { id: "5", name: "Eid Celebration Pack", price: 999, image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400", category: "Festive" },
    { id: "6", name: "Navratri Special Gifts", price: 1199, image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400", category: "Festive" },
    { id: "7", name: "New Year Gift Bundle", price: 1599, image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400", category: "Festive" },
    { id: "8", name: "Pongal Traditional Set", price: 799, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400", category: "Festive" },
  ];

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

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-muted-foreground">{products.length} products</p>
          <Button variant="outline" size="sm">
            Filter & Sort
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FestiveGifts;
