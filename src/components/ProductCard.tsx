import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(id);

  const handleAddToCart = () => {
    addToCart(id);
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:shadow-hover bg-gradient-card">
      <Link to={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden cursor-pointer">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.preventDefault();
            handleToggleWishlist();
          }}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isWishlisted ? "fill-primary text-primary" : ""
            }`}
          />
        </Button>
        <div className="absolute bottom-2 left-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {category}
          </span>
        </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer">{name}</h3>
        </Link>
        <p className="text-2xl font-bold text-primary">₹{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full shadow-soft"
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
