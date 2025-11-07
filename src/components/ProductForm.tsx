import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

const CATEGORIES = [
  "festive gift",
  "wedding gift",
  "birthday gift",
  "anniversary gift",
  "personalised gift",
  "premium gift",
  "home essentials",
  "accessories",
  "party supplies"
];

const SUBCATEGORIES: Record<string, string[]> = {
  "wedding gift": ["trays", "return favours", "jewellery", "props", "hampers", "gifts"],
  "festive gift": ["diwali", "holi", "christmas", "eid", "rakshabandhan", "new year"]
};

export const ProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    price: "",
    colors: "",
    stock: "",
    lowStockThreshold: "10",
  });
  const [imageCount, setImageCount] = useState(1);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls: string[] = [];
      
      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Insert product
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          category: formData.category,
          subcategory: formData.subcategory || null,
          description: formData.description,
          price: parseFloat(formData.price),
          colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
          images: imageUrls,
          image: imageUrls[0] || null,
          stock: parseInt(formData.stock),
          low_stock_threshold: parseInt(formData.lowStockThreshold)
        });

      if (insertError) throw insertError;

      toast.success("Product added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        category: "",
        subcategory: "",
        description: "",
        price: "",
        colors: "",
        stock: "",
        lowStockThreshold: "10",
      });
      setImages([]);
      setImageCount(1);
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...images];
    if (file) {
      newImages[index] = file;
    } else {
      newImages.splice(index, 1);
    }
    setImages(newImages);
  };

  const subcategories = SUBCATEGORIES[formData.category] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value, subcategory: "" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {subcategories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={formData.subcategory}
            onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory (optional)" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            min="0"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="colors">Colors Available (comma separated)</Label>
        <Input
          id="colors"
          value={formData.colors}
          onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
          placeholder="Red, Blue, Green"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageCount">Number of Images</Label>
        <Input
          id="imageCount"
          type="number"
          min="1"
          max="10"
          value={imageCount}
          onChange={(e) => setImageCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
        />
      </div>

      <div className="space-y-4">
        <Label>Product Images</Label>
        {Array.from({ length: imageCount }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
              required={index === 0}
            />
            {images[index] && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleImageChange(index, null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Product...
          </>
        ) : (
          "Add Product"
        )}
      </Button>
    </form>
  );
};
