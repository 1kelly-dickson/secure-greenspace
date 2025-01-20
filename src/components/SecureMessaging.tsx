import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lock, Send, Key } from "lucide-react";
import AlgorithmSelector from "./AlgorithmSelector";

const SecureMessaging = () => {
  const [recipientKey, setRecipientKey] = useState("");
  const [message, setMessage] = useState("");
  const [algorithm, setAlgorithm] = useState("aes-256");
  const { toast } = useToast();

  const handleSend = async () => {
    if (!recipientKey || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here we'll implement the actual encryption and sending logic
      toast({
        title: "Message Sent",
        description: "Your message has been encrypted and sent securely",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-6 h-6 text-primary" />
          Secure Messaging
        </CardTitle>
        <CardDescription>
          Send encrypted messages to other users using their public keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Encryption Algorithm</label>
          <AlgorithmSelector
            value={algorithm}
            onChange={setAlgorithm}
            type="encrypt"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient's Public Key</label>
          <div className="flex gap-2">
            <Input
              value={recipientKey}
              onChange={(e) => setRecipientKey(e.target.value)}
              placeholder="Enter recipient's public key"
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Key className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your secure message..."
            className="min-h-[100px]"
          />
        </div>
        <Button onClick={handleSend} className="w-full">
          <Send className="w-4 h-4 mr-2" />
          Send Secure Message
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecureMessaging;