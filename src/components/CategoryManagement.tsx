import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Edit, ImagePlus, Loader2, FolderOpen, ChevronRight, Package } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductForm } from "@/components/ProductForm";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image: string | null;
}

export const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSubcategory, setAddingSubcategory] = useState(false);
  
  // Category form state
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryPreview, setCategoryPreview] = useState<string>("");
  
  // Subcategory form state
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState<File | null>(null);
  const [subcategoryPreview, setSubcategoryPreview] = useState<string>("");
  
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  
  // Quick Add Product state
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState("");
  const [quickAddSubcategory, setQuickAddSubcategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name")
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (subcategoriesRes.error) throw subcategoriesRes.error;

      setCategories(categoriesRes.data || []);
      setSubcategories(subcategoriesRes.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `category-${Math.random()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingCategory(true);

    try {
      let imageUrl = null;
      if (categoryImage) {
        imageUrl = await uploadImage(categoryImage);
      }

      const slug = categoryName.toLowerCase().trim();
      
      const { error } = await supabase
        .from("categories")
        .insert({ name: categoryName.trim(), slug, image: imageUrl });

      if (error) throw error;

      toast.success("Category added successfully!");
      setCategoryName("");
      setCategoryImage(null);
      setCategoryPreview("");
      setCategoryDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error adding category:", error);
      toast.error(error.message || "Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingSubcategory(true);

    try {
      let imageUrl = null;
      if (subcategoryImage) {
        imageUrl = await uploadImage(subcategoryImage);
      }

      const slug = subcategoryName.toLowerCase().trim();
      
      const { error } = await supabase
        .from("subcategories")
        .insert({ 
          category_id: selectedCategoryId,
          name: subcategoryName.trim(), 
          slug, 
          image: imageUrl 
        });

      if (error) throw error;

      toast.success("Subcategory added successfully!");
      setSubcategoryName("");
      setSubcategoryImage(null);
      setSubcategoryPreview("");
      setSelectedCategoryId("");
      setSubcategoryDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error adding subcategory:", error);
      toast.error(error.message || "Failed to add subcategory");
    } finally {
      setAddingSubcategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("This will also delete all subcategories. Continue?")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      toast.success("Category deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      const { error } = await supabase.from("subcategories").delete().eq("id", id);
      if (error) throw error;
      toast.success("Subcategory deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete subcategory");
    }
  };

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {/* Add Category Dialog */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category Image (Optional)</Label>
                <div className="flex gap-4 items-center">
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                      {categoryPreview ? (
                        <img src={categoryPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCategoryImage(file);
                          setCategoryPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  {categoryPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCategoryImage(null);
                        setCategoryPreview("");
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={addingCategory} className="w-full">
                {addingCategory ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Subcategory Dialog */}
        <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subcategory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subcategory</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubcategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parentCategory">Parent Category</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategoryName">Subcategory Name</Label>
                <Input
                  id="subcategoryName"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  placeholder="Enter subcategory name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Subcategory Image (Optional)</Label>
                <div className="flex gap-4 items-center">
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                      {subcategoryPreview ? (
                        <img src={subcategoryPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSubcategoryImage(file);
                          setSubcategoryPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  {subcategoryPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSubcategoryImage(null);
                        setSubcategoryPreview("");
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={addingSubcategory || !selectedCategoryId} className="w-full">
                {addingSubcategory ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  "Add Subcategory"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <Accordion type="multiple" className="space-y-2">
        {categories.map((category) => {
          const categorySubcats = getSubcategoriesForCategory(category.id);
          
          return (
            <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {categorySubcats.length} subcategories
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickAddCategory(category.name);
                      setQuickAddSubcategory(undefined);
                      setProductDialogOpen(true);
                    }}
                  >
                    <Package className="h-3.5 w-3.5" />
                    Add Product
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {categorySubcats.length > 0 ? (
                    categorySubcats.map((subcat) => (
                      <div 
                        key={subcat.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          {subcat.image ? (
                            <img src={subcat.image} alt={subcat.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center">
                              <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <span>{subcat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                            onClick={() => {
                              setQuickAddCategory(category.name);
                              setQuickAddSubcategory(subcat.name);
                              setProductDialogOpen(true);
                            }}
                          >
                            <Package className="h-3.5 w-3.5" />
                            Add Product
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteSubcategory(subcat.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">No subcategories yet</p>
                  )}
                  
                  <div className="flex justify-end pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Category
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No categories yet. Add your first category!</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Add Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Add New Product {quickAddSubcategory ? `to ${quickAddSubcategory}` : `to ${quickAddCategory}`}
            </DialogTitle>
          </DialogHeader>
          <ProductForm 
            defaultCategory={quickAddCategory}
            defaultSubcategory={quickAddSubcategory}
            onSuccess={() => setProductDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
