
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { UserProfile } from '@/types';
import { findUsers } from '@/integrations/supabase/profiles';
import { supabase } from '@/integrations/supabase/client';
import { useHookstate } from '@hookstate/core';
import { authState } from '@/state/auth';
import { useToast } from '@/hooks/use-toast';

interface FindUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSelected: (contact: UserProfile) => void;
}

const FindUserModal: React.FC<FindUserModalProps> = ({
  open,
  onOpenChange,
  onContactSelected,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const auth = useHookstate(authState);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await findUsers(searchQuery);
      // Filter out the current user from results
      const filteredResults = results.filter(user => user.id !== auth.user.get()?.id);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "Failed to search for users. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddContact = async (contact: UserProfile) => {
    if (!auth.user.get()) return;
    
    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .insert({
          user_id: auth.user.get()?.id,
          contact_id: contact.id,
          status: 'accepted' // For simplicity, auto-accept for now
        });

      if (error) {
        console.error('Error adding contact:', error);
        toast({
          variant: "destructive",
          title: "Failed to add contact",
          description: "Could not add this user as a contact.",
        });
        return;
      }

      onContactSelected(contact);
      toast({
        title: "Contact added",
        description: `${contact.username} has been added to your contacts.`,
      });
      
      // Reset and close modal
      setSearchQuery('');
      setSearchResults([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Unexpected error adding contact:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatarUrl || `https://avatar.vercel.sh/${user.username}`}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{user.username}</p>
                      {user.fullName && (
                        <p className="text-sm text-muted-foreground">{user.fullName}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddContact(user)}
                    disabled={isAdding}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {searchQuery && searchResults.length === 0 && !isSearching && (
            <p className="text-center text-muted-foreground">No users found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindUserModal;
