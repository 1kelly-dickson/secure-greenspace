
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Algorithm = {
  id: string;
  name: string;
  type: "hash" | "encrypt";
  description: string;
  strength: "low" | "medium" | "high";
  premium?: boolean;
};

const algorithms: Algorithm[] = [
  // Encryption algorithms
  {
    id: "aes-256",
    name: "AES-256",
    type: "encrypt",
    description: "Advanced Encryption Standard with 256-bit key",
    strength: "high",
  },
  {
    id: "aes-128",
    name: "AES-128",
    type: "encrypt",
    description: "Advanced Encryption Standard with 128-bit key",
    strength: "medium",
  },
  {
    id: "aes-gcm",
    name: "AES-GCM",
    type: "encrypt",
    description: "AES with Galois/Counter Mode",
    strength: "high",
    premium: true,
  },
  {
    id: "chacha20",
    name: "ChaCha20",
    type: "encrypt",
    description: "Stream cipher with 256-bit key",
    strength: "high",
    premium: true,
  },
  {
    id: "triple-des",
    name: "Triple DES",
    type: "encrypt",
    description: "Triple Data Encryption Standard",
    strength: "medium",
  },
  
  // Hash algorithms
  {
    id: "sha256",
    name: "SHA-256",
    type: "hash",
    description: "Secure Hash Algorithm 2 with 256-bit digest",
    strength: "high",
  },
  {
    id: "sha512",
    name: "SHA-512",
    type: "hash",
    description: "Secure Hash Algorithm 2 with 512-bit digest",
    strength: "high",
  },
  {
    id: "sha3-256",
    name: "SHA3-256",
    type: "hash",
    description: "SHA-3 (Keccak) with 256-bit digest",
    strength: "high",
    premium: true,
  },
  {
    id: "sha3-512",
    name: "SHA3-512",
    type: "hash",
    description: "SHA-3 (Keccak) with 512-bit digest",
    strength: "high",
    premium: true,
  },
  {
    id: "md5",
    name: "MD5",
    type: "hash",
    description: "Message Digest Algorithm 5 (not recommended for security)",
    strength: "low",
  },
  {
    id: "blake2b",
    name: "BLAKE2b",
    type: "hash",
    description: "High-speed cryptographic hash",
    strength: "high",
    premium: true,
  },
  {
    id: "ripemd160",
    name: "RIPEMD-160",
    type: "hash",
    description: "RACE Integrity Primitives Evaluation hash",
    strength: "medium",
  },
];

interface AlgorithmSelectorProps {
  value: string;
  onChange: (value: string) => void;
  type?: "hash" | "encrypt";
  premiumEnabled?: boolean;
}

const AlgorithmSelector = ({ 
  value, 
  onChange, 
  type,
  premiumEnabled = false 
}: AlgorithmSelectorProps) => {
  const filteredAlgorithms = algorithms
    .filter(algo => !type || algo.type === type)
    .filter(algo => premiumEnabled || !algo.premium);

  const selectedAlgo = algorithms.find(algo => algo.id === value);

  const getStrengthColor = (strength: "low" | "medium" | "high") => {
    switch (strength) {
      case "low":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "high":
        return "text-green-600";
      default:
        return "";
    }
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select algorithm" />
      </SelectTrigger>
      <SelectContent>
        {filteredAlgorithms.map((algo) => (
          <SelectItem key={algo.id} value={algo.id} disabled={!premiumEnabled && algo.premium}>
            <div className="flex flex-col">
              <span className="flex items-center gap-2">
                {algo.name}
                {algo.premium && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Premium</span>}
              </span>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{algo.description}</span>
                <span className={`text-xs font-medium ml-2 ${getStrengthColor(algo.strength)}`}>
                  {algo.strength.charAt(0).toUpperCase() + algo.strength.slice(1)}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AlgorithmSelector;
