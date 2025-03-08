import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface Link {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
  platform?: string;
  icon?: string;
  imageUrl?: string;
}

interface Badge {
  id: string;
  name: string;
  imageUrl: string;
}

interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundColor: string;
  backgroundGradient: string;
  backgroundImageUrl: string;
  backgroundVideoUrl: string;
  backgroundEffect: 'none' | 'rain' | 'snow' | 'night' | 'stars' | 'particles' | 'confetti' | 'matrix' | 'fireflies';
  cardOpacity: number;
  cardColor: string;
  soundEnabled: boolean;
  soundUrl: string;
  songTitle?: string;
  songArtist?: string;
  songCoverUrl?: string;
  links: Link[];
  badges: string[];
  customBadges: Badge[];
  customBadgeUrl?: string;
  customBadgeName?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    spotify?: string;
    discord?: string;
    facebook?: string;
    github?: string;
    linkedin?: string;
    twitch?: string;
    reddit?: string;
    snapchat?: string;
    pinterest?: string;
    medium?: string;
    patreon?: string;
    behance?: string;
    dribbble?: string;
    mastodon?: string;
    vimeo?: string;
    substack?: string;
  };
  fontStyle: 'default' | 'elegant' | 'playful' | 'bold';
  theme: 'dark' | 'light';
  views: number;
  viewedDevices: string[];
  usernameEffect: 'none' | 'glow' | 'rainbow' | 'shake' | 'shadow' | 'neon' | 'typewriter' | 'bounce' | 'sparkle' | 'blur' | 'flip' | 'color-cycle';
}

interface ProfileContextType {
  userProfile: Profile | null;
  loading: boolean;
  getProfileByUsername: (username: string) => Profile | null;
  updateProfile: (profile: Partial<Profile>) => void;
  addLink: (link: Omit<Link, 'id'>) => void;
  updateLink: (id: string, link: Partial<Link>) => void;
  removeLink: (id: string) => void;
  incrementViews: (username: string) => void;
  allProfiles: Profile[];
  getDefaultProfile: () => Profile;
  addBadgeToUser: (userId: string, badge: string) => void;
  removeBadgeFromUser: (userId: string, badge: string) => void;
  uploadFile: (file: File, type: 'image' | 'audio' | 'video' | 'link-image') => Promise<string>;
  addSocialLink: (platform: string, username: string) => void;
  addCustomBadge: (name: string, imageUrl: string) => void;
  updateCustomBadge: (id: string, name: string, imageUrl: string) => void;
  removeCustomBadge: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const PROFILES_STORAGE_KEY = 'wraith_profiles';
const PROFILE_MEDIA_PREFIX = 'wraith_media_';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const getDefaultProfile = (): Profile => ({
    id: `profile-${Date.now()}`,
    username: currentUser?.username || 'user',
    displayName: currentUser?.username || 'User',
    bio: 'Welcome to my profile!',
    avatarUrl: '',
    backgroundType: 'gradient',
    backgroundColor: '#1a1a1a',
    backgroundGradient: 'linear-gradient(to bottom right, #1a1a1a, #2d1f3f)',
    backgroundImageUrl: '',
    backgroundVideoUrl: '',
    backgroundEffect: 'none',
    cardOpacity: 0.7,
    cardColor: '#000000',
    soundEnabled: false,
    soundUrl: '',
    songTitle: '',
    songArtist: '',
    songCoverUrl: '',
    links: [],
    badges: currentUser?.badges || [],
    customBadges: [],
    customBadgeUrl: '',
    customBadgeName: '',
    socialLinks: {},
    fontStyle: 'default',
    theme: 'dark',
    views: 0,
    viewedDevices: [],
    usernameEffect: 'none'
  });

  const loadProfiles = () => {
    try {
      const savedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
      return savedProfiles ? JSON.parse(savedProfiles) : [];
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  };

  const saveProfiles = (profiles: Profile[]) => {
    try {
      // First, clear any unused media data
      clearOldMediaData();
      
      // Create a deep copy of profiles to avoid modifying the state directly
      const optimizedProfiles = JSON.parse(JSON.stringify(profiles));
      
      // Process each profile one by one to optimize media storage
      for (const profile of optimizedProfiles) {
        // Handle background image
        if (profile.backgroundImageUrl && profile.backgroundImageUrl.length > 1000 && !profile.backgroundImageUrl.startsWith('storage:')) {
          try {
            const key = `${PROFILE_MEDIA_PREFIX}${profile.id}_bg_img`;
            localStorage.setItem(key, profile.backgroundImageUrl);
            profile.backgroundImageUrl = `storage:${key}`;
          } catch (err) {
            console.error('Failed to store background image:', err);
          }
        }
        
        // Handle background video
        if (profile.backgroundVideoUrl && profile.backgroundVideoUrl.length > 1000 && !profile.backgroundVideoUrl.startsWith('storage:')) {
          try {
            const key = `${PROFILE_MEDIA_PREFIX}${profile.id}_bg_video`;
            localStorage.setItem(key, profile.backgroundVideoUrl);
            profile.backgroundVideoUrl = `storage:${key}`;
          } catch (err) {
            console.error('Failed to store background video:', err);
          }
        }
        
        // Handle audio
        if (profile.soundUrl && profile.soundUrl.length > 1000 && !profile.soundUrl.startsWith('storage:')) {
          try {
            const key = `${PROFILE_MEDIA_PREFIX}${profile.id}_sound`;
            localStorage.setItem(key, profile.soundUrl);
            profile.soundUrl = `storage:${key}`;
          } catch (err) {
            console.error('Failed to store sound:', err);
          }
        }
        
        // Handle avatar
        if (profile.avatarUrl && profile.avatarUrl.length > 1000 && !profile.avatarUrl.startsWith('storage:')) {
          try {
            const key = `${PROFILE_MEDIA_PREFIX}${profile.id}_avatar`;
            localStorage.setItem(key, profile.avatarUrl);
            profile.avatarUrl = `storage:${key}`;
          } catch (err) {
            console.error('Failed to store avatar:', err);
          }
        }
        
        // Handle custom badge
        if (profile.customBadgeUrl && profile.customBadgeUrl.length > 1000 && !profile.customBadgeUrl.startsWith('storage:')) {
          try {
            const key = `${PROFILE_MEDIA_PREFIX}${profile.id}_badge`;
            localStorage.setItem(key, profile.customBadgeUrl);
            profile.customBadgeUrl = `storage:${key}`;
          } catch (err) {
            console.error('Failed to store custom badge:', err);
          }
        }
        
        // Handle song cover
        if (profile.songCoverUrl && profile.songCoverUrl.length > 1000 && !profile.songCoverUrl.startsWith('storage:')) {
          try {
            const key = `${PROFILE_MEDIA_PREFIX}${profile.id}_song_cover`;
            localStorage.setItem(key, profile.songCoverUrl);
            profile.songCoverUrl = `storage:${key}`;
          } catch (err) {
            console.error('Failed to store song cover:', err);
          }
        }
        
        // Handle links with images
        if (profile.links && profile.links.length > 0) {
          for (let i = 0; i < profile.links.length; i++) {
            const link = profile.links[i];
            if (link.imageUrl && link.imageUrl.length > 1000 && !link.imageUrl.startsWith('storage:')) {
              try {
                const linkImageKey = `${PROFILE_MEDIA_PREFIX}${profile.id}_link_${link.id}_img`;
                localStorage.setItem(linkImageKey, link.imageUrl);
                profile.links[i] = { ...link, imageUrl: `storage:${linkImageKey}` };
              } catch (err) {
                console.error('Failed to store link image:', err);
              }
            }
          }
        }
      }
      
      // Save the optimized profiles
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(optimizedProfiles));
    } catch (error) {
      console.error('Failed to save profiles to localStorage:', error);
      toast.error('Failed to save profile changes. Storage limit reached.');
      
      clearOldCacheData();
    }
  };

  const clearOldCacheData = () => {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PROFILE_MEDIA_PREFIX) && key.includes('_old_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      toast.success('Cleared old cache data to free up space');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };
  
  const clearOldMediaData = () => {
    try {
      const profiles = loadProfiles();
      const usedKeys = new Set<string>();
      
      profiles.forEach(profile => {
        if (profile.backgroundImageUrl?.startsWith('storage:')) {
          usedKeys.add(profile.backgroundImageUrl.replace('storage:', ''));
        }
        if (profile.backgroundVideoUrl?.startsWith('storage:')) {
          usedKeys.add(profile.backgroundVideoUrl.replace('storage:', ''));
        }
        if (profile.soundUrl?.startsWith('storage:')) {
          usedKeys.add(profile.soundUrl.replace('storage:', ''));
        }
        if (profile.avatarUrl?.startsWith('storage:')) {
          usedKeys.add(profile.avatarUrl.replace('storage:', ''));
        }
        if (profile.customBadgeUrl?.startsWith('storage:')) {
          usedKeys.add(profile.customBadgeUrl.replace('storage:', ''));
        }
        if (profile.songCoverUrl?.startsWith('storage:')) {
          usedKeys.add(profile.songCoverUrl.replace('storage:', ''));
        }
        
        profile.links?.forEach(link => {
          if (link.imageUrl?.startsWith('storage:')) {
            usedKeys.add(link.imageUrl.replace('storage:', ''));
          }
        });
      });
      
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PROFILE_MEDIA_PREFIX) && !usedKeys.has(key)) {
          keysToRemove.push(key);
        }
      }
      
      if (keysToRemove.length > 0) {
        console.log(`Cleaning up ${keysToRemove.length} unused media items`);
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Error clearing media data:', error);
    }
  };

  const restoreMediaUrls = (profile: Profile): Profile => {
    try {
      const restored = { ...profile };
      
      // Process each media field to restore from localStorage if it's a storage reference
      if (restored.backgroundImageUrl && restored.backgroundImageUrl.startsWith('storage:')) {
        const key = restored.backgroundImageUrl.replace('storage:', '');
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          restored.backgroundImageUrl = storedValue;
        }
      }
      
      if (restored.backgroundVideoUrl && restored.backgroundVideoUrl.startsWith('storage:')) {
        const key = restored.backgroundVideoUrl.replace('storage:', '');
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          restored.backgroundVideoUrl = storedValue;
        }
      }
      
      if (restored.soundUrl && restored.soundUrl.startsWith('storage:')) {
        const key = restored.soundUrl.replace('storage:', '');
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          restored.soundUrl = storedValue;
        }
      }
      
      if (restored.avatarUrl && restored.avatarUrl.startsWith('storage:')) {
        const key = restored.avatarUrl.replace('storage:', '');
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          restored.avatarUrl = storedValue;
        }
      }
      
      if (restored.customBadgeUrl && restored.customBadgeUrl.startsWith('storage:')) {
        const key = restored.customBadgeUrl.replace('storage:', '');
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          restored.customBadgeUrl = storedValue;
        }
      }
      
      if (restored.songCoverUrl && restored.songCoverUrl.startsWith('storage:')) {
        const key = restored.songCoverUrl.replace('storage:', '');
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          restored.songCoverUrl = storedValue;
        }
      }
      
      if (restored.links && restored.links.length > 0) {
        restored.links = restored.links.map(link => {
          if (link.imageUrl && link.imageUrl.startsWith('storage:')) {
            const key = link.imageUrl.replace('storage:', '');
            const storedValue = localStorage.getItem(key);
            if (storedValue) {
              return { ...link, imageUrl: storedValue };
            }
          }
          return link;
        });
      }
      
      return restored;
    } catch (error) {
      console.error('Error restoring media URLs:', error);
      return profile;
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      const profiles = loadProfiles();
      setAllProfiles(profiles);
      
      let profile = profiles.find((p: Profile) => p.username === currentUser.username);
      
      if (!profile) {
        profile = getDefaultProfile();
        profiles.push(profile);
        saveProfiles(profiles);
      }
      
      if (!profile.customBadges) {
        profile.customBadges = [];
      }
      
      if (!profile.socialLinks) {
        profile.socialLinks = {};
      }
      
      profile = restoreMediaUrls(profile);
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error initializing profile:', error);
      toast.error('Error loading your profile');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const getProfileByUsername = (username: string): Profile | null => {
    try {
      console.log('Looking for profile with username:', username);
      
      const profiles = loadProfiles();
      console.log('All profiles:', profiles.map(p => p.username));
      
      const profile = profiles.find((p: Profile) => p.username === username);
      
      if (profile) {
        console.log('Found profile:', profile.username);
        return restoreMediaUrls(profile);
      }
      
      console.log('Profile not found for username:', username);
      return null;
    } catch (error) {
      console.error('Error in getProfileByUsername:', error);
      return null;
    }
  };

  const updateProfile = (updatedData: Partial<Profile>) => {
    if (!userProfile) return;

    const profiles = loadProfiles();
    const index = profiles.findIndex((p: Profile) => p.id === userProfile.id);
    
    if (index !== -1) {
      const updatedProfile = { ...profiles[index], ...updatedData };
      
      // Create a deep copy to avoid reference issues
      const updatedProfiles = [...profiles];
      updatedProfiles[index] = updatedProfile;
      
      saveProfiles(updatedProfiles);
      
      // Also update the restored version in state
      const restoredProfile = restoreMediaUrls(updatedProfile);
      setUserProfile(restoredProfile);
      
      // Update allProfiles with the optimized version
      setAllProfiles(updatedProfiles);
      toast.success('Profile updated successfully');
    }
  };

  const addLink = (link: Omit<Link, 'id'>) => {
    if (!userProfile) return;

    const newLink: Link = {
      ...link,
      id: `link-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    const updatedLinks = [...userProfile.links, newLink];
    updateProfile({ links: updatedLinks });
    toast.success('Link added successfully');
  };

  const updateLink = (id: string, linkData: Partial<Link>) => {
    if (!userProfile) return;

    const updatedLinks = userProfile.links.map(link => 
      link.id === id ? { ...link, ...linkData } : link
    );

    updateProfile({ links: updatedLinks });
    toast.success('Link updated successfully');
  };

  const removeLink = (id: string) => {
    if (!userProfile) return;

    const updatedLinks = userProfile.links.filter(link => link.id !== id);
    updateProfile({ links: updatedLinks });
    toast.success('Link removed successfully');
  };

  const getDeviceId = () => {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset()
    ].join('|');
    
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'device_' + Math.abs(hash).toString(36);
  };

  const incrementViews = (username: string) => {
    const deviceId = getDeviceId();
    const profiles = loadProfiles();
    const index = profiles.findIndex((p: Profile) => p.username === username);
    
    if (index !== -1) {
      if (!profiles[index].viewedDevices) {
        profiles[index].viewedDevices = [];
      }
      
      if (!profiles[index].viewedDevices.includes(deviceId)) {
        profiles[index].views += 1;
        profiles[index].viewedDevices.push(deviceId);
        saveProfiles(profiles);
        setAllProfiles(profiles);
        
        if (userProfile && userProfile.username === username) {
          setUserProfile({ 
            ...userProfile, 
            views: userProfile.views + 1,
            viewedDevices: [...(userProfile.viewedDevices || []), deviceId]
          });
        }
      }
    }
  };

  const addBadgeToUser = (userId: string, badge: string) => {
    const profiles = loadProfiles();
    const targetProfile = profiles.find((p: Profile) => p.id === userId);
    
    if (targetProfile) {
      if (!targetProfile.badges.includes(badge)) {
        targetProfile.badges.push(badge);
        saveProfiles(profiles);
        setAllProfiles(profiles);
        
        if (userProfile && userProfile.id === userId) {
          setUserProfile({ ...userProfile, badges: [...userProfile.badges, badge] });
        }
        
        toast.success(`Badge added to user successfully`);
      } else {
        toast.error('User already has this badge');
      }
    } else {
      toast.error('User not found');
    }
  };

  const removeBadgeFromUser = (userId: string, badge: string) => {
    const profiles = loadProfiles();
    const targetProfile = profiles.find((p: Profile) => p.id === userId);
    
    if (targetProfile) {
      targetProfile.badges = targetProfile.badges.filter(b => b !== badge);
      saveProfiles(profiles);
      setAllProfiles(profiles);
      
      if (userProfile && userProfile.id === userId) {
        setUserProfile({ 
          ...userProfile, 
          badges: userProfile.badges.filter(b => b !== badge) 
        });
      }
      
      toast.success(`Badge removed from user successfully`);
    } else {
      toast.error('User not found');
    }
  };

  const uploadFile = async (file: File, type: 'image' | 'audio' | 'video' | 'link-image'): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        if (type === 'video' && file.size > 30 * 1024 * 1024) {
          toast.error('Video file is too large (max 30MB)');
          reject(new Error('File too large'));
          return;
        }
        
        if (type === 'audio' && file.size > 10 * 1024 * 1024) {
          toast.error('Audio file is too large (max 10MB)');
          reject(new Error('File too large'));
          return;
        }
        
        if ((type === 'image' || type === 'link-image') && file.size > 5 * 1024 * 1024) {
          toast.error('Image file is too large (max 5MB)');
          reject(new Error('File too large'));
          return;
        }

        clearOldMediaData();

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result.toString());
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => {
          console.error('FileReader error:', reader.error);
          reject(reader.error);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('File upload error:', error);
        toast.error('Failed to upload file');
        reject(error);
      }
    });
  };

  const addSocialLink = (platform: string, username: string) => {
    if (!userProfile) return;
    
    let url = '';
    let title = '';
    
    switch (platform) {
      case 'instagram':
        url = `https://instagram.com/${username}`;
        title = 'Instagram';
        break;
      case 'discord':
        url = `https://discord.com/users/${username}`;
        title = 'Discord';
        break;
      case 'twitter':
        url = `https://twitter.com/${username}`;
        title = 'Twitter';
        break;
      case 'tiktok':
        url = `https://tiktok.com/@${username}`;
        title = 'TikTok';
        break;
      case 'youtube':
        url = `https://youtube.com/${username}`;
        title = 'YouTube';
        break;
      case 'spotify':
        url = `https://open.spotify.com/user/${username}`;
        title = 'Spotify';
        break;
      case 'facebook':
        url = `https://facebook.com/${username}`;
        title = 'Facebook';
        break;
      case 'github':
        url = `https://github.com/${username}`;
        title = 'GitHub';
        break;
      case 'linkedin':
        url = `https://linkedin.com/in/${username}`;
        title = 'LinkedIn';
        break;
      case 'twitch':
        url = `https://twitch.tv/${username}`;
        title = 'Twitch';
        break;
      case 'reddit':
        url = `https://reddit.com/user/${username}`;
        title = 'Reddit';
        break;
      case 'snapchat':
        url = `https://snapchat.com/add/${username}`;
        title = 'Snapchat';
        break;
      case 'pinterest':
        url = `https://pinterest.com/${username}`;
        title = 'Pinterest';
        break;
      case 'medium':
        url = `https://medium.com/${username}`;
        title = 'Medium';
        break;
      case 'patreon':
        url = `https://patreon.com/${username}`;
        title = 'Patreon';
        break;
      case 'behance':
        url = `https://behance.net/${username}`;
        title = 'Behance';
        break;
      case 'dribbble':
        url = `https://dribbble.com/${username}`;
        title = 'Dribbble';
        break;
      case 'mastodon':
        url = `https://mastodon.social/@${username}`;
        title = 'Mastodon';
        break;
      case 'vimeo':
        url = `https://vimeo.com/${username}`;
        title = 'Vimeo';
        break;
      case 'substack':
        url = `https://${username}.substack.com`;
        title = 'Substack';
        break;
      default:
        break;
    }
    
    if (url && title) {
      const newLink: Link = {
        id: `link-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title,
        url,
        enabled: true,
        platform
      };
      
      const updatedLinks = [...userProfile.links, newLink];
      updateProfile({ links: updatedLinks });
      toast.success(`${title} link added successfully`);
    }
  };

  const addCustomBadge = (name: string, imageUrl: string) => {
    if (!userProfile) return;
    
    const newBadge: Badge = {
      id: `badge-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      imageUrl
    };
    
    const updatedBadges = [...(userProfile.customBadges || []), newBadge];
    updateProfile({ customBadges: updatedBadges });
    toast.success('Custom badge added successfully');
  };
  
  const updateCustomBadge = (id: string, name: string, imageUrl: string) => {
    if (!userProfile || !userProfile.customBadges) return;
    
    const updatedBadges = userProfile.customBadges.map(badge => 
      badge.id === id ? { ...badge, name, imageUrl } : badge
    );
    
    updateProfile({ customBadges: updatedBadges });
    toast.success('Custom badge updated successfully');
  };
  
  const removeCustomBadge = (id: string) => {
    if (!userProfile || !userProfile.customBadges) return;
    
    const updatedBadges = userProfile.customBadges.filter(badge => badge.id !== id);
    updateProfile({ customBadges: updatedBadges });
    toast.success('Custom badge removed successfully');
  };

  const value = {
    userProfile,
    loading,
    getProfileByUsername,
    updateProfile,
    addLink,
    updateLink,
    removeLink,
    incrementViews,
    allProfiles,
    getDefaultProfile,
    addBadgeToUser,
    removeBadgeFromUser,
    uploadFile,
    addSocialLink,
    addCustomBadge,
    updateCustomBadge,
    removeCustomBadge,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
