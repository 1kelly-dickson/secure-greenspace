import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock, Copy, RefreshCw } from "lucide-react";

const EncryptionCard = () => {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const { toast } = useToast();

  const handleOperation = async () => {
    if (!text || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const passwordData = encoder.encode(password);
      
      const key = await window.crypto.subtle.importKey(
        "raw",
        passwordData,
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );
      
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
        ["encrypt", "decrypt"]
      );

      if (mode === "encrypt") {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await window.crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          encryptionKey,
          data
        );
        const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
        setResult(btoa(String.fromCharCode(...combined)));
      } else {
        const decoded = Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
        const iv = decoded.slice(0, 12);
        const encryptedData = decoded.slice(12);
        const decrypted = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          encryptionKey,
          encryptedData
        );
        setResult(new TextDecoder().decode(decrypted));
      }

      toast({
        title: `${mode === "encrypt" ? "Encryption" : "Decryption"} successful`,
        description: "Your text has been processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: mode === "decrypt" ? "Invalid password or corrupted data" : "Encryption failed",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const clearAll = () => {
    setText("");
    setPassword("");
    setResult("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
          {mode === "encrypt" ? (
            <>
              <Lock className="w-6 h-6 text-primary" />
              Encrypt Text
            </>
          ) : (
            <>
              <Unlock className="w-6 h-6 text-primary" />
              Decrypt Text
            </>
          )}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === "encrypt"
            ? "Secure your text with strong encryption"
            : "Decrypt your previously encrypted text"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder={`Enter text to ${mode}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleOperation}
            className="flex-1 bg-primary hover:bg-primary-dark"
          >
            {mode === "encrypt" ? "Encrypt" : "Decrypt"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setMode(mode === "encrypt" ? "decrypt" : "encrypt")}
          >
            Switch to {mode === "encrypt" ? "Decrypt" : "Encrypt"}
          </Button>
        </div>
        {result && (
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                value={result}
                readOnly
                className="min-h-[100px] resize-none pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={clearAll} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EncryptionCard;