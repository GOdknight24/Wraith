
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import BioLink from '@/components/BioLink';
import { toast } from 'sonner';

const BiolinkPage = () => {
  const { username } = useParams<{ username: string }>();
  const { getProfileByUsername, incrementViews } = useProfile();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const viewCounted = useRef(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return;
      
      try {
        console.log('Fetching profile for username:', username);
        const fetchedProfile = getProfileByUsername(username);
        console.log('Fetched profile:', fetchedProfile);
        
        if (fetchedProfile) {
          setProfile(fetchedProfile);
          
          // Count view only once per session
          if (!viewCounted.current) {
            incrementViews(username);
            viewCounted.current = true;
          }
        } else {
          console.error('Profile not found for username:', username);
          setNotFound(true);
          toast.error(`Profile for username "${username}" not found`);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setNotFound(true);
        toast.error('Error loading profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, getProfileByUsername, incrementViews]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Could not play audio. Please try again.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Audio state change handler
  const handleAudioStateChange = () => {
    if (audioRef.current) {
      setIsPlaying(!audioRef.current.paused);
    }
  };

  // Handle audio events
  useEffect(() => {
    if (profile?.soundEnabled && profile?.soundUrl && audioRef.current) {
      audioRef.current.addEventListener('play', handleAudioStateChange);
      audioRef.current.addEventListener('pause', handleAudioStateChange);
      audioRef.current.addEventListener('ended', handleAudioStateChange);
      audioRef.current.addEventListener('error', () => {
        setIsPlaying(false);
        toast.error("Audio error occurred. Please try again.");
      });
    }
    
    return () => {
      // Clean up audio when component unmounts
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handleAudioStateChange);
        audioRef.current.removeEventListener('pause', handleAudioStateChange);
        audioRef.current.removeEventListener('ended', handleAudioStateChange);
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900">
        <div className="glass-card p-8 animate-pulse-soft text-center">
          <div className="w-16 h-16 rounded-full bg-wraith-accent/20 animate-pulse mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-white/70 mb-6">The profile "{username}" does not exist or has been removed.</p>
          <Link 
            to="/" 
            className="inline-block bg-wraith-accent hover:bg-wraith-hover text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <BioLink 
      profile={profile} 
      audioRef={audioRef}
      isPlaying={isPlaying}
      toggleAudio={toggleAudio}
    />
  );
};

export default BiolinkPage;
