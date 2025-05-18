
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lock, Send, Copy, Plus, User, Search } from "lucide-react";
import AlgorithmSelector from "@/components/AlgorithmSelector";

interface Message {
  id: string;
  sender: string;
  content: string;
  encrypted: boolean;
  timestamp: Date;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  userCode: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  online: boolean;
}

const Messaging = () => {
  const [message, setMessage] = useState("");
  const [algorithm, setAlgorithm] = useState("aes-256");
  const [userCode, setUserCode] = useState(""); // For adding contacts
  const [searchQuery, setSearchQuery] = useState("");
  const [isPremium, setIsPremium] = useState(false); // Check if user has premium subscription
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [myUserCode] = useState("ABCD1234EFGH5678"); // Demo user's unique code
  const { toast } = useToast();

  // Initialize demo data
  useEffect(() => {
    // Demo contacts
    const demoContacts: Contact[] = [
      {
        id: "1",
        name: "John Doe",
        userCode: "JOHN5678ABCD1234",
        lastMessage: "How's it going?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        unreadCount: 2,
        online: true,
      },
      {
        id: "2",
        name: "Jane Smith",
        userCode: "JANE9012EFGH3456",
        lastMessage: "Did you try the new encryption?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 0,
        online: false,
      },
    ];

    // Demo messages for first contact
    const demoMessages: Message[] = [
      {
        id: "msg1",
        sender: "JOHN5678ABCD1234",
        content: "Hey there!",
        encrypted: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: true,
      },
      {
        id: "msg2",
        sender: myUserCode,
        content: "Hi John! How's it going?",
        encrypted: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 29), // 29 minutes ago
        read: true,
      },
      {
        id: "msg3",
        sender: "JOHN5678ABCD1234",
        content: "Pretty good! I wanted to share some encrypted info with you.",
        encrypted: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        read: true,
      },
      {
        id: "msg4",
        sender: "JOHN5678ABCD1234",
        content: "U2FsdGVkX1+B9TrkDgj4QjaTNTQQ8iMgMV6MYhVrrOI=",
        encrypted: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        read: false,
      },
      {
        id: "msg5",
        sender: "JOHN5678ABCD1234",
        content: "You'll need our shared key to decrypt that.",
        encrypted: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 14), // 14 minutes ago
        read: false,
      },
    ];

    setContacts(demoContacts);
    
    // Only set messages if a contact is selected
    if (selectedContact) {
      setMessages(demoMessages);
    }
  }, [selectedContact, myUserCode]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    if (!isPremium) {
      // Check word count for free users
      const wordCount = message.trim().split(/\s+/).length;
      if (wordCount > 950) {
        toast({
          title: "Word limit exceeded",
          description: "Free users can only send messages up to 950 words. Please upgrade to Premium.",
          variant: "destructive",
        });
        return;
      }
    }

    if (!selectedContact) {
      toast({
        title: "No recipient selected",
        description: "Please select a contact to send a message",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending a message
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      sender: myUserCode,
      content: message,
      encrypted: false,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    toast({
      title: "Message sent",
      description: `Message sent to ${selectedContact.name}`,
    });
  };

  const handleAddContact = () => {
    if (!userCode.trim() || userCode.length !== 16) {
      toast({
        title: "Invalid user code",
        description: "User codes must be exactly 16 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Messaging with other users requires a Premium subscription",
        variant: "destructive",
      });
      return;
    }

    // Simulate adding a contact
    const newContact: Contact = {
      id: `contact${Date.now()}`,
      name: `User-${userCode.substring(0, 4)}`,
      userCode: userCode,
      unreadCount: 0,
      online: Math.random() > 0.5, // Randomly set online status
    };

    setContacts([...contacts, newContact]);
    setUserCode("");
    setIsAddingContact(false);

    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your contacts`,
    });
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.userCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return date.toLocaleDateString();
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)] max-h-[800px]">
        {/* Contacts Sidebar */}
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Contacts</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => setIsAddingContact(!isAddingContact)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search contacts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            {isAddingContact && (
              <div className="flex flex-col space-y-2 mt-2">
                <Input
                  placeholder="Enter 16-character user code"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  maxLength={16}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddContact} className="flex-1">Add Contact</Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsAddingContact(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto pt-2">
            {!isPremium && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                <h4 className="text-sm font-medium text-amber-800">Premium Feature</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Messaging with other users requires a Premium subscription.
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-xs h-7 bg-amber-100 hover:bg-amber-200 border-amber-300">
                  <Link to="/pricing">Upgrade Now</Link>
                </Button>
              </div>
            )}
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No contacts found</p>
                <p className="text-sm">Add contacts using their user code</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredContacts.map((contact) => (
                  <li 
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedContact?.id === contact.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{contact.name}</p>
                          {contact.lastMessageTime && (
                            <span className="text-xs text-gray-500">
                              {formatTime(contact.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        {contact.lastMessage && (
                          <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                        )}
                      </div>
                      {contact.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="border-t bg-gray-50">
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">My Account</p>
                    <p className="text-xs text-gray-500">Free Plan</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { 
                  navigator.clipboard.writeText(myUserCode);
                  toast({ title: "Copied!", description: "Your user code has been copied to clipboard" });
                }}>
                  <Copy className="h-3 w-3 mr-1" />
                  <span className="text-xs">Copy Code</span>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 overflow-hidden flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    {selectedContact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                    <CardDescription>User Code: {selectedContact.userCode}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === myUserCode ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        msg.sender === myUserCode
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.encrypted ? (
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Lock className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {msg.sender === myUserCode ? "Encrypted message sent" : "Encrypted message received"}
                            </span>
                          </div>
                          <p className="text-sm break-all font-mono">{msg.content}</p>
                          <div className="flex justify-end mt-1">
                            <Button 
                              variant={msg.sender === myUserCode ? "secondary" : "outline"}
                              size="sm" 
                              className="h-6 text-xs"
                              onClick={() => {
                                navigator.clipboard.writeText(msg.content);
                                toast({ 
                                  title: "Copied",
                                  description: "Encrypted content copied to clipboard"
                                });
                              }}
                            >
                              <Copy className="h-3 w-3 mr-1" /> Copy
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                      <div className={`text-xs mt-1 ${msg.sender === myUserCode ? "text-primary-foreground/70" : "text-gray-500"}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
                    <Lock className="h-12 w-12 mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium">End-to-End Encrypted Chat</h3>
                    <p className="mt-2 text-sm">
                      Messages are encrypted and can only be decrypted by the intended recipient
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 border-t">
                <div className="w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <AlgorithmSelector
                      value={algorithm}
                      onChange={setAlgorithm}
                      type="encrypt"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Encryption toggle",
                          description: "This would toggle encryption on/off in a full implementation"
                        });
                      }}
                    >
                      <Lock className="h-5 w-5 text-primary" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button className="self-end" onClick={handleSendMessage}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                  {!isPremium && (
                    <p className="text-xs text-gray-500">
                      Free plan: <span className="font-medium">{message.trim().split(/\s+/).length}</span>/950 words
                    </p>
                  )}
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
              <MessageSquare className="h-16 w-16 mb-6 text-gray-400" />
              <h3 className="text-xl font-medium">Select a contact to start messaging</h3>
              <p className="mt-2 max-w-md">
                You can add contacts using their unique 16-character user code. Each user has a unique code that can be shared with others.
              </p>
              {!isPremium && (
                <div className="mt-6">
                  <p className="font-medium text-amber-700">Messaging requires a Premium subscription</p>
                  <Link to="/pricing">
                    <Button className="mt-2">Upgrade to Premium</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messaging;
