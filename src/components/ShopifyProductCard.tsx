import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

export const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const price = product.node.priceRange.minVariantPrice;
  const image = product.node.images.edges[0]?.node?.url;
  const firstVariant = product.node.variants.edges[0]?.node;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) {
      toast.error("Product variant not available");
      return;
    }

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart!");
  };

  return (
    <Link to={`/product/${product.node.handle}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-secondary/20">
          {image ? (
            <img
              src={image}
              alt={product.node.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary/10">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2">{product.node.title}</h3>
          <p className="text-lg font-bold text-primary">
            {price.currencyCode} ${parseFloat(price.amount).toFixed(2)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleAddToCart}
            className="w-full" 
            variant="accent"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
