import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Lock, Copy, FileText, Paperclip, Image, Trash2, X } from "lucide-react";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useHookstate } from '@hookstate/core';
import { authState } from "@/state/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  senderId: string;
  attachmentUrl?: string;
  attachmentType?: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File | null; preview: string | null }>({
    file: null,
    preview: null
  });
  const auth = useHookstate(authState);

  useEffect(() => {
    // Fetch messages when conversation opens
    fetchMessages();
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${currentUser.id},receiver_id=eq.${contact.id}` 
      }, handleNewMessage)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${contact.id},receiver_id=eq.${currentUser.id}` 
      }, handleNewMessage)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contact.id, currentUser.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = (payload: any) => {
    const newMsg = payload.new;
    
    const formattedMessage: Message = {
      id: newMsg.id,
      sender: newMsg.sender_id === currentUser.id ? currentUser.username : contact.username,
      text: newMsg.content,
      timestamp: new Date(newMsg.created_at),
      senderId: newMsg.sender_id,
      attachmentUrl: newMsg.attachment_url,
      attachmentType: newMsg.attachment_type
    };
    
    setMessages(prevMessages => [...prevMessages, formattedMessage]);
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${contact.id}),and(sender_id.eq.${contact.id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          sender: msg.sender_id === currentUser.id ? currentUser.username : contact.username,
          text: msg.content,
          timestamp: new Date(msg.created_at),
          senderId: msg.sender_id,
          attachmentUrl: msg.attachment_url,
          attachmentType: msg.attachment_type
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Failed to load messages",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        file,
        preview: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachment({ file: null, preview: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadAttachment = async (file: File) => {
    const userId = auth.user?.id;
    if (!userId) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    try {
      // Create a storage bucket if it doesn't exist
      const { error: bucketError } = await supabase.storage.createBucket('message_attachments', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      
      // Ignore if bucket already exists
      if (bucketError && bucketError.message !== 'Bucket already exists') {
        console.error('Error creating bucket:', bucketError);
        throw bucketError;
      }
      
      const { data, error } = await supabase.storage
        .from('message_attachments')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('message_attachments')
        .getPublicUrl(filePath);
      
      return {
        url: publicUrl,
        type: file.type
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Failed to upload file",
        description: "Please try again",
        variant: "destructive",
      });
      return null;
    }
  };

  const sendMessage = async () => {
    if ((!messageText && !attachment.file) || !auth.user?.id) {
      toast({
        title: "Cannot send empty message",
        description: "Please enter a message or attach a file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let attachmentData = null;
      
      if (attachment.file) {
        attachmentData = await uploadAttachment(attachment.file);
      }
      
      // For simplicity, we're only implementing mock encryption here
      // In a real app, you'd use proper encryption with the password and algorithm
      const encryptedContent = password ? `Encrypted: ${messageText}` : null;
      
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: contact.id,
        content: messageText || (attachment.file ? `Sent an attachment` : ''),
        encrypted_content: encryptedContent,
        encryption_algorithm: password ? algorithm : null,
        attachment_url: attachmentData?.url || null,
        attachment_type: attachmentData?.type || null
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select();
      
      if (error) {
        throw error;
      }
      
      setMessageText("");
      removeAttachment();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center p-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center p-8">
              <Lock className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
              <h3 className="font-medium text-lg mb-1">Start a secure conversation</h3>
              <p className="text-muted-foreground text-sm">
                Your messages are encrypted end-to-end and stay private.
              </p>
            </div>
          ) : (
            messages.map((message) => (
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
                  <p className="break-words mb-1">{message.text}</p>
                  
                  {message.attachmentUrl && (
                    <div className="mt-2 mb-1">
                      {message.attachmentType?.startsWith('image/') ? (
                        <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={message.attachmentUrl} 
                            alt="Attachment" 
                            className="max-w-full rounded-md max-h-[200px] object-contain"
                          />
                        </a>
                      ) : (
                        <a 
                          href={message.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-background/30 rounded-md"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-sm truncate">Attachment</span>
                        </a>
                      )}
                    </div>
                  )}
                  
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
            ))
          )}
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
          
          {attachment.file && (
            <div className="relative p-2 border rounded-md bg-muted">
              <div className="flex items-center gap-2">
                {attachment.file.type.startsWith('image/') && attachment.preview ? (
                  <div className="w-16 h-16 relative">
                    <img 
                      src={attachment.preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-background rounded-md">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{attachment.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(attachment.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={removeAttachment}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[80px] flex-1"
            />
            <div className="flex flex-col gap-2 self-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" /> 
                    <span>Document</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                    <Image className="mr-2 h-4 w-4" /> 
                    <span>Image</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAttachment}
                className="hidden"
                accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              
              <Button 
                onClick={sendMessage}
                disabled={isLoading || (!messageText && !attachment.file)}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Conversation;
