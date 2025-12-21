import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "@/components/ProductForm";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface AdminAddProductButtonProps {
  defaultCategory?: string;
  defaultSubcategory?: string;
}

export const AdminAddProductButton = ({ 
  defaultCategory = "Wedding", 
  defaultSubcategory 
}: AdminAddProductButtonProps) => {
  const { isAdmin, loading } = useIsAdmin();
  const [open, setOpen] = useState(false);

  if (loading || !isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New {defaultSubcategory} Product
          </DialogTitle>
        </DialogHeader>
        <ProductForm 
          defaultCategory={defaultCategory}
          defaultSubcategory={defaultSubcategory}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
