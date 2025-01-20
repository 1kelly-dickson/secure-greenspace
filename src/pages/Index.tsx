import EncryptionCard from "@/components/EncryptionCard";
import SecureMessaging from "@/components/SecureMessaging";
import { Shield, Lock, History, Download, Share2, Info, FileText, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      {/* Hero Section */}
      <header className="py-12 px-4 sm:px-6 md:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Secure Text Encryption</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Encrypt and decrypt your sensitive text using strong AES-256 encryption.
            Your data never leaves your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="gap-2">
              <Lock className="w-4 h-4" />
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              Learn More
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Tabs defaultValue="encrypt" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
            <TabsTrigger value="message">Message</TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-8">
            <EncryptionCard />
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-8">
            <EncryptionCard />
          </TabsContent>

          <TabsContent value="message" className="space-y-8">
            <SecureMessaging />
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-2xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Military-Grade Encryption"
              description="AES-256 encryption ensures your data remains secure and private."
            />
            <FeatureCard
              icon={History}
              title="Encryption History"
              description="Keep track of your recent encryption activities securely."
            />
            <FeatureCard
              icon={Download}
              title="Export & Backup"
              description="Save your encrypted data locally for future reference."
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
            <StepCard
              number="1"
              title="Enter Text"
              description="Type or paste your sensitive text into the secure input field."
            />
            <StepCard
              number="2"
              title="Set Password"
              description="Choose a strong password to encrypt your data."
            />
            <StepCard
              number="3"
              title="Encrypt/Decrypt"
              description="Process your text with military-grade encryption."
            />
            <StepCard
              number="4"
              title="Share Securely"
              description="Share the encrypted text through any channel."
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={FileText}
              title="File Encryption"
              description="Coming soon: Encrypt files up to 10MB"
            />
            <QuickActionCard
              icon={Share2}
              title="Secure Sharing"
              description="Share encrypted content safely"
            />
            <QuickActionCard
              icon={Settings}
              title="Preferences"
              description="Customize your encryption settings"
            />
            <QuickActionCard
              icon={HelpCircle}
              title="Help & Support"
              description="Get assistance when needed"
            />
          </div>
        </section>

        {/* Security Info */}
        <section className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Your Security is Our Priority</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All encryption and decryption happens directly in your browser.
            We never store or transmit your sensitive data.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Home</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Email Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Secure Encryption. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Step Card Component
const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => {
  return (
    <div className="text-center">
      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
