
import { useState, useEffect } from "react";
import { Bell, UserPlus, Eye, AlertTriangle, Check, X } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useState as useHookState } from '@hookstate/core';
import { authState } from "@/state/auth";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'contact_request' | 'contact_accepted' | 'message' | 'view' | 'search' | 'warning';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
}

const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useHookState(authState);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!auth.user.get()) return;
    
    fetchNotifications();
    
    // Set up realtime subscription for new notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${auth.user.get()?.id}` 
      }, handleNewNotification)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${auth.user.get()?.id}` 
      }, () => fetchNotifications())
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth.user.get()?.id]);

  const handleNewNotification = (payload: any) => {
    fetchNotifications(); // Refresh all notifications when a new one arrives
  };

  const fetchNotifications = async () => {
    if (!auth.user.get()?.id) return;
    
    setIsLoading(true);
    
    try {
      // Get notifications with sender profile information
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          content,
          created_at,
          is_read,
          sender:sender_id (id, username, avatar_url)
        `)
        .eq('user_id', auth.user.get()?.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      if (notificationsData) {
        const formattedNotifications: Notification[] = notificationsData.map(n => ({
          id: n.id,
          type: n.type as any,
          title: getNotificationTitle(n.type),
          description: n.content,
          timestamp: new Date(n.created_at),
          read: n.is_read,
          actionable: n.type === 'contact_request',
          user: n.sender ? {
            id: n.sender.id,
            name: n.sender.username,
            avatar: n.sender.avatar_url
          } : undefined
        }));
        
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationTitle = (type: string): string => {
    switch (type) {
      case 'contact_request': return 'Connection Request';
      case 'contact_accepted': return 'Request Accepted';
      case 'message': return 'New Message';
      case 'view': return 'Message Viewed';
      case 'search': return 'Search Alert';
      case 'warning': return 'Security Alert';
      default: return 'Notification';
    }
  };

  const markAllAsRead = async () => {
    if (!auth.user.get()?.id) return;
    
    try {
      // Update all unread notifications
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', auth.user.get()?.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleAction = async (id: string, approved: boolean) => {
    // Find the notification
    const notification = notifications.find(n => n.id === id);
    if (!notification || !notification.user || !auth.user.get()?.id) return;
    
    try {
      if (notification.type === 'contact_request') {
        // Get the contact request
        const { data: contacts, error: fetchError } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', notification.user.id)
          .eq('contact_id', auth.user.get()?.id)
          .eq('status', 'pending')
          .maybeSingle();
        
        if (fetchError) throw fetchError;
        
        if (contacts) {
          // Update the status
          const { error: updateError } = await supabase
            .from('contacts')
            .update({ status: approved ? 'accepted' : 'rejected' })
            .eq('id', contacts.id);
          
          if (updateError) throw updateError;
          
          // Mark notification as read
          const { error: notifError } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
          
          if (notifError) throw notifError;
          
          // Update local state
          setNotifications(notifications.map(n => 
            n.id === id 
              ? { 
                  ...n, 
                  read: true, 
                  actionable: false, 
                  description: approved ? "Request accepted" : "Request denied" 
                } 
              : n
          ));
          
          toast({
            title: approved ? "Request accepted" : "Request declined",
            description: approved 
              ? `You are now connected with ${notification.user.name}` 
              : `You declined ${notification.user.name}'s request`,
          });
        }
      }
    } catch (error) {
      console.error('Error handling action:', error);
      toast({
        title: "Action failed",
        description: "Failed to process the request",
        variant: "destructive",
      });
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'contact_request': return <UserPlus className="w-4 h-4 text-primary" />;
      case 'contact_accepted': return <Check className="w-4 h-4 text-green-500" />;
      case 'view': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'search': return <Bell className="w-4 h-4 text-amber-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary" 
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading && notifications.length === 0 ? (
            <div className="flex justify-center p-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 ${notification.read ? 'bg-background' : 'bg-muted/50'}`}
                >
                  <div className="flex gap-4">
                    {notification.user ? (
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                    )}
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {notification.actionable && (
                    <div className="flex gap-2 mt-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction(notification.id, false)}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAction(notification.id, true)}
                        className="h-8 px-2"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
