import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Conversation from "@/components/Conversation";
import FindUserModal from "@/components/FindUserModal";
import NotificationsPopover from "@/components/NotificationsPopover";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search, MessageSquare, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useHookstate } from '@hookstate/core';
import { authState } from "@/state/auth";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  isPremium?: boolean;
}

const MessagingDashboard = ({ user }: { user: UserProfile }) => {
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [selectedContact, setSelectedContact] = useState<UserProfile | null>(null);
  const [isFindUserModalOpen, setIsFindUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const auth = useHookstate(authState);
  
  useEffect(() => {
    fetchContacts();
  }, [user.id]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id); // Exclude current user
      
      if (error) throw error;
      
      const formattedContacts = data.map(contact => ({
        id: contact.id,
        username: contact.username,
        avatarUrl: contact.avatar_url,
        isPremium: contact.is_premium
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Failed to load contacts",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: UserProfile) => {
    setSelectedContact(contact);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      {/* Contacts List */}
      <div className="md:col-span-1">
        <Card className="h-full flex flex-col">
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="search">Contacts</Label>
              <Button variant="ghost" size="icon" onClick={() => setIsFindUserModalOpen(true)}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>
          <Separator />
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <Button
                  key={contact.id}
                  variant="ghost"
                  className={`w-full justify-start rounded-md hover:bg-secondary ${
                    selectedContact?.id === contact.id ? "bg-secondary" : ""
                  }`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={contact.avatarUrl} alt={contact.username} />
                    <AvatarFallback>{contact.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{contact.username}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Conversation Area */}
      <div className="md:col-span-3">
        {selectedContact ? (
          <Conversation currentUser={user} contact={selectedContact} />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-2" />
              <h3 className="font-medium text-lg">Select a contact to start messaging</h3>
              <p className="text-sm text-muted-foreground">
                Choose a contact from the list to view conversation.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Find User Modal */}
      <FindUserModal
        open={isFindUserModalOpen}
        onOpenChange={setIsFindUserModalOpen}
        onContactSelected={(newContact: UserProfile) => {
          setContacts(prevContacts => [...prevContacts, newContact]);
          setIsFindUserModalOpen(false);
        }}
      />
    </div>
  );
};

export default MessagingDashboard;
