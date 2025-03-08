
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ExternalLink, Link as LinkIcon, Palette, Music } from 'lucide-react';
import { StatsWidget, QuickActionsWidget, RecentActivityWidget } from '@/components/DashboardWidgets';

const Home = () => {
  const { currentUser } = useAuth();
  const { userProfile } = useProfile();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <LayoutDashboard size={24} className="mr-2 text-wraith-accent" />
            Dashboard
          </h1>
          <p className="text-white/60 mt-1">Welcome back, {currentUser?.username}!</p>
        </div>
        <Button 
          className="bg-wraith-accent hover:bg-wraith-hover text-white flex-shrink-0"
          asChild
        >
          <a href={`/${currentUser?.username}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} className="mr-2" />
            Visit Your Profile
          </a>
        </Button>
      </div>
      
      <StatsWidget />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <QuickActionsWidget />
          <RecentActivityWidget />
        </div>
        
        <Card className="glass-card border-white/10 p-5 card-glow-hover">
          <CardHeader className="pb-3 px-0">
            <CardTitle className="text-white">Navigation</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a 
                href="/dashboard/links" 
                className="glass-card rounded-xl p-4 flex items-start space-x-3 hover:bg-white/5 transition-all duration-200 hover-scale-sm"
              >
                <div className="p-2 rounded-lg bg-wraith-accent/10">
                  <LinkIcon size={18} className="text-wraith-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Manage Links</h3>
                  <p className="text-sm text-white/60 mt-1">Add, edit, or remove links</p>
                </div>
              </a>
              
              <a 
                href="/dashboard/appearance" 
                className="glass-card rounded-xl p-4 flex items-start space-x-3 hover:bg-white/5 transition-all duration-200 hover-scale-sm"
              >
                <div className="p-2 rounded-lg bg-wraith-accent/10">
                  <Palette size={18} className="text-wraith-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Appearance</h3>
                  <p className="text-sm text-white/60 mt-1">Customize your profile look</p>
                </div>
              </a>
              
              <a 
                href="/dashboard/audio" 
                className="glass-card rounded-xl p-4 flex items-start space-x-3 hover:bg-white/5 transition-all duration-200 hover-scale-sm"
              >
                <div className="p-2 rounded-lg bg-wraith-accent/10">
                  <Music size={18} className="text-wraith-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Audio Settings</h3>
                  <p className="text-sm text-white/60 mt-1">Add background sound</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
