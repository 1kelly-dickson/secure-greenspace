
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, MessageSquare, Fingerprint, Key, Server, Database, Clock, ExternalLink, ArrowRight, Check, ChevronRight } from "lucide-react";
import { useState as useHookState } from '@hookstate/core';
import { authState } from "@/state/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Landing = () => {
  const auth = useHookState(authState);
  const isLoggedIn = !!auth.user.get();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animation */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/20 to-background">
        <div className="absolute inset-0 z-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-4">Secure Communication</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-gray-900">
                End-to-End Encrypted Messaging for Everyone
              </h1>
              <p className="text-xl text-gray-600">
                Send encrypted messages, files, and stay secure online with military-grade encryption.
                Your data never leaves your device unencrypted.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {isLoggedIn ? (
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/dashboard">
                      Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="gap-2">
                      <Link to="/auth">
                        Get Started <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/encrypt">Try Demo</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-primary/10 p-3">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Secure Chat</p>
                        <p className="text-xs text-gray-500">End-to-end encrypted</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Online</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                        <p className="text-sm">Hey! Can you send me those documents securely?</p>
                        <p className="text-xs text-gray-500 mt-1">11:42 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-primary text-white rounded-lg rounded-tr-none p-3 max-w-[80%]">
                        <p className="text-sm">Sure! I'll encrypt them with AES-256 and send you the key separately.</p>
                        <p className="text-xs text-primary-foreground/80 mt-1">11:43 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                        <p className="text-sm">Perfect! I love how secure this app is.</p>
                        <p className="text-xs text-gray-500 mt-1">11:44 AM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-10"></div>
                    <Button size="icon" className="rounded-full">
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="absolute -z-10 top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -bottom-10 -left-10 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Highlights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Security Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides enterprise-grade security tools that are easy enough for everyone to use.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={MessageSquare} 
              title="Secure Messaging" 
              description="Send end-to-end encrypted messages that only the recipient can read."
            />
            <FeatureCard 
              icon={Lock} 
              title="File Encryption" 
              description="Encrypt files with AES-256 before sharing them through any channel."
            />
            <FeatureCard 
              icon={Fingerprint} 
              title="Hash Generator" 
              description="Generate and verify file integrity with multiple hash algorithms."
            />
            <FeatureCard 
              icon={Key} 
              title="Password Protection" 
              description="Add an extra layer of security with password-protected encryptions."
            />
            <FeatureCard 
              icon={Clock} 
              title="Self-Destructing Messages" 
              description="Set messages to auto-delete after being viewed or after a set time."
            />
            <FeatureCard 
              icon={Database} 
              title="Zero Knowledge" 
              description="We can't read your messages - everything is encrypted on your device."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sending secure messages has never been easier.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard 
              number="01" 
              title="Sign Up" 
              description="Create a free account in seconds and set up your secure profile."
            />
            <StepCard 
              number="02" 
              title="Connect" 
              description="Find friends using their unique code or username."
            />
            <StepCard 
              number="03" 
              title="Encrypt" 
              description="Write messages that are automatically encrypted end-to-end."
            />
            <StepCard 
              number="04" 
              title="Communicate" 
              description="Share messages, files, and media with complete privacy."
            />
          </div>
        </div>
      </section>
      
      {/* Security Comparison */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Encryption</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare our security features with other messaging platforms
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="comparison" className="space-y-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
                <TabsTrigger value="technical">Technical Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comparison" className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Feature</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Our App</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Others</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">End-to-End Encryption</td>
                        <td className="px-6 py-4 text-center"><Check className="inline-block h-5 w-5 text-green-500" /></td>
                        <td className="px-6 py-4 text-center text-gray-500">Sometimes</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">File Encryption</td>
                        <td className="px-6 py-4 text-center"><Check className="inline-block h-5 w-5 text-green-500" /></td>
                        <td className="px-6 py-4 text-center text-gray-500">Limited</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Self-Destructing Messages</td>
                        <td className="px-6 py-4 text-center"><Check className="inline-block h-5 w-5 text-green-500" /></td>
                        <td className="px-6 py-4 text-center text-gray-500">Rare</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Multiple Encryption Algorithms</td>
                        <td className="px-6 py-4 text-center"><Check className="inline-block h-5 w-5 text-green-500" /></td>
                        <td className="px-6 py-4 text-center text-gray-500">No</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Hash Verification</td>
                        <td className="px-6 py-4 text-center"><Check className="inline-block h-5 w-5 text-green-500" /></td>
                        <td className="px-6 py-4 text-center text-gray-500">No</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="technical">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Encryption Algorithms</h3>
                        <p className="text-gray-700">We support multiple industry-standard algorithms:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>AES-256 (Advanced Encryption Standard)</li>
                          <li>RSA-2048 for key exchange</li>
                          <li>ChaCha20-Poly1305 for streaming data</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Hash Functions</h3>
                        <p className="text-gray-700">Verify file and message integrity with:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>SHA-256</li>
                          <li>SHA-512</li>
                          <li>BLAKE2</li>
                          <li>MD5 (for legacy systems only)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Security Certifications</h3>
                        <p className="text-gray-700">Our encryption methods are compliant with:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>NIST FIPS 140-2</li>
                          <li>GDPR requirements</li>
                          <li>HIPAA for healthcare communications</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Security Tips */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Security Tips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your online privacy with these security best practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TipCard
              title="Use Strong, Unique Passwords"
              description="Create complex passwords with a mix of letters, numbers, and symbols. Never reuse passwords across different services."
            />
            <TipCard
              title="Enable Two-Factor Authentication"
              description="Add an extra layer of security to your accounts by requiring a second verification method beyond your password."
            />
            <TipCard
              title="Be Wary of Public WiFi"
              description="Avoid sending sensitive information over public networks unless you're using a VPN or encrypted connections."
            />
            <TipCard
              title="Keep Software Updated"
              description="Regularly update your applications and operating system to patch security vulnerabilities."
            />
            <TipCard
              title="Verify Recipient Identity"
              description="Before sending sensitive information, confirm you're communicating with the intended recipient."
            />
            <TipCard
              title="Use Different Encryption Keys"
              description="Don't use the same encryption key for all your communications. Rotate keys regularly for better security."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to secure your communications?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust our platform for their sensitive communications.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {isLoggedIn ? (
                <Button asChild size="lg" variant="secondary" className="gap-2">
                  <Link to="/dashboard">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" variant="secondary" className="gap-2">
                    <Link to="/auth">
                      Create Free Account <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                    <Link to="/pricing">
                      See Pricing
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative">
      <div className="text-4xl font-bold text-primary/10 absolute right-5 top-4">{number}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TipCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Landing;
