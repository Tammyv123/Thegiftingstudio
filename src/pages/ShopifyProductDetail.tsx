import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart, Loader2 } from "lucide-react";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ShopifyProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle!),
    enabled: !!handle,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Button onClick={() => navigate("/products")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const product = {
    node: productData
  };

  const currentVariant = selectedVariant 
    ? product.node.variants.edges.find(v => v.node.id === selectedVariant)?.node
    : product.node.variants.edges[0]?.node;

  const handleAddToCart = () => {
    if (!currentVariant) {
      toast.error("Please select a variant");
      return;
    }

    const cartItem = {
      product,
      variantId: currentVariant.id,
      variantTitle: currentVariant.title,
      price: currentVariant.price,
      quantity: 1,
      selectedOptions: currentVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart!");
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    
    // Find variant that matches all selected options
    const matchingVariant = product.node.variants.edges.find(v => {
      return v.node.selectedOptions.every(opt => 
        newOptions[opt.name] === opt.value
      );
    });
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20">
            {product.node.images.edges[0]?.node ? (
              <img
                src={product.node.images.edges[0].node.url}
                alt={product.node.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.node.title}</h1>
              <p className="text-2xl font-bold text-primary">
                {currentVariant?.price.currencyCode} ${parseFloat(currentVariant?.price.amount || "0").toFixed(2)}
              </p>
            </div>

            {product.node.description && (
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-muted-foreground">{product.node.description}</p>
              </div>
            )}

            {product.node.options.map((option) => (
              <div key={option.name}>
                <label className="mb-2 block font-semibold">{option.name}</label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <Button
                      key={value}
                      variant={selectedOptions[option.name] === value ? "default" : "outline"}
                      onClick={() => handleOptionChange(option.name, value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-auto flex gap-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1" 
                size="lg"
                variant="accent"
                disabled={!currentVariant?.availableForSale}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {currentVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyProductDetail;
