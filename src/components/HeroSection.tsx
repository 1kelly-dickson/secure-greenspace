
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Lock, MessageSquare } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary/10">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Secure Communication
            <span className="text-primary block">For Everyone</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            End-to-end encrypted messaging, file sharing, and more. Take control of your privacy with our advanced security features.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/encrypt">
              <Button variant="outline" size="lg">
                Try Encryption
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-8">
            <Shield className="h-4 w-4" />
            <span>Military-grade encryption</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl relative">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Encrypted Conversation</h3>
                <p className="text-xs text-muted-foreground">End-to-end encrypted</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-end">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex-shrink-0"></div>
                <div className="bg-muted p-3 rounded-2xl rounded-bl-none max-w-[80%]">
                  <p className="text-sm">Hi there! How's it going?</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-end flex-row-reverse">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0"></div>
                <div className="bg-primary/10 p-3 rounded-2xl rounded-br-none max-w-[80%]">
                  <p className="text-sm">Hey! I'm good. Just testing out this new secure messaging app.</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-end">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex-shrink-0"></div>
                <div className="bg-muted p-3 rounded-2xl rounded-bl-none max-w-[80%]">
                  <p className="text-sm">Nice! I love that all our messages are encrypted. Feels safe.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex gap-2">
              <div className="bg-muted rounded-full flex-1 h-10"></div>
              <div className="bg-primary rounded-full h-10 w-10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
