
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
import NotificationsPopover from "@/components/NotificationsPopover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Temporary state - replace with actual auth

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-[#673AB7]" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#512DA8] to-[#673AB7]">
              SecureText
            </span>
          </Link>
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
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
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
            <div className="flex items-center gap-4">
              <NotificationsPopover />
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://avatar.vercel.sh/u/42960598" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-2 bg-[#673AB7] hover:bg-[#512DA8]">
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
