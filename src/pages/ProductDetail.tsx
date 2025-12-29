import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ColorSelector } from "@/components/ColorSelector";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[] | null;
  colors?: string[] | null;
  category: string;
  description?: string | null;
  subcategory?: string | null;
  stock?: number;
  low_stock_threshold?: number | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });

  // Set default color when product loads
  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
      setSelectedColorIndex(0);
    }
  }, [product]);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleColorSelect = (color: string, index: number) => {
    setSelectedColor(color);
    setSelectedColorIndex(index);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, selectedColor);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product.id);
      }
    }
  };

  // Get images for gallery - if colors exist, show only the selected color's image
  const getProductImages = (): string[] => {
    if (!product) return [];
    
    const hasColors = product.colors && product.colors.length > 0;
    const hasImages = product.images && product.images.length > 0;
    
    // If product has colors and images mapped to colors
    if (hasColors && hasImages) {
      // Show only the image for the selected color
      if (selectedColorIndex < product.images!.length) {
        return [product.images![selectedColorIndex]];
      }
    }
    
    // Default: show all images
    const allImages: string[] = [];
    
    if (product.image) {
      allImages.push(product.image);
    }
    
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && !allImages.includes(img)) {
          allImages.push(img);
        }
      });
    }
    
    return allImages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const productImages = getProductImages();
  const hasColors = product.colors && product.colors.length > 0;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image Gallery */}
          <div className="relative">
            <ProductImageGallery 
              images={productImages} 
              productName={product.name} 
            />
            <div className="absolute top-4 left-4 z-10">
              <span className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-card">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-4xl font-bold text-primary mb-6">₹{Math.round(Number(product.price))}</p>
            </div>

            {/* Color Selector */}
            {hasColors && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Color: <span className="text-primary">{selectedColor}</span>
                </h2>
                <ColorSelector
                  colors={product.colors!}
                  selectedColor={selectedColor}
                  onColorSelect={handleColorSelect}
                  size="md"
                />
              </div>
            )}

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="border-t pt-6 mt-auto">
              <div className="flex gap-4">
                <Button
                  className="flex-1 h-12 text-base shadow-soft"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      isWishlisted ? "fill-primary text-primary" : ""
                    }`}
                  />
                </Button>
              </div>
              <Link to="/checkout">
                <Button variant="secondary" className="w-full mt-4 h-12 text-base">
                  Buy Now
                </Button>
              </Link>
            </div>

            <div className="border-t pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              {selectedColor && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected Color</span>
                  <span className="font-medium">{selectedColor}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-medium text-success">In Stock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">2-3 Business Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
