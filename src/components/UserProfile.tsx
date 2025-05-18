
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Clock, UserCog, Eye, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  username: string;
  avatarUrl: string;
  isPremium: boolean;
  userCode?: string;
}

const UserProfile = ({ username, avatarUrl, isPremium, userCode }: UserProfileProps) => {
  const [deleteAfterViewing, setDeleteAfterViewing] = useState("never");
  const [encryptionNotifications, setEncryptionNotifications] = useState(true);
  const { toast } = useToast();

  const copyCode = () => {
    if (userCode) {
      navigator.clipboard.writeText(userCode);
      toast({
        title: "Code Copied",
        description: "Your unique code has been copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{username}</p>
              <p className="text-sm text-muted-foreground">
                {isPremium ? "Premium User" : "Free User"}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm">
              <UserCog className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Control your messaging security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Auto-delete messages after viewing</Label>
            <Select value={deleteAfterViewing} onValueChange={setDeleteAfterViewing}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="1min">1 minute</SelectItem>
                <SelectItem value="2min">2 minutes</SelectItem>
                <SelectItem value="5min">5 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="encryption-notifications">Encryption Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts when messages are encrypted/decrypted</p>
            </div>
            <Switch 
              id="encryption-notifications" 
              checked={encryptionNotifications} 
              onCheckedChange={setEncryptionNotifications} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Unique Code</CardTitle>
          <CardDescription>Share this code with friends so they can find you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded-md font-mono text-center text-lg">
            {userCode || `SEC-${username.toUpperCase()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`}
          </div>
          <Button className="w-full mt-2" variant="outline" onClick={copyCode}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Code
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Security Report</CardTitle>
          <CardDescription>Your encryption activity summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Messages Encrypted</span>
            </div>
            <span className="font-semibold">24</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-amber-500" />
              <span>Messages Viewed</span>
            </div>
            <span className="font-semibold">18</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Auto-deleted Messages</span>
            </div>
            <span className="font-semibold">3</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
