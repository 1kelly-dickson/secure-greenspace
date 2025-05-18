
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Phone } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Clear form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions or feedback? We're here to help you with any inquiries about our services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">support@securetext.example</p>
            <p className="text-gray-600">info@securetext.example</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" size="sm">
              Send Email
            </Button>
          </CardFooter>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">+1 (555) 123-4567</p>
            <p className="text-gray-600">Mon-Fri, 9AM-6PM EST</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" size="sm">
              Call Us
            </Button>
          </CardFooter>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="mt-4">Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Available 24/7</p>
            <p className="text-gray-600">Quick response time</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" size="sm">
              Start Chat
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="max-w-3xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Your Email
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input 
                id="subject" 
                placeholder="How can we help you?" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea 
                id="message" 
                placeholder="Please describe your issue or question..." 
                className="min-h-[150px]" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-3xl mx-auto mt-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-6 text-left">
          <div>
            <h4 className="font-semibold text-lg">Is my data secure?</h4>
            <p className="text-gray-600">Yes, all encryption happens directly in your browser. Your data never leaves your device unencrypted.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg">What encryption algorithms do you use?</h4>
            <p className="text-gray-600">We use industry-standard encryption algorithms like AES-256, AES-128, and various secure hashing algorithms.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Can I upgrade my plan later?</h4>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time from your account dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
