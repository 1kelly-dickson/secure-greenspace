
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { User, LogIn, UserPlus, Lock } from "lucide-react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Temporary state - replace with actual auth

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold">SecureText</Link>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <Link to="/encrypt" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Encrypt</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Secure your text with strong encryption</p>
                  </Link>
                  <Link to="/decrypt" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Decrypt</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Decrypt your previously encrypted text</p>
                  </Link>
                  <Link to="/hash" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Hash Generator</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Generate secure hashes from your text</p>
                  </Link>
                  <Link to="/file-encrypt" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">File Encryption</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Encrypt and decrypt your files securely</p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/messaging">
                <Button variant="ghost">Messaging</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact">
                <Button variant="ghost">Contact Us</Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
