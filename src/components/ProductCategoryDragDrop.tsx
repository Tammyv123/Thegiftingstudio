import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Package, FolderOpen, Search, GripVertical } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  subcategory: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
}

export const ProductCategoryDragDrop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        supabase.from("products").select("id, name, price, image, category, subcategory").order("name"),
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name")
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (subcategoriesRes.error) throw subcategoriesRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setSubcategories(subcategoriesRes.data || []);
      
      // Auto-expand first category
      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setExpandedCategories(new Set([categoriesRes.data[0].name]));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoriesForCategory = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return [];
    return subcategories.filter(sub => sub.category_id === category.id);
  };

  const getProductsForCategory = (categoryName: string, subcategoryName?: string) => {
    return products.filter(p => {
      const categoryMatch = p.category.toLowerCase() === categoryName.toLowerCase();
      if (subcategoryName) {
        return categoryMatch && p.subcategory?.toLowerCase() === subcategoryName.toLowerCase();
      }
      return categoryMatch && !p.subcategory;
    });
  };

  const getUnassignedProducts = () => {
    const categoryNames = categories.map(c => c.name.toLowerCase());
    return products.filter(p => !categoryNames.includes(p.category.toLowerCase()));
  };

  const filteredProducts = searchTerm
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const productId = draggableId;
    const dropZone = destination.droppableId;

    // Parse the drop zone (format: "category:categoryName" or "subcategory:categoryName:subcategoryName")
    const parts = dropZone.split(":");
    let newCategory = "";
    let newSubcategory: string | null = null;

    if (parts[0] === "category") {
      newCategory = parts[1];
    } else if (parts[0] === "subcategory") {
      newCategory = parts[1];
      newSubcategory = parts[2];
    } else {
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if already in the same category/subcategory
    if (product.category === newCategory && product.subcategory === newSubcategory) {
      return;
    }

    setUpdating(productId);

    try {
      const { error } = await supabase
        .from("products")
        .update({ 
          category: newCategory, 
          subcategory: newSubcategory 
        })
        .eq("id", productId);

      if (error) throw error;

      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, category: newCategory, subcategory: newSubcategory }
          : p
      ));

      toast.success(`Moved "${product.name}" to ${newSubcategory || newCategory}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to move product");
    } finally {
      setUpdating(null);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const unassignedProducts = getUnassignedProducts();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products to drag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">
                Search Results ({filteredProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <Droppable droppableId="search-results" isDropDisabled>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-1"
                  >
                    {filteredProducts.map((product, index) => (
                      <Draggable key={product.id} draggableId={product.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-2 p-2 rounded-lg border bg-background ${
                              snapshot.isDragging ? "shadow-lg ring-2 ring-primary" : ""
                            } ${updating === product.id ? "opacity-50" : ""}`}
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-8 h-8 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.subcategory ? `${product.category} → ${product.subcategory}` : product.category}
                              </p>
                            </div>
                            <Badge variant="secondary" className="flex-shrink-0">
                              ₹{Math.round(product.price)}
                            </Badge>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {filteredProducts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No products found
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        )}

        {/* Unassigned Products */}
        {unassignedProducts.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
                <Package className="h-4 w-4" />
                Unassigned Products ({unassignedProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <Droppable droppableId="unassigned" isDropDisabled>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-wrap gap-2"
                  >
                    {unassignedProducts.map((product, index) => (
                      <Draggable key={product.id} draggableId={product.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-2 p-2 rounded-lg border bg-background ${
                              snapshot.isDragging ? "shadow-lg ring-2 ring-primary" : ""
                            } ${updating === product.id ? "opacity-50" : ""}`}
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{product.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        )}

        {/* Categories Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const categorySubcats = getSubcategoriesForCategory(category.name);
            const categoryProducts = getProductsForCategory(category.name);
            const isExpanded = expandedCategories.has(category.name);
            const totalProducts = products.filter(p => 
              p.category.toLowerCase() === category.name.toLowerCase()
            ).length;

            return (
              <Card key={category.id} className="flex flex-col">
                <CardHeader 
                  className="py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCategory(category.name)}
                >
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      {category.name}
                    </div>
                    <Badge variant="secondary">{totalProducts}</Badge>
                  </CardTitle>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-2 pt-0 space-y-3">
                    {/* Main category drop zone */}
                    <Droppable droppableId={`category:${category.name}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[60px] rounded-lg border-2 border-dashed p-2 transition-colors ${
                            snapshot.isDraggingOver 
                              ? "border-primary bg-primary/10" 
                              : "border-muted"
                          }`}
                        >
                          <p className="text-xs text-muted-foreground mb-2">
                            Root ({categoryProducts.length})
                          </p>
                          <ScrollArea className="h-32">
                            <div className="space-y-1">
                              {categoryProducts.map((product, index) => (
                                <Draggable key={product.id} draggableId={product.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`flex items-center gap-2 p-1.5 rounded text-xs bg-background border ${
                                        snapshot.isDragging ? "shadow-lg ring-2 ring-primary" : ""
                                      } ${updating === product.id ? "opacity-50" : ""}`}
                                    >
                                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                                      <span className="truncate flex-1">{product.name}</span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </Droppable>

                    {/* Subcategory drop zones */}
                    {categorySubcats.map((subcat) => {
                      const subcatProducts = getProductsForCategory(category.name, subcat.name);
                      
                      return (
                        <Droppable 
                          key={subcat.id} 
                          droppableId={`subcategory:${category.name}:${subcat.name}`}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[60px] rounded-lg border-2 border-dashed p-2 transition-colors ${
                                snapshot.isDraggingOver 
                                  ? "border-primary bg-primary/10" 
                                  : "border-muted"
                              }`}
                            >
                              <p className="text-xs text-muted-foreground mb-2">
                                {subcat.name} ({subcatProducts.length})
                              </p>
                              <ScrollArea className="h-24">
                                <div className="space-y-1">
                                  {subcatProducts.map((product, index) => (
                                    <Draggable key={product.id} draggableId={product.id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`flex items-center gap-2 p-1.5 rounded text-xs bg-background border ${
                                            snapshot.isDragging ? "shadow-lg ring-2 ring-primary" : ""
                                          } ${updating === product.id ? "opacity-50" : ""}`}
                                        >
                                          <GripVertical className="h-3 w-3 text-muted-foreground" />
                                          <span className="truncate flex-1">{product.name}</span>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              </ScrollArea>
                            </div>
                          )}
                        </Droppable>
                      );
                    })}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          💡 Tip: Search for a product above, then drag it to any category or subcategory
        </p>
      </div>
    </DragDropContext>
  );
};
