import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, X, Plus, ImagePlus, Package, Tag, IndianRupee, FileText, Palette, Boxes } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIES = [
  "festive gift",
  "wedding gift",
  "birthday gift",
  "anniversary gift",
  "personalised gift",
  "premium gift",
  "home essentials",
  "accessories",
  "party supplies",
  "corporate gift",
  "gourmet hampers"
];

const SUBCATEGORIES: Record<string, string[]> = {
  "wedding gift": ["trays", "return favours", "jewellery", "props", "hampers", "gifts"],
  "festive gift": ["diwali", "holi", "christmas", "eid", "rakshabandhan", "new year", "lohri"],
  "birthday gift": ["gift for her", "gift for him", "gift for mother", "gift for father", "gift for sibling"],
  "accessories": ["earrings", "necklace", "hand", "hair"],
  "anniversary gift": ["romantic", "personalized", "luxury"],
  "personalised gift": ["engraved", "photo", "custom"],
  "premium gift": ["luxury hampers", "designer", "exclusive"],
  "home essentials": ["decor", "kitchen", "living"],
  "party supplies": ["decorations", "tableware", "balloons"],
  "corporate gift": ["executive", "bulk", "branded"],
  "gourmet hampers": ["chocolate", "wine", "snacks", "tea"]
};

interface ProductFormProps {
  defaultCategory?: string;
  defaultSubcategory?: string;
  onSuccess?: () => void;
}

export const ProductForm = ({ defaultCategory, defaultSubcategory, onSuccess }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: defaultCategory || "",
    subcategory: defaultSubcategory || "",
    description: "",
    price: "",
    colors: "",
    stock: "",
    lowStockThreshold: "10",
  });
  const [imageCount, setImageCount] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
        category: defaultCategory || "",
        subcategory: defaultSubcategory || "",
        description: "",
        price: "",
        colors: "",
        stock: "",
        lowStockThreshold: "10",
      });
      setImages([]);
      setPreviewUrls([]);
      setImageCount(1);
      
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...images];
    const newPreviews = [...previewUrls];
    
    if (file) {
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
    } else {
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
    }
    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const subcategories = SUBCATEGORIES[formData.category] || [];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Add New Product
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Fill in the details to add a new product to your store
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Preview Card */}
            {(formData.name || previewUrls[0] || formData.price) && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Live Preview
                </h3>
                <div className="flex gap-6 items-start">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border-2 border-dashed border-border">
                    {previewUrls[0] ? (
                      <img src={previewUrls[0]} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-semibold truncate">
                      {formData.name || "Product Name"}
                    </h4>
                    <p className="text-2xl font-bold text-primary mt-1">
                      ₹{formData.price || "0"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {formData.description || "Product description will appear here..."}
                    </p>
                    {formData.category && (
                      <div className="flex gap-2 mt-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {formData.category}
                        </span>
                        {formData.subcategory && (
                          <span className="px-2 py-1 text-xs rounded-full bg-secondary/50 text-secondary-foreground">
                            {formData.subcategory}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium">
                <Tag className="h-4 w-4 text-primary" />
                Product Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                className="h-12 text-lg border-border/50 focus:border-primary transition-colors"
                required
              />
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2 text-base font-medium">
                  <Boxes className="h-4 w-4 text-primary" />
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value, subcategory: "" })}
                >
                  <SelectTrigger className="h-12 text-base border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-base capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {subcategories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory" className="flex items-center gap-2 text-base font-medium">
                    <Tag className="h-4 w-4 text-primary" />
                    Subcategory
                  </Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                  >
                    <SelectTrigger className="h-12 text-base border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcat) => (
                        <SelectItem key={subcat} value={subcat} className="text-base capitalize">
                          {subcat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2 text-base font-medium">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  Price
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="price"
                    type="number"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="h-12 text-lg pl-8 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="flex items-center gap-2 text-base font-medium">
                  <Package className="h-4 w-4 text-primary" />
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className="h-12 text-lg border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold" className="text-base font-medium">
                  Low Stock Alert
                </Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  placeholder="10"
                  className="h-12 text-lg border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium">
                <FileText className="h-4 w-4 text-primary" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product..."
                rows={4}
                className="text-base border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <Label htmlFor="colors" className="flex items-center gap-2 text-base font-medium">
                <Palette className="h-4 w-4 text-primary" />
                Colors Available
              </Label>
              <Input
                id="colors"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="Red, Blue, Green (comma separated)"
                className="h-12 text-base border-border/50 focus:border-primary"
              />
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  Product Images
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setImageCount(Math.min(10, imageCount + 1))}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add More
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: imageCount }).map((_, index) => (
                  <div key={index} className="relative group">
                    <label className="block cursor-pointer">
                      <div className={`aspect-square rounded-xl border-2 border-dashed transition-all overflow-hidden ${
                        previewUrls[index] 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 bg-muted/50'
                      }`}>
                        {previewUrls[index] ? (
                          <img 
                            src={previewUrls[index]} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                            <ImagePlus className="h-8 w-8 mb-2" />
                            <span className="text-xs">Image {index + 1}</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
                        className="hidden"
                        required={index === 0}
                      />
                    </label>
                    {previewUrls[index] && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleImageChange(index, null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
