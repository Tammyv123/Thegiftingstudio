import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, X, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

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

type RowStatus = "pending" | "uploading" | "analyzing" | "saving" | "done" | "error";

interface Row {
  file: File;
  preview: string;
  status: RowStatus;
  name?: string;
  description?: string;
  code?: string;
  error?: string;
}

const MAX_FILES = 100;

export const BulkProductUpload = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [rows, setRows] = useState<Row[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name"),
      ]);
      setCategories(c.data || []);
      setSubcategories(s.data || []);
    })();
  }, []);

  const availableSubs = (() => {
    const c = categories.find((x) => x.slug === category);
    if (!c) return [];
    return subcategories.filter((s) => s.category_id === c.id);
  })();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, MAX_FILES - rows.length);
    const newRows: Row[] = arr.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));
    setRows((prev) => [...prev, ...newRows].slice(0, MAX_FILES));
  };

  const removeRow = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const processAll = async () => {
    if (!category) return toast.error("Select a category");
    if (!price) return toast.error("Enter a price");
    if (rows.length === 0) return toast.error("Add at least one image");

    setProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.status === "done") continue;

      try {
        // 1. Upload image
        updateRow(i, { status: "uploading" });
        const ext = row.file.name.split(".").pop();
        const fileName = `bulk-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(fileName, row.file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        // 2. Analyze with AI
        updateRow(i, { status: "analyzing" });
        const { data: analysis, error: fnErr } = await supabase.functions.invoke(
          "analyze-product-image",
          { body: { imageUrl: publicUrl } },
        );
        if (fnErr) throw fnErr;
        if ((analysis as any)?.error) throw new Error((analysis as any).error);

        const aiName: string = (analysis as any).name || "Product";
        const aiDesc: string = (analysis as any).description || "";
        const aiCode: string = ((analysis as any).code || "").trim();
        const finalName = aiCode ? `${aiName} (${aiCode})` : aiName;

        // 3. Insert product
        updateRow(i, { status: "saving", name: finalName, description: aiDesc, code: aiCode });
        const { error: insErr } = await supabase.from("products").insert({
          name: finalName,
          category,
          subcategory: subcategory || null,
          description: aiDesc,
          price: parseFloat(price),
          images: [publicUrl],
          image: publicUrl,
          stock: parseInt(stock) || 0,
          low_stock_threshold: 10,
          colors: [],
        });
        if (insErr) throw insErr;

        updateRow(i, { status: "done" });
        successCount++;
      } catch (e: any) {
        console.error("bulk row error", e);
        updateRow(i, { status: "error", error: e.message || "Failed" });
        errorCount++;
      }
    }

    setProcessing(false);
    toast.success(`Done: ${successCount} added, ${errorCount} failed`);
  };

  const clearDone = () => setRows((prev) => prev.filter((r) => r.status !== "done"));

  const statusBadge = (r: Row) => {
    switch (r.status) {
      case "pending":
        return <span className="text-xs text-muted-foreground">Pending</span>;
      case "uploading":
        return <span className="text-xs text-blue-500 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Uploading</span>;
      case "analyzing":
        return <span className="text-xs text-purple-500 flex items-center gap-1"><Sparkles className="h-3 w-3 animate-pulse" />Analyzing</span>;
      case "saving":
        return <span className="text-xs text-blue-500 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Saving</span>;
      case "done":
        return <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Done</span>;
      case "error":
        return <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{r.error}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory(""); }}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug} className="capitalize">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {availableSubs.length > 0 && (
          <div className="space-y-2">
            <Label>Subcategory</Label>
            <Select value={subcategory} onValueChange={setSubcategory}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                {availableSubs.map((s) => (
                  <SelectItem key={s.id} value={s.slug} className="capitalize">{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label>Price (₹) *</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Stock per product</Label>
          <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="10" />
        </div>
      </div>

      <div>
        <Label className="block mb-2">Upload up to {MAX_FILES} images ({rows.length}/{MAX_FILES})</Label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/50 transition">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Click to select images (multi-select)</span>
          <span className="text-xs text-muted-foreground mt-1">AI will auto-name & describe each product</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={processing || rows.length >= MAX_FILES}
          />
        </label>
      </div>

      {rows.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {rows.filter(r => r.status === "done").length} done · {rows.filter(r => r.status === "error").length} failed
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearDone} disabled={processing}>Clear done</Button>
              <Button onClick={processAll} disabled={processing} className="gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {processing ? "Processing..." : `Process ${rows.length} products`}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[600px] overflow-auto p-1">
            {rows.map((r, i) => (
              <div key={i} className="relative border rounded-lg overflow-hidden bg-card">
                <div className="aspect-square bg-muted">
                  <img src={r.preview} alt="" className="w-full h-full object-cover" />
                </div>
                {!processing && r.status !== "done" && (
                  <button
                    onClick={() => removeRow(i)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <div className="p-2 space-y-1">
                  {statusBadge(r)}
                  {r.name && <p className="text-xs font-medium truncate">{r.name}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};