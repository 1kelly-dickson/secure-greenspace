
import { useState } from "react";
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

interface FindUserModalProps {
  onSendRequest: (userId: string) => void;
}

const FindUserModal = ({ onSendRequest }: FindUserModalProps) => {
  const [userCode, setUserCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!userCode) {
      toast({
        title: "Error",
        description: "Please enter a user code",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call to search for user
    setTimeout(() => {
      if (userCode.toLowerCase().includes("alice")) {
        setFoundUser({
          id: "user-2",
          name: "Alice",
          avatar: "https://avatar.vercel.sh/u/74240040"
        });
      } else if (userCode.toLowerCase().includes("bob")) {
        setFoundUser({
          id: "user-3",
          name: "Bob",
          avatar: "https://avatar.vercel.sh/u/54717377"
        });
      } else if (userCode.toLowerCase().includes("charlie")) {
        setFoundUser({
          id: "user-4",
          name: "Charlie",
          avatar: "https://avatar.vercel.sh/u/68969568"
        });
      } else {
        setFoundUser(null);
        toast({
          title: "User not found",
          description: "No user with that code exists",
          variant: "destructive",
        });
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleSendRequest = () => {
    if (foundUser) {
      onSendRequest(foundUser.id);
      toast({
        title: "Request sent",
        description: `Connection request sent to ${foundUser.name}`,
      });
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
          Find User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find User</DialogTitle>
          <DialogDescription>
            Enter a user code to connect with someone
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter user code (e.g. SEC-ALICE-1234)"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="flex-1"
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
