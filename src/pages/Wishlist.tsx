import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";

const Wishlist = () => {
  // Mock wishlist items - will be replaced with actual data
  const wishlistItems = [
    { id: "1", name: "Diwali Gift Hamper", price: 1299, image: "https://images.unsplash.com/photo-1607081692251-5e8f8e5f2dc3?w=400", category: "Festive" },
    { id: "2", name: "Birthday Surprise Box", price: 999, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400", category: "Birthday" },
    { id: "3", name: "Romantic Gift Set", price: 1499, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400", category: "Anniversary" },
  ];

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
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
