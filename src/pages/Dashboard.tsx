
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "@/components/UserProfile";
import MessagingDashboard from "@/components/MessagingDashboard";
import PageTour from "@/components/PageTour";
import NotificationsPopover from "@/components/NotificationsPopover";
import { User, MessageSquare, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState as useHookState } from '@hookstate/core';
import { authState, signOut } from "@/state/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const auth = useHookState(authState);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (auth.user.get()?.id) {
      fetchProfile();
    }
  }, [auth.user.get()?.id]);

  const fetchProfile = async () => {
    if (!auth.user.get()?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user.get()?.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { success } = await signOut();
    
    if (success) {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
      navigate("/");
    }
  };
  
  // Create a user object from profile data
  const userProfile = profile ? {
    id: profile.id,
    username: profile.username,
    avatarUrl: profile.avatar_url,
    isPremium: profile.is_premium
  } : {
    id: auth.user.get()?.id || "user-1",
    username: auth.user.get()?.email?.split('@')[0] || "User",
    avatarUrl: "https://avatar.vercel.sh/u/42960598",
    isPremium: false
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <NotificationsPopover />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username} />
              <AvatarFallback>{userProfile.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline">{userProfile.username}</span>
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
          <MessagingDashboard user={userProfile} />
          <PageTour pageName="messaging" />
        </TabsContent>
        
        <TabsContent value="profile">
          <UserProfile 
            username={userProfile.username}
            avatarUrl={userProfile.avatarUrl}
            isPremium={userProfile.isPremium}
            userCode={profile?.user_code}
          />
          <PageTour pageName="profile" />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-500 mb-6">Account and security settings.</p>
            
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Authentication</h3>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
