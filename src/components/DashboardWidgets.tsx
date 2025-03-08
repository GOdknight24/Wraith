
import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Link as LinkIcon, 
  ExternalLink, 
  Eye, 
  Clock, 
  ChevronRight, 
  BarChart 
} from 'lucide-react';

export const StatsWidget = () => {
  const { userProfile } = useProfile();
  const { currentUser } = useAuth();
  
  const stats = [
    {
      name: 'Profile Views',
      value: userProfile?.views || 0,
      icon: <Eye size={18} className="text-wraith-accent" />,
      change: '+12%',
      trend: 'up'
    },
    {
      name: 'Active Links',
      value: userProfile?.links?.filter(link => link.enabled !== false).length || 0,
      icon: <LinkIcon size={18} className="text-wraith-accent" />,
      change: '0%',
      trend: 'neutral'
    },
    {
      name: 'Last Updated',
      value: 'Today',
      icon: <Clock size={18} className="text-wraith-accent" />,
      change: '',
      trend: 'neutral'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card border-white/10 p-4 hover-scale-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-black/30">
              {stat.icon}
            </div>
            {stat.trend === 'up' && (
              <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                <TrendingUp size={12} className="mr-1" /> {stat.change}
              </Badge>
            )}
          </div>
          <div className="mt-2">
            <p className="text-white/60 text-sm">{stat.name}</p>
            <p className="text-white text-2xl font-bold">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const QuickActionsWidget = () => {
  const { currentUser } = useAuth();
  
  return (
    <Card className="glass-card border-white/10 p-5">
      <h3 className="text-white font-medium mb-3 flex items-center">
        <ChevronRight size={16} className="mr-1 text-wraith-accent" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          className="bg-black/20 border border-white/10 hover:bg-white/5 text-white justify-start" 
          asChild
        >
          <a href="/dashboard/links">
            <LinkIcon size={16} className="mr-2 text-wraith-accent" />
            Add New Link
          </a>
        </Button>
        <Button 
          className="bg-black/20 border border-white/10 hover:bg-white/5 text-white justify-start" 
          asChild
        >
          <a href="/dashboard/appearance">
            <BarChart size={16} className="mr-2 text-wraith-accent" />
            Customize Theme
          </a>
        </Button>
        <Button 
          className="bg-black/20 border border-white/10 hover:bg-white/5 text-white justify-start" 
          asChild
        >
          <a href={`/${currentUser?.username}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} className="mr-2 text-wraith-accent" />
            Visit Profile
          </a>
        </Button>
      </div>
    </Card>
  );
};

export const RecentActivityWidget = () => {
  const activities = [
    { 
      action: 'Profile viewed', 
      time: '2 minutes ago', 
      icon: <Eye size={14} className="text-wraith-accent" />
    },
    { 
      action: 'Added new link', 
      time: '1 hour ago', 
      icon: <LinkIcon size={14} className="text-wraith-accent" />
    },
    { 
      action: 'Updated theme', 
      time: '3 hours ago', 
      icon: <BarChart size={14} className="text-wraith-accent" />
    }
  ];
  
  return (
    <Card className="glass-card border-white/10 p-5">
      <h3 className="text-white font-medium mb-3 flex items-center">
        <ChevronRight size={16} className="mr-1 text-wraith-accent" />
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
            <div className="flex items-center">
              <div className="p-1.5 rounded-full bg-wraith-accent/10 mr-2">
                {activity.icon}
              </div>
              <span className="text-white text-sm">{activity.action}</span>
            </div>
            <span className="text-white/50 text-xs">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
