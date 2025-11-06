import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Chatbot } from "./components/Chatbot";
import Index from "./pages/Index";
import FestiveGifts from "./pages/FestiveGifts";
import WeddingGifts from "./pages/WeddingGifts";
import PersonalisedGifts from "./pages/PersonalisedGifts";
import BirthdayGifts from "./pages/BirthdayGifts";
import AnniversaryGifts from "./pages/AnniversaryGifts";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ShopifyProductDetail from "./pages/ShopifyProductDetail";
import PremiumHampers from "./pages/PremiumHampers";
import GourmetHampers from "./pages/GourmetHampers";
import CorporateGifts from "./pages/CorporateGifts";
import HomeEssentials from "./pages/HomeEssentials";
import Accessories from "./pages/Accessories";
import PartySupplies from "./pages/PartySupplies";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/product/:handle" element={<ShopifyProductDetail />} />
                <Route path="/festive" element={<FestiveGifts />} />
                <Route path="/wedding" element={<WeddingGifts />} />
                <Route path="/personalised" element={<PersonalisedGifts />} />
                <Route path="/birthday" element={<BirthdayGifts />} />
                <Route path="/anniversary" element={<AnniversaryGifts />} />
                <Route path="/premium-hampers" element={<PremiumHampers />} />
                <Route path="/gourmet" element={<GourmetHampers />} />
                <Route path="/corporate" element={<CorporateGifts />} />
                <Route path="/home-essentials" element={<HomeEssentials />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/party-supplies" element={<PartySupplies />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/search" element={<Search />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Chatbot />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
