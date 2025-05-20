
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Basic secure messaging',
    features: [
      'End-to-end encrypted messages',
      'Web access',
      'Basic file encryption',
      'Up to 5 secure contacts',
      '7-day message history'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline',
    buttonLink: '/auth'
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    description: 'Advanced security for individuals',
    features: [
      'Everything in Free',
      'Unlimited secure contacts',
      'Unlimited message history',
      'Advanced file encryption',
      'Password-protected messages',
      'Message self-destruct timer',
      'Priority support'
    ],
    buttonText: 'Go Premium',
    buttonVariant: 'default',
    buttonLink: '/auth',
    highlight: true
  },
  {
    name: 'Team',
    price: '$19.99',
    period: 'per user/month',
    description: 'Security for organizations',
    features: [
      'Everything in Premium',
      'Team management console',
      'Enterprise-grade encryption',
      'Compliance features',
      'Audit logs',
      'SSO integration',
      'Dedicated support'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
    buttonLink: '/contact'
  }
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-background" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include our core security features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-xl border ${
                plan.highlight 
                  ? 'shadow-lg border-primary/50 relative' 
                  : 'shadow-sm'
              } bg-card overflow-hidden`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                  Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <Link to={plan.buttonLink}>
                  <Button 
                    variant={plan.buttonVariant as "default" | "outline"} 
                    className="w-full"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
              
              <div className="border-t p-6">
                <p className="font-medium mb-4">What's included:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
