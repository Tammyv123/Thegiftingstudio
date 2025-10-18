import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";

const BirthdayGifts = () => {
  const { data: products = [] } = useProducts("Birthday");

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

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-muted-foreground">{products.length} products</p>
          <Button variant="outline" size="sm">Filter & Sort</Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
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
