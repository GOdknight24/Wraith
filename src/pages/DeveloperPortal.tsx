
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Trophy, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data for users - in a real app this would come from an API
const mockUsers = [
  { id: 1, username: 'user1', email: 'user1@example.com', isAdmin: false, badges: ['Early Adopter'] },
  { id: 2, username: 'user2', email: 'user2@example.com', isAdmin: false, badges: [] },
  { id: 3, username: 'developer', email: 'starzzyfrr@gmail.com', isAdmin: true, badges: ['Staff', 'Developer'] },
];

// Available badges to assign
const availableBadges = [
  { id: 'early-adopter', name: 'Early Adopter', description: 'One of the first users of the platform' },
  { id: 'verified', name: 'Verified', description: 'A verified user with a confirmed identity' },
  { id: 'premium', name: 'Premium', description: 'A premium subscriber' },
  { id: 'staff', name: 'Staff', description: 'A staff member of wraith.life' },
  { id: 'developer', name: 'Developer', description: 'A developer of wraith.life' },
];

const DeveloperPortal = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignBadge = () => {
    if (!selectedUser || !selectedBadge) return;
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUser.id
          ? { 
              ...user, 
              badges: user.badges.includes(selectedBadge) 
                ? user.badges 
                : [...user.badges, selectedBadge] 
            }
          : user
      )
    );
    
    toast.success(`Badge assigned to ${selectedUser.username}`);
    setSelectedBadge(null);
  };

  const handleRevokeBadge = (username: string, badge: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.username === username
          ? { ...user, badges: user.badges.filter(b => b !== badge) }
          : user
      )
    );
    
    toast.success(`Badge revoked from ${username}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Developer Portal</h1>
            <p className="text-white/60">Manage users and site features</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="glass-card border-white/10 md:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Admin Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-wraith-accent/20"
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-wraith-accent/20"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Badges
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-wraith-accent/20"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Access Control
                </Button>
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-white/60">
                  View and manage all users on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <Input 
                    placeholder="Search users..." 
                    className="glass-input text-white pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="rounded-md border border-white/10 overflow-hidden">
                  <table className="w-full text-white">
                    <thead className="bg-black/30">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm">Username</th>
                        <th className="px-4 py-3 text-left text-sm">Email</th>
                        <th className="px-4 py-3 text-left text-sm">Role</th>
                        <th className="px-4 py-3 text-left text-sm">Badges</th>
                        <th className="px-4 py-3 text-left text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 text-sm">{user.username}</td>
                          <td className="px-4 py-3 text-sm">{user.email}</td>
                          <td className="px-4 py-3 text-sm">
                            {user.isAdmin ? (
                              <Badge className="bg-wraith-accent">Admin</Badge>
                            ) : (
                              <Badge variant="outline" className="text-white/70 border-white/30">User</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex flex-wrap gap-1">
                              {user.badges.map((badge) => (
                                <Badge 
                                  key={badge} 
                                  className="bg-white/10 hover:bg-white/20 cursor-pointer"
                                  onClick={() => handleRevokeBadge(user.username, badge)}
                                >
                                  {badge} ×
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white/70 hover:text-white hover:bg-wraith-accent/20"
                              onClick={() => setSelectedUser(user)}
                            >
                              Manage
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {selectedUser && (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Manage User: {selectedUser.username}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Assign badges and manage user permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="badges">
                    <TabsList className="bg-black/20 border border-white/10">
                      <TabsTrigger value="badges" className="data-[state=active]:bg-wraith-accent data-[state=active]:text-white">
                        Badges
                      </TabsTrigger>
                      <TabsTrigger value="permissions" className="data-[state=active]:bg-wraith-accent data-[state=active]:text-white">
                        Permissions
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="badges" className="mt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {availableBadges.map((badge) => (
                            <div 
                              key={badge.id} 
                              className={`
                                p-3 rounded-lg border cursor-pointer transition-all
                                ${selectedBadge === badge.name 
                                  ? 'border-wraith-accent bg-wraith-accent/20' 
                                  : 'border-white/10 hover:border-white/30 bg-black/20'}
                              `}
                              onClick={() => setSelectedBadge(badge.name)}
                            >
                              <div className="flex items-start">
                                <Badge className={`${selectedBadge === badge.name ? 'bg-wraith-accent' : 'bg-white/10'}`}>
                                  {badge.name}
                                </Badge>
                              </div>
                              <p className="mt-2 text-sm text-white/70">{badge.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="permissions" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="admin-permission" 
                            className="rounded bg-black/20 border-white/30 text-wraith-accent"
                            checked={selectedUser.isAdmin}
                            readOnly
                          />
                          <Label htmlFor="admin-permission" className="text-white">Administrator</Label>
                        </div>
                        <p className="text-sm text-white/60">
                          Administrator permissions cannot be modified through this interface.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="border-white/10 text-white hover:bg-white/10"
                    onClick={() => {
                      setSelectedUser(null);
                      setSelectedBadge(null);
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    className="bg-wraith-accent hover:bg-wraith-hover text-white"
                    disabled={!selectedBadge}
                    onClick={handleAssignBadge}
                  >
                    Assign Badge
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortal;
