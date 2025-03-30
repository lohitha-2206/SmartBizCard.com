
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "5 free templates",
      "Digital business card sharing",
      "Custom URL",
      "Basic QR code generation",
      "PDF downloads",
    ],
    button: {
      label: "Get Started",
      variant: "outline" as const,
    },
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "per month",
    description: "For professionals who need more",
    features: [
      "All free features",
      "Unlimited premium templates",
      "AI design assistant",
      "Custom branding",
      "Advanced analytics",
      "High-resolution exports",
      "Priority support",
    ],
    button: {
      label: "Get Premium",
      variant: "default" as const,
    },
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and businesses",
    features: [
      "All premium features",
      "Team management",
      "Brand consistency controls",
      "Custom templates",
      "Bulk creation",
      "Advanced security",
      "API access",
      "Dedicated support",
    ],
    button: {
      label: "Contact Sales",
      variant: "outline" as const,
    },
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-12 md:py-24">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[800px] mx-auto">
            Choose the plan that's right for you. Upgrade or downgrade anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col p-6 bg-card rounded-lg border ${
                plan.highlighted
                  ? "border-primary shadow-lg scale-105 z-10"
                  : "border-border shadow-sm"
              }`}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-auto">
                <Button 
                  variant={plan.button.variant} 
                  className="w-full"
                >
                  {plan.button.label}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>All plans include a 14-day money back guarantee.</p>
          <p className="mt-1">
            Invite friends to unlock free premium templates with our referral program.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
