
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, loading } = useProfile();
  
  useEffect(() => {
    // Show welcome toast on initial dashboard load
    if (location.pathname === '/dashboard' && userProfile) {
      toast.success(`Welcome back, ${userProfile.displayName || userProfile.username}!`);
    }
    
    // Redirect to links page if user is at the dashboard root
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/links');
    }
  }, [location.pathname, navigate, userProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background/70">
      <DashboardLayout />
    </div>
  );
};

export default Dashboard;
