import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Heart, ShoppingCart, User, LogOut, Search, Truck, Gift, UtensilsCrossed, Award, Sparkles, Flame, Package, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const categories = [
  { name: "Festive Gifts", path: "/festive" },
  { name: "Wedding Gifts", path: "/wedding" },
  { name: "Personalised Gifts", path: "/personalised" },
  { name: "Birthday Gifts", path: "/birthday" },
  { name: "Anniversary Gifts", path: "/anniversary" },
];

const categoryNav = [
  { name: "Same Day Delivery", path: "/products", icon: Truck },
  { name: "Festive Gifts", path: "/festive", icon: Sparkles },
  { name: "Premium Hampers", path: "/products", icon: Award },
  { name: "Gourmet Hampers", path: "/products", icon: UtensilsCrossed },
  { name: "Wedding Gifts", path: "/wedding", icon: Gift },
  { name: "Diyas & Candles", path: "/products", icon: Flame },
  { name: "Curated Collection", path: "/products", icon: Package },
  { name: "Corporate Gifts", path: "/products", icon: Briefcase },
];

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-background">
            <SheetHeader>
              <SheetTitle>All Products</SheetTitle>
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

        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
            <span className="text-xl font-bold text-primary-foreground">TGS</span>
          </div>
          <span className="hidden font-bold text-lg sm:inline-block bg-gradient-to-r from-rose-pink to-lavender bg-clip-text text-transparent">
            The Gifting Studio
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-lg hover:bg-secondary/50"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
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
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}
          <Link to="/contact">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Contact Us
            </Button>
          </Link>
        </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center overflow-x-auto py-3 gap-1">
            {categoryNav.map((category) => (
              <Link
                key={category.path + category.name}
                to={category.path}
                className="flex flex-col items-center justify-center min-w-[120px] px-4 py-2 rounded-lg transition-colors hover:bg-muted/50 group"
              >
                <category.icon className="h-8 w-8 mb-2 text-primary transition-transform group-hover:scale-110" strokeWidth={1.5} />
                <span className="text-xs font-medium text-foreground text-center whitespace-nowrap">
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
