import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    category: string;
    subcategory?: string | null;
    stock?: number;
    low_stock_threshold?: number | null;
  };
}

export const ProductEditDialog = ({ open, onOpenChange, product }: ProductEditDialogProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    price: String(product.price),
    description: product.description || "",
    category: product.category,
    subcategory: product.subcategory || "",
    stock: String(product.stock || 0),
    low_stock_threshold: String(product.low_stock_threshold || 10),
  });

  const subcategories = SUBCATEGORIES[formData.category] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          price: Math.round(parseFloat(formData.price)),
          description: formData.description || null,
          category: formData.category,
          subcategory: formData.subcategory || null,
          stock: parseInt(formData.stock),
          low_stock_threshold: parseInt(formData.low_stock_threshold),
        })
        .eq("id", product.id);

      if (error) throw error;

      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value, subcategory: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
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
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcat) => (
                      <SelectItem key={subcat} value={subcat} className="capitalize">
                        {subcat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="low_stock_threshold">Low Stock Alert Threshold</Label>
            <Input
              id="low_stock_threshold"
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
              placeholder="10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
