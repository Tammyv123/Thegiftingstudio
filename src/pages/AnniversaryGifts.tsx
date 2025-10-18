import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const AnniversaryGifts = () => {
  const products = [
    { id: "a1", name: "Romantic Gift Set", price: 1499, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400", category: "Anniversary" },
    { id: "a2", name: "Couple Photo Album", price: 899, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", category: "Anniversary" },
    { id: "a3", name: "Engraved Wine Glasses", price: 1299, image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400", category: "Anniversary" },
    { id: "a4", name: "Love Story Book", price: 799, image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400", category: "Anniversary" },
    { id: "a5", name: "Heart-Shaped Jewelry Box", price: 999, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", category: "Anniversary" },
    { id: "a6", name: "Luxury Spa Gift Set", price: 1999, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400", category: "Anniversary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-rose-pink/30 to-lavender/30">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative flex h-full items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="mb-4 text-5xl font-bold">Anniversary Gifts</h1>
            <p className="text-lg text-muted-foreground">
              Celebrate love and togetherness with romantic anniversary gifts
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

export default AnniversaryGifts;
