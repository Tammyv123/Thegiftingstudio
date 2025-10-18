import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const PersonalisedGifts = () => {
  const products = [
    { id: "p1", name: "Custom Photo Frame", price: 699, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", category: "Personalised" },
    { id: "p2", name: "Engraved Wooden Box", price: 899, image: "https://images.unsplash.com/photo-1514022005183-9c53b85cd2ed?w=400", category: "Personalised" },
    { id: "p3", name: "Personalized Coffee Mug", price: 499, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400", category: "Personalised" },
    { id: "p4", name: "Custom Name Keychain", price: 299, image: "https://images.unsplash.com/photo-1554034483-04fda0d3507b?w=400", category: "Personalised" },
    { id: "p5", name: "Engraved Crystal Trophy", price: 1299, image: "https://images.unsplash.com/photo-1535478044878-3ed83d5456ef?w=400", category: "Personalised" },
    { id: "p6", name: "Personalized Cushion", price: 799, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400", category: "Personalised" },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-mint-green/30 to-lavender/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Personalised Gifts</h1>
            <p className="text-lg text-muted-foreground">
              Make it extra special with customized gifts that show you care
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

export default PersonalisedGifts;
