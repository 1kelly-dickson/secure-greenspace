import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lock, Send, Copy, Plus, User, Search, MessageSquare, X } from "lucide-react";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
}

const Messaging = () => {
  const [algorithm, setAlgorithm] = useState("aes-256");
  const [messageText, setMessageText] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isPremium] = useState(false); // This would be determined by authentication status
  const { toast } = useToast();

  // Mock user data (replace with actual user authentication and data fetching)
  const mockCurrentUser: UserProfile = {
    id: "user-1",
    username: "You",
    avatarUrl: "https://avatar.vercel.sh/u/42960598"
  };

  const mockUsers: UserProfile[] = [
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
  ];

  useEffect(() => {
    // Simulate fetching initial messages (replace with actual API call)
    const initialMessages: Message[] = [
      {
        id: "msg-1",
        sender: "Alice",
        text: "Hey there! 👋",
        timestamp: new Date()
      },
      {
        id: "msg-2",
        sender: "You",
        text: "Hello!",
        timestamp: new Date()
      }
    ];
    setMessages(initialMessages);
  }, []);

  const sendMessage = () => {
    if (!messageText || !password) {
      toast({
        title: "Missing information",
        description: "Please enter a message and password",
        variant: "destructive",
      });
      return;
    }

    // Simulate encryption (replace with actual encryption logic)
    const encryptedMessage = `Encrypted: ${messageText}`;

    const newMessage: Message = {
      id: `msg-${messages.length + 1}`,
      sender: mockCurrentUser.username,
      text: encryptedMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const handleSearchUsers = () => {
    // Simulate searching for users (replace with actual API call)
    const results = mockUsers.filter(user =>
      user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setSearchResults([]);
    setUserSearchQuery("");
  };

  const copyMessage = (message: Message) => {
    navigator.clipboard.writeText(message.text);
    toast({
      title: "Message copied",
      description: "Message has been copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Selection */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                <User className="mr-2 h-4 w-4" />
                Select a User
              </CardTitle>
              <CardDescription>Start a conversation with someone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search for users..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleSearchUsers}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <ul className="space-y-2">
                  {searchResults.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{user.username}</span>
                      </div>
                      <Plus className="h-4 w-4 text-gray-500" />
                    </li>
                  ))}
                </ul>
              )}

              {selectedUser && (
                <div className="flex items-center justify-between p-2 rounded-md bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{selectedUser.username}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Messaging Interface */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <MessageSquare className="mr-2 h-4 w-4" />
                {selectedUser ? `Chat with ${selectedUser.username}` : "Messaging"}
              </CardTitle>
              <CardDescription>Send and receive secure messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Encryption Algorithm</label>
                <AlgorithmSelector
                  value={algorithm}
                  onChange={setAlgorithm}
                  type="encrypt"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter password to encrypt message"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Button onClick={sendMessage} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Message History */}
          <div className="mt-6 space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className={message.sender === mockCurrentUser.username ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{message.sender}</CardTitle>
                  <div className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{message.text}</p>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="ghost" size="sm" onClick={() => copyMessage(message)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
