
import React from 'react';
import { Shield, Lock, MessageCircle, FileText, Bell, Key } from 'lucide-react';

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'End-to-End Encryption',
    description: 'All messages are encrypted on your device and can only be decrypted by the intended recipient.',
  },
  {
    icon: <MessageCircle className="h-8 w-8" />,
    title: 'Secure Messaging',
    description: 'Send and receive messages knowing that only you and the recipient can read them.',
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'File Encryption',
    description: 'Encrypt sensitive files before sharing them, ensuring only authorized users can access the content.',
  },
  {
    icon: <Key className="h-8 w-8" />,
    title: 'Hash Generator',
    description: 'Create secure hashes for files and messages to verify data integrity.',
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: 'Password Protection',
    description: 'Add an extra layer of security with password protection for your encrypted content.',
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: 'Notification Controls',
    description: 'Control what information appears in notifications to protect your privacy.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Advanced Security Features</h2>
          <p className="text-lg text-muted-foreground">
            Our platform offers a comprehensive suite of security features to keep your communications and data safe at all times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
