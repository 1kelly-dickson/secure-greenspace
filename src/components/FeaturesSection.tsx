
import React from 'react';
import { Shield, Lock, MessageSquare, Zap } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your messages are encrypted before they leave your device, ensuring complete privacy."
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "All data is stored with military-grade encryption and security protocols."
    },
    {
      icon: MessageSquare,
      title: "Private Messaging",
      description: "Send encrypted messages that only you and your recipient can read."
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Lightning-fast message delivery with 99.9% uptime reliability."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose SecureText?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the most secure and user-friendly encrypted messaging platform available today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
