import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const Products = () => {
  const { data: products = [], isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold">All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection of gifts</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">No products available</p>
        ) : (
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
        )}
      </section>
    </div>
  );
};

export default Products;
