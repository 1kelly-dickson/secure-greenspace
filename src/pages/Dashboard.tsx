
import React, { useEffect, useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { authState, signOut } from "@/state/auth";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import FindUserModal from '@/components/FindUserModal';
import NotificationsPopover from '@/components/NotificationsPopover';
import ContactsList from '@/components/ContactsList';

const Dashboard = () => {
  const auth = useHookstate(authState);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isFindUserModalOpen, setIsFindUserModalOpen] = useState(false);
  const [contacts, setContacts] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.user.get()) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', auth.user.get()?.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            return;
          }

          if (data) {
            setUserProfile({
              id: data.id,
              email: auth.user.get()?.email || '', 
              fullName: data.username || '', // Use username as fullName since full_name doesn't exist yet
              username: data.username || '',
              avatarUrl: data.avatar_url,
            });
          }
        } catch (error) {
          console.error("Unexpected error fetching profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [auth.user]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (auth.user.get()) {
        try {
          const { data, error } = await supabase
            .from('contacts')
            .select(`
              contact_id,
              profiles:contact_id (
                id, 
                username, 
                avatar_url
              )
            `)
            .eq('user_id', auth.user.get()?.id);

          if (error) {
            console.error("Error fetching contacts:", error);
            return;
          }

          if (data) {
            const contactsData = data.map(contact => ({
              id: contact.profiles?.id || contact.contact_id,
              email: '', 
              fullName: contact.profiles?.username || '', 
              username: contact.profiles?.username || '',
              avatarUrl: contact.profiles?.avatar_url,
            }));
            setContacts(contactsData);
          }
        } catch (error) {
          console.error("Unexpected error fetching contacts:", error);
        }
      }
    };

    fetchContacts();
  }, [auth.user]);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/auth');
    } else {
      console.error("Sign out failed:", result.error);
    }
  };

  const handleAddContact = (newContact: UserProfile) => {
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {userProfile && (
        <div className="mb-4">
          <img
            src={userProfile.avatarUrl || `https://avatar.vercel.sh/${userProfile.username}`}
            alt={userProfile.fullName || userProfile.username}
            className="w-20 h-20 rounded-full mb-2"
          />
          <p><strong>Username:</strong> {userProfile.username}</p>
          {userProfile.fullName && <p><strong>Full Name:</strong> {userProfile.fullName}</p>}
          {userProfile.email && <p><strong>Email:</strong> {userProfile.email}</p>}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <Button onClick={() => setIsFindUserModalOpen(true)}>Add Contact</Button>
        <NotificationsPopover />
      </div>

      <ContactsList contacts={contacts} />

      <Button variant="destructive" onClick={handleSignOut} className="mt-4">Sign Out</Button>

      <FindUserModal
        open={isFindUserModalOpen}
        onOpenChange={setIsFindUserModalOpen}
        onContactSelected={handleAddContact}
      />
    </div>
  );
};

export default Dashboard;
