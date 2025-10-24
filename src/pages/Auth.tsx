import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

const COUNTRIES = [
  { code: "+91", name: "India", flag: "🇮🇳", regex: /^[6-9]\d{9}$/ },
  { code: "+1", name: "USA/Canada", flag: "🇺🇸", regex: /^\d{10}$/ },
  { code: "+44", name: "UK", flag: "🇬🇧", regex: /^\d{10}$/ },
  { code: "+971", name: "UAE", flag: "🇦🇪", regex: /^\d{9}$/ },
  { code: "+61", name: "Australia", flag: "🇦🇺", regex: /^\d{9}$/ },
];

const Auth = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [contactType, setContactType] = useState<"email" | "phone">("email");

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePhoneForCountry = (phone: string, code: string) => {
    const country = COUNTRIES.find(c => c.code === code);
    return country ? country.regex.test(phone) : false;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalContact = contact;
    let isEmail = false;

    if (contactType === "email") {
      if (!isValidEmail(contact)) {
        toast.error("Please enter a valid email address");
        setLoading(false);
        return;
      }
      isEmail = true;
    } else {
      if (!validatePhoneForCountry(phoneNumber, countryCode)) {
        const country = COUNTRIES.find(c => c.code === countryCode);
        toast.error(`Please enter a valid phone number for ${country?.name}`);
        setLoading(false);
        return;
      }
      finalContact = `${countryCode}${phoneNumber}`;
    }

    const { error } = await supabase.auth.signInWithOtp(
      isEmail 
        ? { email: finalContact }
        : { phone: finalContact }
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`OTP sent to your ${isEmail ? "email" : "phone"}!`);
      setOtpSent(true);
      if (!isEmail) {
        setContact(finalContact);
      }
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
                <div className="space-y-2">
                  <Label>Contact Type</Label>
                  <Select 
                    value={contactType} 
                    onValueChange={(value: "email" | "phone") => setContactType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {contactType === "email" ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.flag} {country.name} ({country.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 py-2 border border-input bg-background rounded-md">
                          <span className="text-sm font-medium">{countryCode}</span>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={countryCode === "+91" ? "9876543210" : "Phone number"}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

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
                      setContact("");
                      setPhoneNumber("");
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
