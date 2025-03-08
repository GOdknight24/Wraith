
import { useState, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Grip, 
  Trash2, 
  Edit, 
  Plus, 
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  MessageCircle,
  Disc,
  ArrowUpRight,
  Image,
  Github,
  Linkedin,
  Gamepad2, 
  FileText,
  Music2
} from 'lucide-react';
import { toast } from 'sonner';

interface LinkFormData {
  title: string;
  url: string;
  enabled: boolean;
  platform?: string;
  imageUrl?: string;
}

const socialMediaPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram size={24} className="text-[#E1306C]" />, placeholder: 'username' },
  { id: 'discord', name: 'Discord', icon: <MessageCircle size={24} className="text-[#5865F2]" />, placeholder: 'username#0000' },
  { id: 'twitter', name: 'Twitter', icon: <Twitter size={24} className="text-[#1DA1F2]" />, placeholder: 'username' },
  { id: 'facebook', name: 'Facebook', icon: <Facebook size={24} className="text-[#4267B2]" />, placeholder: 'username or profile id' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube size={24} className="text-[#FF0000]" />, placeholder: 'channel name' },
  { id: 'tiktok', name: 'TikTok', icon: <span className="text-xl font-bold">TT</span>, placeholder: 'username' },
  { id: 'spotify', name: 'Spotify', icon: <Disc size={24} className="text-[#1DB954]" />, placeholder: 'username' },
  { id: 'github', name: 'GitHub', icon: <Github size={24} className="text-white" />, placeholder: 'username' },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={24} className="text-[#0077B5]" />, placeholder: 'username' },
  { id: 'twitch', name: 'Twitch', icon: <Gamepad2 size={24} className="text-[#9146FF]" />, placeholder: 'username' },
  { id: 'reddit', name: 'Reddit', icon: <span className="text-xl font-bold text-[#FF4500]">r/</span>, placeholder: 'username' },
  { id: 'snapchat', name: 'Snapchat', icon: <span className="text-xl font-bold text-[#FFFC00]">👻</span>, placeholder: 'username' },
  { id: 'pinterest', name: 'Pinterest', icon: <FileText size={24} className="text-[#E60023]" />, placeholder: 'username' },
];

const ProfileLinks = () => {
  const { userProfile, updateProfile, addLink, removeLink, updateLink, addSocialLink, uploadFile } = useProfile();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState<LinkFormData>({ title: '', url: '', enabled: true });
  const [editingLink, setEditingLink] = useState<{ id: string } & LinkFormData>({ id: '', title: '', url: '', enabled: true });
  const [socialUsername, setSocialUsername] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddLink = () => {
    // Basic validation
    if (!newLink.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!newLink.url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Add http if missing
    let url = newLink.url;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    addLink({ ...newLink, url });
    setNewLink({ title: '', url: '', enabled: true });
    setIsAddDialogOpen(false);
  };

  const handleEditLink = () => {
    if (!editingLink.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!editingLink.url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Add http if missing
    let url = editingLink.url;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    updateLink(editingLink.id, { ...editingLink, url });
    setIsEditDialogOpen(false);
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      removeLink(id);
    }
  };

  const handleAddSocialLink = () => {
    if (!socialUsername.trim()) {
      toast.error('Please enter your username');
      return;
    }

    addSocialLink(selectedPlatform, socialUsername);
    setSocialUsername('');
    setSelectedPlatform('');
    setIsSocialDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, forAdd = true) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      const imageUrl = await uploadFile(file, 'link-image');
      
      if (forAdd) {
        setNewLink(prev => ({ ...prev, imageUrl }));
      } else {
        setEditingLink(prev => ({ ...prev, imageUrl }));
      }
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Without react-beautiful-dnd, let's implement a simplified reordering
  const moveLink = (index: number, direction: 'up' | 'down') => {
    if (!userProfile?.links) return;
    
    const links = Array.from(userProfile.links);
    
    if (direction === 'up' && index > 0) {
      const temp = links[index];
      links[index] = links[index - 1];
      links[index - 1] = temp;
    } else if (direction === 'down' && index < links.length - 1) {
      const temp = links[index];
      links[index] = links[index + 1];
      links[index + 1] = temp;
    }
    
    updateProfile({ links });
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = socialMediaPlatforms.find(p => p.id === platform);
    return platformData ? platformData.icon : <ExternalLink size={16} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Links</h1>
          <p className="text-white/60">Manage the links on your profile</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-wraith-accent/80 hover:bg-wraith-hover text-white">
                <ArrowUpRight size={16} className="mr-2" /> Social Platforms
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Add Social Media</DialogTitle>
                <DialogDescription className="text-white/60">
                  Add your social media links to your profile
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {socialMediaPlatforms.map((platform) => (
                    <div 
                      key={platform.id}
                      className={`
                        p-3 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer
                        ${selectedPlatform === platform.id ? 'bg-white/10 border border-white/20' : 'bg-black/20 border border-transparent hover:bg-white/5'}
                      `}
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      {platform.icon}
                      <span className="text-sm text-white mt-1">{platform.name}</span>
                    </div>
                  ))}
                </div>
                
                {selectedPlatform && (
                  <div className="space-y-2">
                    <Label className="text-white">
                      Your {socialMediaPlatforms.find(p => p.id === selectedPlatform)?.name} Username
                    </Label>
                    <Input
                      className="glass-input text-white"
                      placeholder={socialMediaPlatforms.find(p => p.id === selectedPlatform)?.placeholder}
                      value={socialUsername}
                      onChange={(e) => setSocialUsername(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  className="border-white/10 text-white hover:bg-white/10"
                  onClick={() => setIsSocialDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-wraith-accent hover:bg-wraith-hover text-white"
                  onClick={handleAddSocialLink}
                  disabled={!selectedPlatform || !socialUsername.trim()}
                >
                  Add Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-wraith-accent hover:bg-wraith-hover text-white">
                <Plus size={16} className="mr-2" /> Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Link</DialogTitle>
                <DialogDescription className="text-white/60">
                  Add a new custom link to your profile
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    className="glass-input text-white"
                    placeholder="My Website"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    className="glass-input text-white"
                    placeholder="https://example.com"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="image">
                    Link Image (Optional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-white/10 text-white hover:bg-white/10"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Image size={16} className="mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    
                    {newLink.imageUrl && (
                      <div className="w-12 h-12 rounded bg-black/20 overflow-hidden">
                        <img 
                          src={newLink.imageUrl} 
                          alt="Link thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={newLink.enabled}
                    onCheckedChange={(checked) => setNewLink({ ...newLink, enabled: checked })}
                  />
                  <Label className="text-white" htmlFor="enabled">Enabled</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  className="border-white/10 text-white hover:bg-white/10"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-wraith-accent hover:bg-wraith-hover text-white"
                  onClick={handleAddLink}
                >
                  Add Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Your Links</CardTitle>
          <CardDescription className="text-white/60">
            Manage your profile links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userProfile?.links && userProfile.links.length > 0 ? (
            <div className="space-y-3">
              {userProfile.links.map((link, index) => (
                <div
                  key={link.id}
                  className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10"
                        onClick={() => moveLink(index, 'up')}
                        disabled={index === 0}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10"
                        onClick={() => moveLink(index, 'down')}
                        disabled={index === userProfile.links.length - 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      {link.imageUrl ? (
                        <img 
                          src={link.imageUrl} 
                          alt={link.title} 
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        link.platform ? (
                          getPlatformIcon(link.platform)
                        ) : (
                          <ExternalLink size={16} className="text-white/70" />
                        )
                      )}
                      <div>
                        <p className="text-white font-medium">{link.title}</p>
                        <div className="flex items-center space-x-1 text-xs text-white/50">
                          <ExternalLink size={10} />
                          <span className="truncate max-w-[200px]">{link.url}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`enabled-${link.id}`}
                      checked={link.enabled !== false}
                      onCheckedChange={(checked) => updateLink(link.id, { enabled: checked })}
                    />
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => {
                        setEditingLink({
                          id: link.id,
                          title: link.title,
                          url: link.url,
                          enabled: link.enabled !== false,
                          platform: link.platform,
                          imageUrl: link.imageUrl
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/40">You don't have any links yet</p>
              <div className="flex gap-2 justify-center mt-4">
                <Button 
                  className="bg-wraith-accent/80 hover:bg-wraith-hover text-white"
                  onClick={() => setIsSocialDialogOpen(true)}
                >
                  <ArrowUpRight size={16} className="mr-2" /> Add Social Media
                </Button>
                <Button 
                  className="bg-wraith-accent hover:bg-wraith-hover text-white"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus size={16} className="mr-2" /> Add Custom Link
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Link</DialogTitle>
            <DialogDescription className="text-white/60">
              Update your link details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white" htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                className="glass-input text-white"
                value={editingLink.title}
                onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white" htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                className="glass-input text-white"
                value={editingLink.url}
                onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white" htmlFor="edit-image">
                Link Image (Optional)
              </Label>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-white/10 text-white hover:bg-white/10"
                  onClick={() => editFileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Image size={16} className="mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                
                {editingLink.imageUrl && (
                  <div className="w-12 h-12 rounded bg-black/20 overflow-hidden">
                    <img 
                      src={editingLink.imageUrl} 
                      alt="Link thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={editFileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-enabled"
                checked={editingLink.enabled}
                onCheckedChange={(checked) => setEditingLink({ ...editingLink, enabled: checked })}
              />
              <Label className="text-white" htmlFor="edit-enabled">Enabled</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/10"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-wraith-accent hover:bg-wraith-hover text-white"
              onClick={handleEditLink}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileLinks;
