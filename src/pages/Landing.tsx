
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import { useHookstate } from '@hookstate/core';
import { authState } from "@/state/auth";

const Landing = () => {
  const auth = useHookstate(authState);

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to get started?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Join our secure messaging platform today and experience the peace of mind you deserve.
          </p>
          {auth.user.get() ? (
            <Link to="/dashboard">
              <Button size="lg">
                Go to Dashboard
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="lg">
                Sign Up Now
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
