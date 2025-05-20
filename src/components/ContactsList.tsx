
import React from 'react';
import { UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ContactsListProps {
  contacts: UserProfile[];
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts }) => {
  if (contacts.length === 0) {
    return (
      <div className="py-4 text-center border rounded-lg mb-6">
        <p className="text-gray-500">No contacts yet. Add a contact to get started.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Contacts</h2>
      <ul className="divide-y border rounded-lg">
        {contacts.map((contact) => (
          <li key={contact.id} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
            <Avatar className="mr-3">
              <AvatarImage 
                src={contact.avatarUrl || `https://avatar.vercel.sh/${contact.username}`} 
                alt={contact.username} 
              />
              <AvatarFallback>{contact.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{contact.fullName || contact.username}</p>
              {contact.email && <p className="text-sm text-gray-500">{contact.email}</p>}
            </div>
            <button className="text-blue-500 hover:underline">Message</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsList;
