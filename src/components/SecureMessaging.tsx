import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lock, Send, Key, Copy } from "lucide-react";
import AlgorithmSelector from "./AlgorithmSelector";

const SecureMessaging = () => {
  const [recipientKey, setRecipientKey] = useState("");
  const [message, setMessage] = useState("");
  const [algorithm, setAlgorithm] = useState("aes-256");
  const [encryptedMessage, setEncryptedMessage] = useState("");
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
      // Convert the message to bytes
      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(message);
      const keyBytes = encoder.encode(recipientKey);

      // Generate a key from the recipient's public key
      const key = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );

      // Derive an encryption key
      const encryptionKey = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: encoder.encode("salt"),
          iterations: 100000,
          hash: "SHA-256",
        },
        key,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
      );

      // Generate an IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Encrypt the message
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        encryptionKey,
        messageBytes
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
      const encryptedBase64 = btoa(String.fromCharCode(...combined));
      
      setEncryptedMessage(encryptedBase64);
      
      toast({
        title: "Message Encrypted",
        description: "Your message has been encrypted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encrypt message",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(encryptedMessage);
    toast({
      title: "Copied!",
      description: "Encrypted message copied to clipboard",
    });
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
          Encrypt Message
        </Button>

        {encryptedMessage && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Encrypted Message</label>
            <div className="relative">
              <Textarea
                value={encryptedMessage}
                readOnly
                className="min-h-[100px] pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={copyToClipboard}
                className="absolute top-2 right-2 h-8 w-8"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecureMessaging;