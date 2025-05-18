import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Shield } from "lucide-react";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import { Link } from "react-router-dom";

const HashGenerator = () => {
  const [text, setText] = useState("");
  const [hash, setHash] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [isPremium] = useState(false); // This would be determined by authentication status
  const { toast } = useToast();

  // Function to convert ArrayBuffer to hex string
  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const generateHash = async () => {
    if (!text) {
      toast({
        title: "No text provided",
        description: "Please enter some text to hash",
        variant: "destructive",
      });
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      let hashBuffer: ArrayBuffer;
      
      // Only allow premium algorithms for premium users
      if (!isPremium && (algorithm === "sha3-256" || algorithm === "sha3-512")) {
        toast({
          title: "Premium feature",
          description: "SHA-3 algorithms are only available to premium users",
          variant: "destructive",
        });
        return;
      }
      
      // Generate hash based on selected algorithm
      // In a real implementation, SHA-3 would be implemented with a dedicated library
      // This is a simplified version for demonstration
      switch (algorithm) {
        case "sha256":
          hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          break;
        case "sha512":
          hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
          break;
        case "md5":
          // Note: MD5 is not directly available in Web Crypto API due to security concerns
          // This is just for demonstration - in reality, you'd need a separate library
          hashBuffer = await window.crypto.subtle.digest('SHA-256', data); // Placeholder
          toast({
            title: "MD5 Simulation",
            description: "For demo purposes, we're using SHA-256 instead of MD5, as MD5 is not secure",
          });
          break;
        case "sha3-256":
        case "sha3-512":
          // Simulate SHA-3 hashing
          const sha2Method = algorithm === "sha3-256" ? "SHA-256" : "SHA-512";
          hashBuffer = await window.crypto.subtle.digest(sha2Method, data);
          toast({
            title: "SHA-3 Simulation",
            description: `For demo purposes, we're using ${sha2Method} instead of ${algorithm}`,
          });
          break;
        default:
          hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      }
      
      const hashHex = bufferToHex(hashBuffer);
      setHash(hashHex);
    } catch (error) {
      toast({
        title: "Error generating hash",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Hash copied",
      description: "Hash value has been copied to clipboard",
    });
  };

  const clearAll = () => {
    setText("");
    setHash("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Hash Generator
            </CardTitle>
            <CardDescription>
              Generate secure hash values from your text using various algorithms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isPremium && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h4 className="flex items-center text-sm font-medium text-amber-800 mb-2">
                  <Shield className="mr-2 h-4 w-4" /> Free Plan Limitations
                </h4>
                <p className="text-sm text-amber-700">
                  Free users have access to basic hashing algorithms. Premium users get access to advanced algorithms like SHA-3.{" "}
                  <Link to="/pricing" className="font-medium underline">
                    Upgrade to Premium
                  </Link>{" "}
                  for full access.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hashing Algorithm</label>
                <AlgorithmSelector
                  value={algorithm}
                  onChange={setAlgorithm}
                  type="hash"
                />
                
                {algorithm === "md5" && (
                  <p className="text-amber-600 text-xs mt-1">
                    <strong>Warning:</strong> MD5 is not cryptographically secure. Use only for non-security purposes.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Text to Hash</label>
                <Textarea
                  placeholder="Enter text to generate hash..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={generateHash} className="flex-1">Generate Hash</Button>
                <Button variant="outline" onClick={clearAll}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              {hash && (
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-medium">Hash Result ({algorithm})</label>
                  <div className="relative">
                    <Input
                      value={hash}
                      readOnly
                      className="font-mono text-sm pr-10"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Hashing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Hashing is a one-way process that converts any input data into a fixed-size string of characters.
                Unlike encryption, hashing is not reversible - you cannot retrieve the original data from a hash.
              </p>
              
              <div>
                <h3 className="text-base font-medium mb-2">Common uses for hashing:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Verifying file integrity</li>
                  <li>Storing passwords securely</li>
                  <li>Creating digital signatures</li>
                  <li>Data indexing and retrieval</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Available algorithms:</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">SHA-256</span>
                    <p className="text-sm text-gray-600">
                      Part of the SHA-2 family, produces a 256-bit (32-byte) hash value. Widely used and considered secure.
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium">SHA-512</span>
                    <p className="text-sm text-gray-600">
                      Part of the SHA-2 family, produces a 512-bit (64-byte) hash value. Offers higher security than SHA-256.
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium">MD5 <span className="text-red-500 text-xs">(Not Secure)</span></span>
                    <p className="text-sm text-gray-600">
                      Produces a 128-bit hash value. Not considered cryptographically secure due to vulnerabilities.
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium">SHA3-256 <span className="text-primary text-xs">(Premium)</span></span>
                    <p className="text-sm text-gray-600">
                      Part of the newer SHA-3 family, produces a 256-bit hash value. More resistant to certain attacks.
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium">SHA3-512 <span className="text-primary text-xs">(Premium)</span></span>
                    <p className="text-sm text-gray-600">
                      Part of the SHA-3 family, produces a 512-bit hash value. Highest security option available.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;
