import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, loading } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.products.price) * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="mb-4 text-muted-foreground">Your cart is empty</p>
                <Link to="/">
                  <Button>Continue Shopping</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.products.image}
                        alt={item.products.name}
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.products.name}</h3>
                        <p className="text-lg font-bold text-primary">₹{Number(item.products.price).toFixed(2)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
