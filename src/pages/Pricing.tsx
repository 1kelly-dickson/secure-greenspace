
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/accordion";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      description: "For personal use with basic features",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Basic encryption tools",
        "File encryption up to 300MB",
        "Messages up to 950 words",
        "5 file uploads per day",
        "Basic hashing algorithms"
      ],
      limitations: [
        "No messaging with other users",
        "Limited uploads per day",
        "No premium algorithms"
      ],
      buttonText: "Get Started",
      buttonLink: "/signup",
      recommended: false
    },
    {
      name: "Premium",
      description: "For individuals who need advanced features",
      price: { monthly: 9.99, yearly: 99.99 },
      features: [
        "All encryption tools",
        "File encryption up to 1GB",
        "Unlimited message length",
        "Messaging with other users",
        "Unlimited uploads",
        "Premium hashing algorithms",
        "Priority support"
      ],
      limitations: [],
      buttonText: "Subscribe Now",
      buttonLink: "/signup?plan=premium",
      recommended: true
    },
    {
      name: "Business",
      description: "For teams and organizations",
      price: { monthly: 24.99, yearly: 249.99 },
      features: [
        "All Premium features",
        "File encryption up to 5GB",
        "Team collaboration",
        "API access",
        "Dedicated support",
        "Advanced analytics",
        "Custom deployment options"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      buttonLink: "/signup?plan=business",
      recommended: false
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the right plan for your security needs. All plans include our core encryption technology.
        </p>

        <div className="flex items-center justify-center mt-8 space-x-4">
          <span className={`text-sm ${billingCycle === "monthly" ? "font-medium" : "text-gray-500"}`}>Monthly</span>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              billingCycle === "yearly" ? "bg-primary" : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={billingCycle === "yearly"}
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === "yearly" ? "font-medium" : "text-gray-500"}`}>
            Yearly <span className="text-green-600 font-medium">(Save 15%)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.recommended ? "border-2 border-primary shadow-lg" : ""}`}>
            {plan.recommended && (
              <span className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl">
                RECOMMENDED
              </span>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${plan.price[billingCycle] === 0 ? "0" : plan.price[billingCycle].toFixed(2)}
                </span>
                {plan.price[billingCycle] > 0 && (
                  <span className="text-sm text-gray-500">/{billingCycle === "monthly" ? "month" : "year"}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-4">Features included:</p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start text-gray-400">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link to={plan.buttonLink} className="w-full">
                <Button 
                  className="w-full" 
                  variant={plan.recommended ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <h3 className="text-2xl font-bold mb-4">Need a custom solution?</h3>
        <p className="text-gray-600 mb-6">
          We offer tailored enterprise solutions for organizations with specific requirements.
        </p>
        <Link to="/contact">
          <Button size="lg">Contact our Sales Team</Button>
        </Link>
      </div>
    </div>
  );
};

export default Pricing;
