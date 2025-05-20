import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState as useHookState } from '@hookstate/core';
import { authState } from "@/state/auth";

interface User {
  id: string;
  username: string;
  avatar_url: string;
}

interface FindUserModalProps {
  onUserSelect: (user: User) => void;
}

const FindUserModal = ({ onUserSelect }: FindUserModalProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useHookState(authState);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${searchTerm}%`)
        .limit(5);

      if (error) {
        throw error;
      }

      setSearchResults(data || []);
    } catch (error: any) {
      console.error("Error searching users:", error);
      toast({
        title: "Error searching users",
        description: error.message || "Failed to search users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    onUserSelect(user);
    setOpen(false); // Close the modal after selecting a user
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Find User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find a User</DialogTitle>
          <DialogDescription>
            Search for a user by username to start a conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              placeholder="Enter username"
              className="col-span-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <>
                <Search className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Search Results</h4>
              <ScrollArea className="h-40">
                {searchResults.map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar className="mr-2 h-6 w-6">
                      <AvatarImage src={user.avatar_url} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </Button>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindUserModal;
