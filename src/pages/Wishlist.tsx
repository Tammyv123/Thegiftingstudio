import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";

const Wishlist = () => {
  const { wishlistItems, loading } = useWishlist();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((item) => (
              <ProductCard 
                key={item.id} 
                id={item.products.id}
                name={item.products.name}
                price={Number(item.products.price)}
                image={item.products.image}
                category={item.products.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
