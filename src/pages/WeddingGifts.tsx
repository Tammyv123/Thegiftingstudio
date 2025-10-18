import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const WeddingGifts = () => {
  const products = [
    { id: "w1", name: "Royal Wedding Gift Set", price: 2499, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400", category: "Wedding" },
    { id: "w2", name: "Couple Blessing Hamper", price: 1899, image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400", category: "Wedding" },
    { id: "w3", name: "Traditional Silver Gift Box", price: 3499, image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400", category: "Wedding" },
    { id: "w4", name: "Decorative Wedding Basket", price: 1599, image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400", category: "Wedding" },
    { id: "w5", name: "Premium Crystal Gift Set", price: 2999, image: "https://images.unsplash.com/photo-1535478044878-3ed83d5456ef?w=400", category: "Wedding" },
    { id: "w6", name: "Gold Plated Wedding Gift", price: 4499, image: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400", category: "Wedding" },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
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

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-muted-foreground">{products.length} products</p>
          <Button variant="outline" size="sm">Filter & Sort</Button>
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

export default WeddingGifts;
