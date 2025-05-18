
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useState as useHookState } from '@hookstate/core';
import { authState } from "@/state/auth";

interface FindUserModalProps {
  onSendRequest: (userId: string) => void;
  buttonText?: string;
}

const FindUserModal = ({ onSendRequest, buttonText }: FindUserModalProps) => {
  const [userCode, setUserCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const auth = useHookState(authState);

  const handleSearch = async () => {
    if (!userCode) {
      toast({
        title: "Error",
        description: "Please enter a username or user code",
        variant: "destructive",
      });
      return;
    }
    
    if (!auth.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to find users",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // Try to find user by user_code
      const { data: userByCode, error: codeError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .or(`user_code.eq.${userCode},username.ilike.%${userCode}%`)
        .neq('id', auth.user.id) // Don't find the current user
        .limit(1);
      
      if (codeError) throw codeError;
      
      if (userByCode && userByCode.length > 0) {
        setFoundUser({
          id: userByCode[0].id,
          name: userByCode[0].username,
          avatar: userByCode[0].avatar_url
        });
      } else {
        setFoundUser(null);
        toast({
          title: "User not found",
          description: "No user with that username or code exists",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      toast({
        title: "Error searching",
        description: "Failed to search for user",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = () => {
    if (foundUser) {
      onSendRequest(foundUser.id);
      setOpen(false);
      setUserCode("");
      setFoundUser(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          {buttonText || "Find User"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find User</DialogTitle>
          <DialogDescription>
            Enter a username or user code to connect with someone
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter username or code (e.g. alice123)"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleSearch}
              disabled={isSearching}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {isSearching && (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          )}
          
          {foundUser && !isSearching && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={foundUser.avatar} alt={foundUser.name} />
                  <AvatarFallback>{foundUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{foundUser.name}</h3>
                  <p className="text-sm text-muted-foreground">User ID: {foundUser.id}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          {foundUser && (
            <Button onClick={handleSendRequest}>
              <UserPlus className="mr-2 h-4 w-4" />
              Send Request
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FindUserModal;
