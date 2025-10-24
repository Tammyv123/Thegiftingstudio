import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

const Auth = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [contactType, setContactType] = useState<"email" | "phone">("email");

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isValidPhone = (value: string) => {
    return /^\+?[1-9]\d{1,14}$/.test(value);
  };

  const handleContactChange = (value: string) => {
    setContact(value);
    if (isValidEmail(value)) {
      setContactType("email");
    } else if (isValidPhone(value)) {
      setContactType("phone");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEmail = isValidEmail(contact);
    const isPhone = isValidPhone(contact);

    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email or phone number");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp(
      isEmail 
        ? { email: contact }
        : { phone: contact }
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`OTP sent to your ${isEmail ? "email" : "phone"}!`);
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp(
      contactType === "email"
        ? { email: contact, token: otp, type: "email" }
        : { phone: contact, token: otp, type: "sms" }
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed in successfully!");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to The Gifting Studio</CardTitle>
            <CardDescription>
              {otpSent 
                ? "Enter the OTP sent to your contact" 
                : "Enter your email or phone number to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Email or Phone Number (+1234567890)"
                  value={contact}
                  onChange={(e) => handleContactChange(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                  >
                    Change Contact
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
