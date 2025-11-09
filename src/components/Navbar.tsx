import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu, Heart, ShoppingCart, User, LogOut, Search, 
  Gift, Sparkles, Award, Flame, Package, Briefcase, 
  Home, Cake, PartyPopper, Flower2, BookHeart, UtensilsCrossed, 
  LampDesk, Watch, ShoppingBag, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { name: "Festive Gifts", path: "/festive" },
  { name: "Wedding Gifts", path: "/wedding" },
  { name: "Personalised Gifts", path: "/personalised" },
  { name: "Birthday Gifts", path: "/birthday" },
  { name: "Anniversary Gifts", path: "/anniversary" },
  { name: "Home Essentials", path: "/home-essentials" },
  { name: "Accessories", path: "/accessories" },
];

const categoryNav = [
  { name: "All Products", path: "/products", icon: Home, gradient: "from-rose-pink to-sunshine-yellow" },
  { name: "Festive Gifts", path: "/festive", icon: Sparkles, gradient: "from-sunshine-yellow to-lavender" },
  { name: "Wedding Gifts", path: "/wedding", icon: Gift, gradient: "from-lavender to-mint-green" },
  { name: "Birthday Gifts", path: "/birthday", icon: Cake, gradient: "from-mint-green to-rose-pink" },
  { name: "Anniversary", path: "/anniversary", icon: BookHeart, gradient: "from-rose-pink to-lavender" },
  { name: "Personalised", path: "/personalised", icon: Package, gradient: "from-lavender to-sunshine-yellow" },
  { name: "Premium Hampers", path: "/premium-hampers", icon: Award, gradient: "from-sunshine-yellow to-mint-green" },
  { name: "Home Essentials", path: "/home-essentials", icon: LampDesk, gradient: "from-lavender to-rose-pink" },
  { name: "Accessories", path: "/accessories", icon: Watch, gradient: "from-rose-pink to-mint-green" },
  { name: "Party Supplies", path: "/products", icon: PartyPopper, gradient: "from-rose-pink to-sunshine-yellow" },
  { name: "Flowers", path: "/products", icon: Flower2, gradient: "from-sunshine-yellow to-rose-pink" },
  { name: "Diyas & Candles", path: "/products", icon: Flame, gradient: "from-lavender to-mint-green" },
  { name: "Corporate Gifts", path: "/corporate", icon: Briefcase, gradient: "from-mint-green to-sunshine-yellow" },
];

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      setIsAdmin(!!data);
    };

    checkAdminStatus();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          
          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
              <SheetHeader>
                <SheetTitle>All Categories</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
              <span className="text-xl font-bold text-primary-foreground">TGS</span>
            </div>
            <span className="hidden font-bold text-lg sm:inline-block bg-gradient-to-r from-rose-pink to-lavender bg-clip-text text-transparent">
              The Gifting Studio
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for gifts, occasions, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 bg-muted/50 border-border/50 focus:bg-background"
              />
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="accent" size="sm">Sign In</Button>
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="accent" size="sm" className="gap-2 hidden sm:inline-flex">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            )}
            <Link to="/contact">
              <Button variant="accent" size="sm" className="hidden sm:inline-flex">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {categoryNav.map((category) => (
              <Link
                key={category.path + category.name}
                to={category.path}
                className="flex flex-col items-center gap-2 flex-shrink-0 snap-start group"
              >
                <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${category.gradient} p-1 transition-transform hover:scale-105`}>
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <category.icon className="h-9 w-9 text-primary transition-transform group-hover:scale-110" strokeWidth={1.5} />
                  </div>
                </div>
                <span className="text-xs font-medium text-foreground text-center max-w-[80px] line-clamp-2">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
