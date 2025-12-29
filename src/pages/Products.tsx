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
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No products found</p>
            <p className="text-sm text-muted-foreground">
              Create your first product by telling me what you want to sell!
            </p>
          </div>
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
                description={product.description}
                subcategory={product.subcategory}
                stock={product.stock}
                low_stock_threshold={product.low_stock_threshold}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
