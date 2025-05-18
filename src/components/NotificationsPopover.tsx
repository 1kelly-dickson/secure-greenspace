
import { useState } from "react";
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

interface Notification {
  id: string;
  type: 'request' | 'view' | 'search' | 'warning';
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
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "request",
      title: "Connection Request",
      description: "Alice wants to connect with you",
      timestamp: new Date(),
      read: false,
      actionable: true,
      user: {
        id: "user-2",
        name: "Alice",
        avatar: "https://avatar.vercel.sh/u/74240040"
      }
    },
    {
      id: "2",
      type: "view",
      title: "Message Viewed",
      description: "Bob viewed your encrypted message",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      read: false,
      actionable: false,
      user: {
        id: "user-3",
        name: "Bob",
        avatar: "https://avatar.vercel.sh/u/54717377"
      }
    },
    {
      id: "3",
      type: "search",
      title: "Search Alert",
      description: "Charlie searched for your profile",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true,
      actionable: false,
      user: {
        id: "user-4",
        name: "Charlie",
        avatar: "https://avatar.vercel.sh/u/68969568"
      }
    },
    {
      id: "4",
      type: "warning",
      title: "Security Alert",
      description: "Unusual login attempt detected",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      actionable: false,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleAction = (id: string, approved: boolean) => {
    setNotifications(notifications.map(n => 
      n.id === id 
        ? { ...n, read: true, actionable: false, description: approved ? "Request accepted" : "Request denied" } 
        : n
    ));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'request': return <UserPlus className="w-4 h-4 text-primary" />;
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
          {notifications.length > 0 ? (
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
