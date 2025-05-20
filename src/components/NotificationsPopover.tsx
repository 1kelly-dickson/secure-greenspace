import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useHookstate } from '@hookstate/core';
import { authState } from "@/state/auth";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationsPopover = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useHookstate(authState);

  useEffect(() => {
    fetchNotifications();

    // Set up a real-time subscription to listen for new notifications
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${auth.user.get()?.id}` },
        (payload) => {
          const newNotification = payload.new;
          const formattedNotification: Notification = {
            id: newNotification.id,
            type: newNotification.type,
            message: newNotification.message,
            timestamp: new Date(newNotification.created_at),
            read: newNotification.read,
          };
          setNotifications((prevNotifications) => [formattedNotification, ...prevNotifications]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth.user.get()?.id]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", auth.user.get()?.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedNotifications = data.map((notification) => ({
          id: notification.id,
          type: notification.type,
          message: notification.message,
          timestamp: new Date(notification.created_at),
          read: notification.read,
        }));
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Failed to load notifications",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Failed to mark as read",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", auth.user.get()?.id);

      if (error) {
        throw error;
      }

      setNotifications([]);
      toast({
        title: "Notifications cleared",
        description: "All notifications have been cleared.",
      });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast({
        title: "Failed to clear notifications",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  let notificationIcon;
  if (unreadCount > 0) {
    notificationIcon = (
      <Bell className="h-4 w-4" />
    );
  } else {
    notificationIcon = (
      <Bell className="h-4 w-4" />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          {notificationIcon}
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 rounded-full px-2 py-0.5 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium">Notifications</h3>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-2 p-4 hover:bg-secondary cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  {notification.type === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {notification.type === "info" && (
                    <Info className="h-4 w-4 text-blue-500" />
                  )}
                  {notification.type === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  {notification.type === "error" && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <time
                        dateTime={notification.timestamp.toISOString()}
                        className="text-xs text-muted-foreground"
                      >
                        {notification.timestamp.toLocaleDateString()}
                      </time>
                      {!notification.read && (
                        <Badge variant="outline">Unread</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button variant="secondary" className="w-full" onClick={clearAllNotifications}>
            Clear All
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
