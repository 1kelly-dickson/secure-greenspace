import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Algorithm = {
  id: string;
  name: string;
  type: "hash" | "encrypt";
  description: string;
};

const algorithms: Algorithm[] = [
  {
    id: "aes-256",
    name: "AES-256",
    type: "encrypt",
    description: "Advanced Encryption Standard with 256-bit key",
  },
  {
    id: "aes-128",
    name: "AES-128",
    type: "encrypt",
    description: "Advanced Encryption Standard with 128-bit key",
  },
  {
    id: "sha256",
    name: "SHA-256",
    type: "hash",
    description: "Secure Hash Algorithm 2 with 256-bit digest",
  },
  {
    id: "sha512",
    name: "SHA-512",
    type: "hash",
    description: "Secure Hash Algorithm 2 with 512-bit digest",
  },
  {
    id: "md5",
    name: "MD5",
    type: "hash",
    description: "Message Digest Algorithm 5 (not recommended for security)",
  },
];

interface AlgorithmSelectorProps {
  value: string;
  onChange: (value: string) => void;
  type?: "hash" | "encrypt";
}

const AlgorithmSelector = ({ value, onChange, type }: AlgorithmSelectorProps) => {
  const filteredAlgorithms = type
    ? algorithms.filter((algo) => algo.type === type)
    : algorithms;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select algorithm" />
      </SelectTrigger>
      <SelectContent>
        {filteredAlgorithms.map((algo) => (
          <SelectItem key={algo.id} value={algo.id}>
            {algo.name} - {algo.description}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AlgorithmSelector;