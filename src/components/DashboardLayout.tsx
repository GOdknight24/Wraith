
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  Palette,
  Music,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  Eye,
  LayoutDashboard,
  PanelRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';

const DashboardLayout = () => {
  const { currentUser, logout, isDeveloper } = useAuth();
  const { userProfile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    // Close sidebar on mobile when changing routes
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-30 w-[280px] glass transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
        `}
      >
        {/* Toggle Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute -right-12 top-5 bg-wraith-accent text-white p-2.5 rounded-r-xl shadow-lg"
        >
          <PanelRight size={20} />
        </button>

        <div className="flex flex-col h-full p-5">
          {/* Header */}
          <div className="flex items-center space-x-3 py-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wraith-accent to-wraith-hover flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">wraith.life</h1>
              <p className="text-xs text-white/50">BioLink Platform</p>
            </div>
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* User Profile Summary */}
          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 border-2 border-wraith-accent/30">
                <AvatarImage src={userProfile?.avatarUrl} />
                <AvatarFallback className="bg-wraith-accent/20 text-white">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium text-white">{currentUser?.username}</h3>
                <div className="flex items-center space-x-1 text-xs text-white/70 mt-0.5">
                  <Eye size={12} />
                  <span>{userProfile?.views || 0} profile views</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 bg-white/5 border border-white/10 text-white hover:bg-white/10"
              asChild
            >
              <a 
                href={`/${currentUser?.username}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} className="mr-2" />
                Visit your biolink
              </a>
            </Button>
          </div>

          {/* Navigation */}
          <div className="space-y-1.5">
            <h3 className="text-xs uppercase text-white/40 font-semibold tracking-wider px-3 mb-2">Main Menu</h3>
            <NavLink
              to="/dashboard/links"
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all
                ${isActive ? 'bg-wraith-accent/20 text-wraith-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}
              `}
            >
              <LinkIcon size={18} />
              <span>Links</span>
            </NavLink>
            <NavLink
              to="/dashboard/appearance"
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all
                ${isActive ? 'bg-wraith-accent/20 text-wraith-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}
              `}
            >
              <Palette size={18} />
              <span>Appearance</span>
            </NavLink>
            <NavLink
              to="/dashboard/audio"
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all
                ${isActive ? 'bg-wraith-accent/20 text-wraith-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}
              `}
            >
              <Music size={18} />
              <span>Audio</span>
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all
                ${isActive ? 'bg-wraith-accent/20 text-wraith-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}
              `}
            >
              <SettingsIcon size={18} />
              <span>Settings</span>
            </NavLink>
          </div>

          <div className="mt-auto pt-6">
            {/* Developer Portal Link */}
            {isDeveloper && (
              <Button
                variant="outline"
                className="w-full mb-4 bg-white/5 border border-white/10 text-white hover:bg-white/10"
                onClick={() => navigate('/developer')}
              >
                <Shield size={16} className="mr-2" />
                Developer Portal
              </Button>
            )}

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-white/5"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-0 transition-all duration-300">
        {/* Overlay for Mobile */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Header */}
        <div className="md:hidden bg-black/40 backdrop-blur-lg p-4 sticky top-0 z-10 flex items-center justify-between border-b border-white/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:bg-white/10"
          >
            <ChevronRight />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-wraith-accent to-wraith-hover flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <h1 className="font-bold text-white">wraith.life</h1>
          </div>
          
          <a 
            href={`/${currentUser?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors"
          >
            <ExternalLink size={20} />
          </a>
        </div>

        {/* Page Content */}
        <div className="p-5 md:p-6 lg:p-8 bg-background min-h-[calc(100vh-64px)] md:min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
