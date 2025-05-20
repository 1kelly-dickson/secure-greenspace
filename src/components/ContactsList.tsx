
import React from 'react';
import { UserProfile } from '@/types';

interface ContactsListProps {
  contacts: UserProfile[];
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts }) => {
  return (
    <div className="bg-card rounded-md p-4 border shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Contacts</h2>
      {contacts.length > 0 ? (
        <ul className="space-y-2">
          {contacts.map(contact => (
            <li key={contact.id} className="border-b pb-2">
              <div className="flex items-center gap-2">
                <img 
                  src={contact.avatarUrl || `https://avatar.vercel.sh/${contact.username}`}
                  alt={contact.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{contact.username}</p>
                  {contact.fullName && <p className="text-sm text-muted-foreground">{contact.fullName}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No contacts yet.</p>
      )}
    </div>
  );
};

export default ContactsList;
