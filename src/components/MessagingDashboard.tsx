
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FindUserModal from "@/components/FindUserModal";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Conversation from "@/components/Conversation";

interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  isPremium?: boolean;
}

interface MessagingDashboardProps {
  user: UserProfile;
}

const MessagingDashboard = ({ user }: MessagingDashboardProps) => {
  const [contacts, setContacts] = useState<UserProfile[]>([
    {
      id: "user-2",
      username: "Alice",
      avatarUrl: "https://avatar.vercel.sh/u/74240040"
    },
    {
      id: "user-3",
      username: "Bob",
      avatarUrl: "https://avatar.vercel.sh/u/54717377"
    },
    {
      id: "user-4",
      username: "Charlie",
      avatarUrl: "https://avatar.vercel.sh/u/68969568"
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const filteredContacts = searchQuery 
    ? contacts.filter(c => c.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : contacts;

  const handleSendRequest = (userId: string) => {
    // In a real app, this would send a request to the server
    toast({
      title: "Request Sent",
      description: "Your connection request has been sent",
    });
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    
    const found = contacts.find(c => 
      c.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (found) {
      setSelectedContact(found);
    } else {
      toast({
        title: "User not found",
        description: "No user found with that name",
        variant: "destructive",
      });
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    if (selectedContact?.id === id) {
      setSelectedContact(null);
    }
    toast({
      title: "Contact Removed",
      description: "Contact has been removed from your list",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Contacts List */}
      <Card className="md:col-span-1">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Contacts</h3>
            <FindUserModal onSendRequest={handleSendRequest} />
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 mt-4">
            {filteredContacts.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-sm text-muted-foreground">No contacts found</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-accent/50 ${
                    selectedContact?.id === contact.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatarUrl} alt={contact.username} />
                      <AvatarFallback>{contact.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{contact.username}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeContact(contact.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Conversation Area */}
      <div className="md:col-span-2">
        {selectedContact ? (
          <Conversation currentUser={user} contact={selectedContact} />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Select a contact</h3>
              <p className="text-muted-foreground">
                Choose a contact from the list or find new users
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MessagingDashboard;
