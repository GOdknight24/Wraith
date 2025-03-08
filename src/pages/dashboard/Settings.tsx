import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  User, 
  Mail, 
  Link as LinkIcon, 
  Trash,
  Shield,
  UserCircle,
  Settings as SettingsIcon,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  const { currentUser, logout, isDeveloper } = useAuth();
  const { userProfile } = useProfile();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const copyToClipboard = () => {
    const bioLink = `${window.location.origin}/${currentUser?.username}`;
    navigator.clipboard.writeText(bioLink);
    setCopied(true);
    toast.success('Biolink URL copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== currentUser?.username) {
      toast.error('Username confirmation does not match');
      return;
    }
    
    // In a real app, this would call an API to delete the account
    // For this demo, we'll just log out
    logout();
    navigate('/login');
    toast.success('Account deleted successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <SettingsIcon size={24} className="mr-2 text-wraith-accent" />
            Account Settings
          </h1>
          <p className="text-white/60 mt-1">Manage your account preferences and settings</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="glass mb-6 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-wraith-accent data-[state=active]:text-white">
            <UserCircle size={16} className="mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-wraith-accent data-[state=active]:text-white">
            <User size={16} className="mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="danger" className="data-[state=active]:bg-destructive data-[state=active]:text-white">
            <AlertTriangle size={16} className="mr-2" />
            Danger Zone
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="profile" className="space-y-6 mt-0">
          <Card className="glass-card border-white/10 card-glow-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <User size={18} className="mr-2 text-wraith-accent" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-white/60">
                Your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60">Username</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-3 text-white font-medium w-full">
                      {currentUser?.username}
                    </div>
                    {isDeveloper && (
                      <Badge className="bg-wraith-accent hover:bg-wraith-hover">
                        <Shield size={12} className="mr-1" />
                        Developer
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">Email</Label>
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-3 text-white font-medium w-full overflow-hidden text-ellipsis">
                    {currentUser?.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        
          <Card className="glass-card border-white/10 card-glow-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <LinkIcon size={18} className="mr-2 text-wraith-accent" />
                Your Biolink
              </CardTitle>
              <CardDescription className="text-white/60">
                Share your biolink with others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-3 font-mono text-sm text-white overflow-hidden">
                  {window.location.origin}/{currentUser?.username}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-white/10 hover:bg-white/10 text-white" 
                  onClick={copyToClipboard}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-white/10 hover:bg-white/10 text-white"
                  asChild
                >
                  <a 
                    href={`/${currentUser?.username}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-wraith-accent/30">
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-wraith-accent/10 rounded-full">
                    <Eye size={16} className="text-wraith-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Profile Views</p>
                    <p className="text-lg font-bold text-white">{userProfile?.views || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6 mt-0">
          <Card className="glass-card border-white/10 card-glow-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Mail size={18} className="mr-2 text-wraith-accent" />
                Account Notifications
              </CardTitle>
              <CardDescription className="text-white/60">
                Manage email preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="marketing" 
                    className="h-4 w-4 rounded border-gray-300 text-wraith-accent focus:ring-wraith-accent" 
                    defaultChecked
                  />
                  <label htmlFor="marketing" className="text-sm text-white">
                    Receive marketing emails and promotions
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="updates" 
                    className="h-4 w-4 rounded border-gray-300 text-wraith-accent focus:ring-wraith-accent" 
                    defaultChecked
                  />
                  <label htmlFor="updates" className="text-sm text-white">
                    Receive product updates and new features
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="activity" 
                    className="h-4 w-4 rounded border-gray-300 text-wraith-accent focus:ring-wraith-accent" 
                    defaultChecked
                  />
                  <label htmlFor="activity" className="text-sm text-white">
                    Receive activity notifications (profile views, etc.)
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-wraith-accent hover:bg-wraith-hover text-white">
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-card border-white/10 card-glow-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Shield size={18} className="mr-2 text-wraith-accent" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-white/60">
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-black/30 border border-white/10 hover:bg-black/40 hover:border-white/20">
                Change Password
              </Button>
              <Button className="w-full bg-black/30 border border-white/10 hover:bg-black/40 hover:border-white/20">
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="danger" className="space-y-6 mt-0">
          <Card className="glass-card border-white/10 border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-destructive flex items-center">
                <AlertTriangle size={18} className="mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-white/60">
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Delete Your Account</h3>
                  <p className="text-sm text-white/70 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                      >
                        <Trash size={16} className="mr-2" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center">
                          <AlertTriangle className="mr-2" size={18} /> Delete Account
                        </DialogTitle>
                        <DialogDescription className="text-white/60">
                          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-white/70">
                          To confirm, please type your username: <strong>{currentUser?.username}</strong>
                        </p>
                        <Input
                          className="glass-input text-white"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Enter your username"
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          className="border-white/10 text-white hover:bg-white/10"
                          onClick={() => setIsDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmation !== currentUser?.username}
                        >
                          <Trash size={16} className="mr-2" />
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
