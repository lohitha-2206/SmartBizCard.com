
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreditCard, Check, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpgradeClick = () => {
    if (!user) {
      toast.error("Please log in to upgrade to Pro plan");
      navigate("/login?redirect=pricing");
      return;
    }
    
    // For demo purposes, we're just showing a "mock" payment flow
    // In a real app, you would integrate Stripe or another payment provider
    toast("Redirecting to payment gateway...");
    
    // Simulate redirect to payment page
    setTimeout(() => {
      const mockPaymentUrl = "https://example.com/payment";
      // Open in a new tab for demo
      window.open(mockPaymentUrl, "_blank");
      
      toast.success("Payment demo: In a real app, this would redirect to a payment processor", {
        duration: 5000,
      });
    }, 1500);
  };

  const handleContactSales = () => {
    navigate("/contact");
    toast.success("Contact form will be displayed here", {
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-8 md:py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Pricing Plans</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-2">Free</h2>
              <p className="text-3xl font-bold mb-4">$0<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <div className="border-t my-4"></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Basic templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Create up to 2 business cards</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Basic customization</span>
                </li>
              </ul>
              <button className="w-full py-2 rounded-md bg-primary/10 text-primary font-medium">Current Plan</button>
            </div>
            
            {/* Pro Plan */}
            <div className="border border-primary rounded-lg p-6 shadow-md relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
              <h2 className="text-2xl font-bold mb-2">Pro</h2>
              <p className="text-3xl font-bold mb-4">$9<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <div className="border-t my-4"></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>All free features</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>All premium templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Create unlimited business cards</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Advanced customization options</span>
                </li>
              </ul>
              <Button 
                className="w-full py-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                onClick={handleUpgradeClick}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                <Shield className="inline-block h-3 w-3 mr-1" />
                Secure payment processing
              </p>
            </div>
            
            {/* Business Plan */}
            <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-2">Business</h2>
              <p className="text-3xl font-bold mb-4">$19<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <div className="border-t my-4"></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>All Pro features</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Team management</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button 
                variant="outline"
                className="w-full py-2"
                onClick={handleContactSales}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
