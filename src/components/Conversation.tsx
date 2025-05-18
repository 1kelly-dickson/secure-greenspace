
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Lock, Copy } from "lucide-react";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  senderId: string;
}

interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  isPremium?: boolean;
}

interface ConversationProps {
  currentUser: UserProfile;
  contact: UserProfile;
}

const Conversation = ({ currentUser, contact }: ConversationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [password, setPassword] = useState("");
  const [algorithm, setAlgorithm] = useState("aes-256");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load example messages when contact changes
    const initialMessages: Message[] = [
      {
        id: "msg-1",
        sender: contact.username,
        senderId: contact.id,
        text: "Hey there! 👋",
        timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 mins ago
      },
      {
        id: "msg-2",
        sender: currentUser.username,
        senderId: currentUser.id,
        text: "Hello! How are you?",
        timestamp: new Date(Date.now() - 1000 * 60 * 4) // 4 mins ago
      },
      {
        id: "msg-3",
        sender: contact.username,
        senderId: contact.id,
        text: "I'm good! Can you send me that encrypted file we discussed?",
        timestamp: new Date(Date.now() - 1000 * 60 * 3) // 3 mins ago
      },
      {
        id: "msg-4",
        sender: currentUser.username,
        senderId: currentUser.id,
        text: "Encrypted: XXXX-XXXX-XXXX-XXXX",
        timestamp: new Date(Date.now() - 1000 * 60 * 2) // 2 mins ago
      }
    ];
    setMessages(initialMessages);
  }, [contact.id, contact.username, currentUser.id, currentUser.username]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      sender: currentUser.username,
      senderId: currentUser.id,
      text: encryptedMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const copyMessage = (message: Message) => {
    navigator.clipboard.writeText(message.text);
    toast({
      title: "Message copied",
      description: "Message has been copied to clipboard",
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contact.avatarUrl} alt={contact.username} />
            <AvatarFallback>{contact.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{contact.username}</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.senderId === currentUser.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">{message.sender}</span>
                  <span className="text-xs">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="break-words">{message.text}</p>
                <div className="flex justify-end mt-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5" 
                    onClick={() => copyMessage(message)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <CardFooter className="border-t p-4">
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Encryption</label>
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[80px] flex-1"
            />
            <Button 
              className="self-end" 
              onClick={sendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Conversation;
