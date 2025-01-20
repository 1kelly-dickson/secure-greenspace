import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock, Copy, RefreshCw, Download, Share2, History, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EncryptionCard = () => {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [history, setHistory] = useState<Array<{ text: string; mode: string; date: Date }>>([]);
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

      // Add to history
      setHistory(prev => [{
        text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
        mode,
        date: new Date()
      }, ...prev.slice(0, 9)]);

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

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'encrypt' ? 'encrypted' : 'decrypted'}_text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Your file has been downloaded successfully",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
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
      <CardContent>
        <Tabs defaultValue="encrypt" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt" onClick={() => setMode("encrypt")}>Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt" onClick={() => setMode("decrypt")}>Decrypt</TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text to encrypt..."
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
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text to decrypt..."
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
          </TabsContent>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleOperation} className="flex-1">
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {result && (
            <div className="space-y-2 mt-4">
              <div className="relative">
                <Textarea
                  value={result}
                  readOnly
                  className="min-h-[100px] resize-none pr-10"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className="h-8 w-8"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={downloadResult}
                    className="h-8 w-8"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center justify-between">
                    <span>{item.text}</span>
                    <span className="text-xs text-gray-400">
                      {item.mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} •{' '}
                      {new Date(item.date).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EncryptionCard;