import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock products - will be filtered based on search
  const allProducts = [
    { id: "1", name: "Diwali Gift Hamper", price: 1299, image: "https://images.unsplash.com/photo-1607081692251-5e8f8e5f2dc3?w=400", category: "Festive" },
    { id: "2", name: "Birthday Surprise Box", price: 999, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400", category: "Birthday" },
    { id: "3", name: "Romantic Gift Set", price: 1499, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400", category: "Anniversary" },
    { id: "4", name: "Custom Photo Frame", price: 699, image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400", category: "Personalised" },
    { id: "5", name: "Royal Wedding Gift Set", price: 2499, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400", category: "Wedding" },
  ];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold">Search Products</h1>
        
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Festive">Festive Gifts</SelectItem>
              <SelectItem value="Wedding">Wedding Gifts</SelectItem>
              <SelectItem value="Personalised">Personalised Gifts</SelectItem>
              <SelectItem value="Birthday">Birthday Gifts</SelectItem>
              <SelectItem value="Anniversary">Anniversary Gifts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="mb-6 text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
