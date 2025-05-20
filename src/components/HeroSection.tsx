
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-gray-50">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Secure Communications <span className="text-primary">Made Simple</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Our end-to-end encrypted messaging platform gives you peace of mind knowing your conversations remain private and secure.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/auth">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/encrypt">
            <Button variant="outline" size="lg">
              Try Encryption Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
