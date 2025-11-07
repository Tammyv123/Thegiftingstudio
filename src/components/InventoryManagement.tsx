import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Package, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
}

export const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price, stock, low_stock_threshold")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    setUpdating(productId);
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock: newStock } : p
      ));
      
      const { [productId]: _, ...rest } = stockUpdates;
      setStockUpdates(rest);
      
      toast.success("Stock updated successfully");
    } catch (error: any) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    } finally {
      setUpdating(null);
    }
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= threshold) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const lowStockProducts = products.filter(p => p.stock <= p.low_stock_threshold && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Total Products</h3>
          </div>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Low Stock</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{lowStockProducts.length}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold">Out of Stock</h3>
          </div>
          <p className="text-3xl font-bold text-destructive">{outOfStockProducts.length}</p>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Alert Threshold</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const status = getStockStatus(product.stock, product.low_stock_threshold);
              const pendingUpdate = stockUpdates[product.id];
              const displayStock = pendingUpdate !== undefined ? pendingUpdate : product.stock;

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min="0"
                      value={displayStock}
                      onChange={(e) => setStockUpdates({
                        ...stockUpdates,
                        [product.id]: parseInt(e.target.value) || 0
                      })}
                      className="w-24 ml-auto"
                    />
                  </TableCell>
                  <TableCell className="text-right">{product.low_stock_threshold}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => updateStock(product.id, displayStock)}
                      disabled={updating === product.id || pendingUpdate === undefined}
                    >
                      {updating === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
