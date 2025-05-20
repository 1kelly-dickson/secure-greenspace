
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { findUsers } from "@/integrations/supabase/profiles";

interface FindUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSelected: (newContact: UserProfile) => void;
}

const FindUserModal: React.FC<FindUserModalProps> = ({ open, onOpenChange, onContactSelected }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['findUsers', searchQuery],
    queryFn: () => findUsers(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleSelectUser = (user: UserProfile) => {
    onContactSelected(user);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find a User</DialogTitle>
          <DialogDescription>
            Search for a user to add as a contact.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search" className="text-right">
              Search
            </Label>
            <Input
              type="search"
              id="search"
              placeholder="Enter username or email"
              className="col-span-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isLoading && <p>Loading users...</p>}
          {isError && <p>Error fetching users.</p>}
          {users && users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.id} className="py-2 border-b">
                  <button
                    className="w-full text-left hover:bg-secondary focus:outline-none focus:bg-secondary p-2 rounded"
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.username} {user.email && `(${user.email})`}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            searchQuery.length > 0 && !isLoading && !isError && <p>No users found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindUserModal;
