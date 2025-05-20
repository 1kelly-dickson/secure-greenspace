import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCheck, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationsPopover = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user.id) {
        try {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching notifications:', error);
            return;
          }

          if (data) {
            const updatedNotifications = data.map(notification => ({
              id: notification.id,
              type: notification.type,
              message: notification.content,
              timestamp: new Date(notification.created_at),
              read: notification.is_read
            }));
            setNotifications(updatedNotifications as Notification[]);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();

    // Set up a real-time subscription to listen for new notifications
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          if (payload.new) {
            const newNotification = {
              id: payload.new.id,
              type: payload.new.type,
              message: payload.new.content,
              timestamp: new Date(payload.new.created_at),
              read: payload.new.is_read
            };
            setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const markAsRead = async (notification: Notification) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id);

      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id);

      setNotifications(prevNotifications =>
        prevNotifications.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" role="button" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {unreadCount}
            </div>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-4">
          <p className="text-sm font-medium">Notifications</p>
          {notifications.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 rounded-full">
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Mark All as Read
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount>
                <DropdownMenuItem onClick={markAllAsRead}>
                  Confirm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="flex flex-col space-y-1 p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center space-x-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/u/${notification.type}.jpeg`} />
                    <AvatarFallback>{notification.type.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <time className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleDateString()}
                    </time>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-8"
                      onClick={() => markAsRead(notification)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
