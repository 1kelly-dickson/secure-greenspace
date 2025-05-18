import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock, Upload, Download, FileText, X, Shield } from "lucide-react";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import { Link } from "react-router-dom";

const FileEncryption = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [algorithm, setAlgorithm] = useState("aes-256");
  const [isPremium] = useState(false); // This would be determined by authentication status
  const [result, setResult] = useState<{ data: Blob, filename: string } | null>(null);
  const { toast } = useToast();

  const MAX_FREE_FILE_SIZE = 300 * 1024 * 1024; // 300MB in bytes
  const MAX_PREMIUM_FILE_SIZE = 1024 * 1024 * 1024; // 1GB in bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const maxSize = isPremium ? MAX_PREMIUM_FILE_SIZE : MAX_FREE_FILE_SIZE;
      
      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: `Free users can encrypt files up to ${MAX_FREE_FILE_SIZE / (1024 * 1024)}MB. Please upgrade for larger files.`,
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
    }
  };

  const processFile = async () => {
    if (!file || !password) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a password",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate file encryption/decryption
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would use the Web Crypto API to encrypt/decrypt the file
      // For now, we'll just pretend we've processed the file
      
      const filename = isEncrypting
        ? `${file.name}.encrypted`
        : file.name.replace('.encrypted', '');
        
      setResult({
        data: file, // In a real implementation, this would be the encrypted/decrypted data
        filename
      });
      
      toast({
        title: isEncrypting ? "File encrypted" : "File decrypted",
        description: "Your file has been processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEncrypting ? "encrypt" : "decrypt"} file: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const url = URL.createObjectURL(result.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {isEncrypting ? (
                <>
                  <Lock className="h-6 w-6 text-primary" />
                  File Encryption
                </>
              ) : (
                <>
                  <Unlock className="h-6 w-6 text-primary" />
                  File Decryption
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isEncrypting
                ? "Encrypt your files before sharing them with others"
                : "Decrypt your previously encrypted files"}
            </CardDescription>
            <div className="flex gap-2 mt-4">
              <Button
                variant={isEncrypting ? "default" : "outline"}
                onClick={() => {
                  setIsEncrypting(true);
                  setFile(null);
                  setResult(null);
                }}
              >
                Encrypt
              </Button>
              <Button
                variant={!isEncrypting ? "default" : "outline"}
                onClick={() => {
                  setIsEncrypting(false);
                  setFile(null);
                  setResult(null);
                }}
              >
                Decrypt
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isPremium && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h4 className="flex items-center text-sm font-medium text-amber-800 mb-2">
                  <Shield className="mr-2 h-4 w-4" /> Free Plan Limitations
                </h4>
                <p className="text-sm text-amber-700">
                  Free users can encrypt files up to 300MB. Need to encrypt larger files?{" "}
                  <Link to="/pricing" className="font-medium underline">
                    Upgrade to Premium
                  </Link>{" "}
                  to encrypt files up to 1GB.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Encryption Algorithm</label>
                <AlgorithmSelector
                  value={algorithm}
                  onChange={setAlgorithm}
                  type="encrypt"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter a strong password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">File</label>
                {file ? (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-md p-8 text-center">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium mb-2">Drag and drop your file here</p>
                    <p className="text-xs text-gray-500 mb-4">
                      {isEncrypting 
                        ? `Upload any file up to ${isPremium ? "1GB" : "300MB"}`
                        : "Upload the encrypted file you want to decrypt"}
                    </p>
                    <Input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="pointer-events-none">
                        Browse Files
                      </Button>
                    </label>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={processFile} 
                disabled={!file || !password || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    <span>{isEncrypting ? "Encrypting..." : "Decrypting..."}</span>
                  </div>
                ) : (
                  <span>{isEncrypting ? "Encrypt File" : "Decrypt File"}</span>
                )}
              </Button>
              
              {result && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      {isEncrypting ? (
                        <Lock className="h-6 w-6 text-primary" />
                      ) : (
                        <Unlock className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">File {isEncrypting ? "Encrypted" : "Decrypted"} Successfully</h3>
                      <p className="text-sm text-gray-500">
                        {result.filename}
                      </p>
                    </div>
                    <Button onClick={downloadResult} className="gap-2">
                      <Download className="h-4 w-4" />
                      Download {isEncrypting ? "Encrypted" : "Decrypted"} File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">About File Encryption</h2>
            <p className="text-gray-600 mb-4">
              File encryption converts your file into an encrypted format that can only be accessed using the correct password.
              This ensures that even if your file is intercepted, it cannot be read without the password.
            </p>
            <h3 className="text-md font-medium mb-2">Tips for secure file encryption:</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Use a strong, unique password for each encrypted file</li>
              <li>Store passwords securely using a password manager</li>
              <li>Choose the appropriate encryption algorithm for your security needs</li>
              <li>Remember that if you lose your password, you won't be able to recover the encrypted file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileEncryption;
