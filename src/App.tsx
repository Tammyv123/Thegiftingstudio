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

// Wedding subcategories
import WeddingTray from "./pages/wedding/WeddingTray";
import WeddingReturnFavour from "./pages/wedding/WeddingReturnFavour";
import WeddingJewellery from "./pages/wedding/WeddingJewellery";
import WeddingProps from "./pages/wedding/WeddingProps";
import WeddingHampers from "./pages/wedding/WeddingHampers";
import WeddingGift from "./pages/wedding/WeddingGift";

// Birthday subcategories
import GiftForHer from "./pages/birthday/GiftForHer";
import GiftForHim from "./pages/birthday/GiftForHim";
import GiftForSibling from "./pages/birthday/GiftForSibling";
import GiftForMother from "./pages/birthday/GiftForMother";
import GiftForFather from "./pages/birthday/GiftForFather";

// Accessories subcategories
import Earrings from "./pages/accessories/Earrings";
import Hair from "./pages/accessories/Hair";
import Necklace from "./pages/accessories/Necklace";
import Hand from "./pages/accessories/Hand";

// Festive subcategories
import Diwali from "./pages/festive/Diwali";
import Holi from "./pages/festive/Holi";
import Eid from "./pages/festive/Eid";
import Rakshabandhan from "./pages/festive/Rakshabandhan";
import Christmas from "./pages/festive/Christmas";
import NewYear from "./pages/festive/NewYear";

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
                
                {/* Wedding subcategory routes */}
                <Route path="/wedding/tray" element={<WeddingTray />} />
                <Route path="/wedding/return-favour" element={<WeddingReturnFavour />} />
                <Route path="/wedding/jewellery" element={<WeddingJewellery />} />
                <Route path="/wedding/props" element={<WeddingProps />} />
                <Route path="/wedding/hampers" element={<WeddingHampers />} />
                <Route path="/wedding/gift" element={<WeddingGift />} />
                
                {/* Birthday subcategory routes */}
                <Route path="/birthday/gift-for-her" element={<GiftForHer />} />
                <Route path="/birthday/gift-for-him" element={<GiftForHim />} />
                <Route path="/birthday/gift-for-sibling" element={<GiftForSibling />} />
                <Route path="/birthday/gift-for-mother" element={<GiftForMother />} />
                <Route path="/birthday/gift-for-father" element={<GiftForFather />} />
                
                {/* Accessories subcategory routes */}
                <Route path="/accessories/earrings" element={<Earrings />} />
                <Route path="/accessories/hair" element={<Hair />} />
                <Route path="/accessories/necklace" element={<Necklace />} />
                <Route path="/accessories/hand" element={<Hand />} />
                
                {/* Festive subcategory routes */}
                <Route path="/festive/diwali" element={<Diwali />} />
                <Route path="/festive/holi" element={<Holi />} />
                <Route path="/festive/eid" element={<Eid />} />
                <Route path="/festive/rakshabandhan" element={<Rakshabandhan />} />
                <Route path="/festive/christmas" element={<Christmas />} />
                <Route path="/festive/new-year" element={<NewYear />} />
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
