import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FindUserModal from "@/components/FindUserModal";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, X, UserPlus, MessageSquare, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Conversation from "@/components/Conversation";
import { supabase } from "@/integrations/supabase/client";
import { useState as useHookState } from '@hookstate/core';
import { authState } from "@/state/auth";

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
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useHookState(authState);

  useEffect(() => {
    fetchContacts();
    
    // Set up realtime subscription for new contacts
    const channel = supabase
      .channel('public:contacts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'contacts',
        filter: `user_id=eq.${user.id}` 
      }, () => fetchContacts())
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'contacts',
        filter: `user_id=eq.${user.id}` 
      }, () => fetchContacts())
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'contacts',
        filter: `contact_id=eq.${user.id}` 
      }, () => fetchContacts())
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'contacts',
        filter: `contact_id=eq.${user.id}` 
      }, () => fetchContacts())
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const fetchContacts = async () => {
    if (!auth.user?.id) return;
    
    setIsLoading(true);
    try {
      // Get contacts where the current user is either the user_id or contact_id
      // and the status is 'accepted'
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select(`
          id,
          user_id,
          contact_id,
          status,
          user:user_id (id, username, avatar_url),
          contact:contact_id (id, username, avatar_url)
        `)
        .or(`user_id.eq.${auth.user.id},contact_id.eq.${auth.user.id}`)
        .eq('status', 'accepted');
        
      if (contactsError) throw contactsError;
      
      if (contactsData) {
        // Format the contacts data
        const formattedContacts = contactsData.map(c => {
          // If current user is the user_id, then return contact data
          // Otherwise return user data
          const contactProfile = c.user_id === auth.user?.id ? c.contact : c.user;
          
          return {
            id: contactProfile.id,
            username: contactProfile.username,
            avatarUrl: contactProfile.avatar_url
          };
        });
        
        setContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Failed to load contacts",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = searchQuery 
    ? contacts.filter(c => c.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : contacts;

  const handleSendRequest = async (userId: string) => {
    if (!auth.user?.id) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to send requests",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('contacts')
        .insert({
          user_id: auth.user.id,
          contact_id: userId
        });
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Request already sent",
            description: "You've already connected with this user",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Request Sent",
          description: "Your connection request has been sent",
        });
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast({
        title: "Failed to send request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
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

  const removeContact = async (id: string) => {
    if (!auth.user?.id) return;
    
    try {
      // Delete contact relationship where either user_id or contact_id matches
      const { error } = await supabase
        .from('contacts')
        .delete()
        .or(`and(user_id.eq.${auth.user.id},contact_id.eq.${id}),and(user_id.eq.${id},contact_id.eq.${auth.user.id})`);
      
      if (error) throw error;
      
      setContacts(contacts.filter(c => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
      
      toast({
        title: "Contact Removed",
        description: "Contact has been removed from your list",
      });
    } catch (error) {
      console.error('Error removing contact:', error);
      toast({
        title: "Failed to remove contact",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Contacts List */}
      <Card className="md:col-span-1">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Contacts</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={fetchContacts} 
                disabled={isLoading}
                title="Refresh contacts"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <FindUserModal onSendRequest={handleSendRequest} />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="ghost" size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 mt-4">
            {isLoading && contacts.length === 0 ? (
              <div className="flex justify-center p-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center p-4">
                <UserPlus className="mx-auto h-8 w-8 text-muted-foreground opacity-50 mb-2" />
                <p className="text-sm text-muted-foreground mb-4">No contacts found</p>
                <FindUserModal onSendRequest={handleSendRequest} buttonText="Find Users" />
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
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
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
