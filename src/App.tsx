
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Messaging from "./pages/Messaging";
import FileEncryption from "./pages/FileEncryption";
import HashGenerator from "./pages/HashGenerator";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { initAuth, authState } from "./state/auth";
import { useState as useHookState } from '@hookstate/core';

const App = () => {
  // Initialize QueryClient inside the component
  const [queryClient] = useState(() => new QueryClient());
  const [authInitialized, setAuthInitialized] = useState(false);
  const auth = useHookState(authState);

  useEffect(() => {
    // Initialize authentication
    const cleanup = initAuth();
    setAuthInitialized(true);
    return cleanup;
  }, []);

  // Protected route component
  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    if (!authInitialized) {
      // Show loading state while auth initializes
      return <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>;
    }
    
    return auth.user.get() ? element : <Navigate to="/auth" replace />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/signup" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/messaging" element={<ProtectedRoute element={<Messaging />} />} />
                <Route path="/encrypt" element={<Index />} />
                <Route path="/decrypt" element={<Index />} />
                <Route path="/file-encrypt" element={<FileEncryption />} />
                <Route path="/hash" element={<HashGenerator />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
