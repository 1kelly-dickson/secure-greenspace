
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "@/components/UserProfile";
import MessagingDashboard from "@/components/MessagingDashboard";
import PageTour from "@/components/PageTour";
import NotificationsPopover from "@/components/NotificationsPopover";
import { User, MessageSquare, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("messages");
  
  // Mock user data
  const user = {
    id: "user-1",
    username: "You",
    avatarUrl: "https://avatar.vercel.sh/u/42960598",
    isPremium: true
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <NotificationsPopover />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline">{user.username}</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <MessagingDashboard user={user} />
          <PageTour pageName="messaging" />
        </TabsContent>
        
        <TabsContent value="profile">
          <UserProfile 
            username={user.username}
            avatarUrl={user.avatarUrl}
            isPremium={user.isPremium}
          />
          <PageTour pageName="profile" />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-500">Settings page is under construction.</p>
            <Button className="mt-4">Coming Soon</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
