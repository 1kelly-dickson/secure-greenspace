import EncryptionCard from "@/components/EncryptionCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Secure Text Encryption</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encrypt and decrypt your sensitive text using strong AES-256 encryption.
            Your data never leaves your browser.
          </p>
        </div>
        <EncryptionCard />
      </div>
    </div>
  );
};

export default Index;