
import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Volume2, VolumeX, Eye, Music, Instagram, Twitter, Youtube, Facebook, MessageCircle, Disc, Github, Linkedin, Twitch, X, Tv2, Star, AtSign, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import BackgroundEffects from '@/components/BackgroundEffects';

interface BioLinkProps {
  profile: any;
  preview?: boolean;
  audioRef?: React.RefObject<HTMLAudioElement>;
  isPlaying?: boolean;
  toggleAudio?: () => void;
}

const BioLink: React.FC<BioLinkProps> = ({ 
  profile, 
  preview = false, 
  audioRef,
  isPlaying = false,
  toggleAudio
}) => {
  const [entered, setEntered] = useState(false);
  const [tiltPosition, setTiltPosition] = useState({ x: 0, y: 0 });
  const [tiltStrength, setTiltStrength] = useState(1);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Create username effect class
  const usernameClass = () => {
    switch (profile.usernameEffect) {
      case 'glow':
        return 'text-glow animate-pulse-soft';
      case 'rainbow':
        return 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse-soft';
      case 'shake':
        return 'hover:animate-[wiggle_1s_ease-in-out_infinite]';
      case 'shadow':
        return 'text-shadow-lg';
      case 'neon':
        return 'text-[#f72585] text-shadow-neon';
      case 'typewriter':
        return 'typewriter';
      case 'bounce':
        return 'animate-bounce';
      case 'sparkle':
        return 'sparkle-text';
      case 'blur':
        return 'hover:blur-sm transition-all duration-300';
      case 'flip':
        return 'hover:rotate-y-180 transition-all duration-500';
      case 'color-cycle':
        return 'text-animate-color';
      default:
        return '';
    }
  };

  // Background rendering based on type
  const renderBackground = () => {
    if (profile.backgroundType === 'video' && profile.backgroundVideoUrl) {
      return (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video 
            src={profile.backgroundVideoUrl}
            className="absolute min-w-full min-h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          {profile.backgroundEffect !== 'none' && (
            <BackgroundEffects effect={profile.backgroundEffect} />
          )}
        </div>
      );
    } else {
      return (
        <div 
          className="absolute inset-0 w-full h-full z-0"
          style={backgroundStyle()}
        >
          {profile.backgroundEffect !== 'none' && (
            <BackgroundEffects effect={profile.backgroundEffect} />
          )}
        </div>
      );
    }
  };

  // Default background if none is set
  const backgroundStyle = () => {
    if (profile.backgroundType === 'image' && profile.backgroundImageUrl) {
      return {
        backgroundImage: `url(${profile.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    } else if (profile.backgroundType === 'gradient') {
      return {
        background: profile.backgroundGradient || 'linear-gradient(to bottom right, #1a1a1a, #2d1f3f)'
      };
    } else {
      return {
        backgroundColor: profile.backgroundColor || '#1a1a1a'
      };
    }
  };

  // Format the UID to show account number
  const formatUID = () => {
    if (!profile.id) return '0000';
    
    // Extract the numeric part from the end of the ID
    const numericPart = profile.id.replace(/^profile-/, '');
    const timestamp = parseInt(numericPart, 10);
    
    // If it's a timestamp-based ID, use it to calculate a sequential number
    if (!isNaN(timestamp)) {
      // This is a rough approximation - assuming first user created around 2023-01-01
      const baseTime = new Date('2023-01-01').getTime();
      const userNumber = Math.floor((timestamp - baseTime) / (1000 * 60 * 60)) + 1; // Rough sequential numbering
      return `#${userNumber.toString().padStart(4, '0')}`;
    }
    
    // Fallback to the last 4 characters of the ID
    return `#${profile.id.slice(-4)}`;
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram size={16} className="text-[#E1306C]" />;
      case 'twitter': return <Twitter size={16} className="text-[#1DA1F2]" />;
      case 'youtube': return <Youtube size={16} className="text-[#FF0000]" />;
      case 'facebook': return <Facebook size={16} className="text-[#4267B2]" />;
      case 'discord': return <MessageCircle size={16} className="text-[#5865F2]" />;
      case 'spotify': return <Disc size={16} className="text-[#1DB954]" />;
      case 'tiktok': return <span className="text-xs font-bold">TT</span>;
      case 'github': return <Github size={16} className="text-white" />;
      case 'linkedin': return <Linkedin size={16} className="text-[#0077B5]" />;
      case 'twitch': return <Twitch size={16} className="text-[#9146FF]" />;
      case 'reddit': return <span className="text-xs font-bold text-[#FF4500]">r/</span>;
      case 'snapchat': return <span className="text-xs font-bold text-[#FFFC00]">👻</span>;
      case 'pinterest': return <span className="text-xs font-bold text-[#E60023]">P</span>;
      case 'medium': return <span className="text-xs font-bold text-white">M</span>;
      case 'patreon': return <span className="text-xs font-bold text-[#F96854]">P</span>;
      case 'behance': return <span className="text-xs font-bold text-[#1769FF]">Be</span>;
      case 'dribbble': return <span className="text-xs font-bold text-[#EA4C89]">Dr</span>;
      case 'mastodon': return <span className="text-xs font-bold text-[#6364FF]">M</span>;
      case 'vimeo': return <span className="text-xs font-bold text-[#1AB7EA]">Vi</span>;
      case 'substack': return <AtSign size={16} className="text-[#FF6719]" />;
      default: return <ExternalLink size={16} />;
    }
  };

  // Handle mouse movement for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !entered) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (values from -1 to 1)
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    // Set tilt position (inverted for natural feel)
    setTiltPosition({ x: -y * 10 * tiltStrength, y: x * 10 * tiltStrength });
    
    // Update glow position to follow cursor
    setGlowPosition({ 
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
    
    // Add subtle fluctuation to tilt strength for more organic feel
    setTiltStrength(0.8 + Math.random() * 0.4);
    
    // Add glint effect on card edges when tilted
    const edges = document.querySelectorAll('.card-edge');
    edges.forEach((edge: Element) => {
      const edgeEl = edge as HTMLElement;
      // Calculate position-based opacity for glint
      const distance = Math.sqrt(x * x + y * y);
      edgeEl.style.opacity = (distance * 0.7).toString();
    });
  };

  // Reset tilt when mouse leaves
  const handleMouseLeave = () => {
    // Smoothly animate back to center
    const resetTilt = () => {
      setTiltPosition(prev => {
        const newX = prev.x * 0.9;
        const newY = prev.y * 0.9;
        
        if (Math.abs(newX) < 0.1 && Math.abs(newY) < 0.1) {
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          return { x: 0, y: 0 };
        }
        
        timeoutRef.current = window.setTimeout(resetTilt, 16);
        return { x: newX, y: newY };
      });
    };
    
    resetTilt();
    
    // Reset glint effect
    const edges = document.querySelectorAll('.card-edge');
    edges.forEach((edge: Element) => {
      const edgeEl = edge as HTMLElement;
      edgeEl.style.opacity = "0";
    });
    
    // Reset glow position
    setGlowPosition({ x: 50, y: 50 });
  };

  // Handle the enter button click
  const handleEnter = () => {
    setEntered(true);
    
    // Play audio if enabled
    if (profile.soundEnabled && profile.soundUrl && audioRef?.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio on enter:", error);
        // This error is expected on some browsers - don't show a toast here
      });
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Automatically simulate a hover effect when preview mode
  useEffect(() => {
    if (preview && cardRef.current) {
      const interval = setInterval(() => {
        const xTilt = (Math.sin(Date.now() / 2000) * 5); 
        const yTilt = (Math.cos(Date.now() / 2500) * 5);
        setTiltPosition({ x: xTilt, y: yTilt });
        
        const xGlow = 50 + Math.sin(Date.now() / 2000) * 30;
        const yGlow = 50 + Math.cos(Date.now() / 2500) * 30;
        setGlowPosition({ x: xGlow, y: yGlow });
        
        // Animate edges
        const edges = document.querySelectorAll('.card-edge');
        const distance = Math.sqrt(xTilt * xTilt + yTilt * yTilt) / 10;
        edges.forEach((edge: Element) => {
          const edgeEl = edge as HTMLElement;
          edgeEl.style.opacity = (distance * 0.7).toString();
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [preview]);

  const cardOpacity = profile.cardOpacity !== undefined ? profile.cardOpacity : 0.7;
  const cardColor = profile.cardColor || '#000000';

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-16 pb-16 px-4 relative">
      {renderBackground()}

      {/* Entrance Overlay - shown when not entered yet */}
      {!entered && !preview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-wraith-accent shadow-lg animate-pulse">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.displayName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-wraith-accent/30 to-wraith-accent/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {profile.displayName?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white">{profile.displayName}</h1>
            {profile.bio && (
              <p className="text-white/70 max-w-sm">{profile.bio}</p>
            )}
            
            <button 
              onClick={() => setEntered(true)}
              className="px-8 py-3 bg-wraith-accent hover:bg-wraith-hover rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Click to Enter
            </button>
          </div>
        </div>
      )}
      
      <div 
        ref={cardRef}
        className={`w-full max-w-md rounded-2xl overflow-hidden transition-all duration-300 ${entered || preview ? 'animate-fade-in' : 'opacity-0'} relative z-10`}
        style={{ 
          backgroundColor: `${cardColor}${Math.round(cardOpacity * 255).toString(16).padStart(2, '0')}`,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: entered || preview ? `perspective(1000px) rotateX(${tiltPosition.x}deg) rotateY(${tiltPosition.y}deg)` : 'none',
          transition: 'transform 0.1s ease-out',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(128, 0, 255, 0.1) inset' 
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic glow effect that follows cursor */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(128, 0, 255, 0.15) 0%, transparent 50%)`,
            mixBlendMode: 'screen'
          }}
        ></div>
        
        {/* Add subtle edge highlights for 3D effect */}
        <div className="card-edge absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300"></div>
        <div className="card-edge absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300"></div>
        <div className="card-edge absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300"></div>
        <div className="card-edge absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300"></div>
        
        {/* Header with UID and Views */}
        <div className="w-full flex justify-between px-4 pt-4">
          <div className="bg-black/50 backdrop-blur-md rounded-md px-3 py-1 text-xs">
            {formatUID()}
          </div>
          <div className="bg-black/50 backdrop-blur-md rounded-md px-3 py-1 text-xs flex items-center gap-1">
            <Eye size={12} /> VIEWS: {profile.views || 0}
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="flex justify-center mt-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-wraith-accent/30 shadow-lg animate-scale">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.displayName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-wraith-accent/30 to-wraith-accent/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profile.displayName?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Display Name & Bio */}
        <div className="text-center mt-4 px-6">
          <h1 className={cn("text-xl font-bold text-white flex items-center justify-center gap-2", usernameClass())}>
            {profile.displayName}
            {profile.customBadgeUrl && (
              <img 
                src={profile.customBadgeUrl} 
                alt={profile.customBadgeName || "Custom Badge"} 
                className="w-6 h-6 object-contain inline-block" 
                title={profile.customBadgeName || ""}
              />
            )}
          </h1>
          {profile.bio && (
            <p className="text-sm text-white/80 mt-2">{profile.bio}</p>
          )}
        </div>

        {/* Badges */}
        {profile.badges && profile.badges.length > 0 && (
          <div className="flex justify-center gap-2 mt-4 flex-wrap px-6">
            {profile.badges.map((badge: string, index: number) => (
              <Badge 
                key={index}
                className={`
                  ${badge === 'developer' ? 'bg-badges-purple text-white' : ''}
                  ${badge === 'verified' ? 'bg-badges-blue text-white' : ''}
                  ${badge === 'og' ? 'bg-badges-green text-white' : ''}
                  ${badge === 'vip' ? 'bg-badges-orange text-white' : ''}
                  ${badge === 'staff' ? 'bg-badges-pink text-white' : ''}
                  shadow-lg animate-fade-in
                `}
                title={`${badge.charAt(0).toUpperCase() + badge.slice(1)} Badge`}
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="px-6 mt-6 pb-6 space-y-3">
          {profile.links && profile.links.length > 0 ? (
            profile.links
              .filter((link: any) => link.enabled !== false)
              .map((link: any) => (
                <a
                  key={link.id}
                  href={!preview ? link.url : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between transition-all duration-200 hover:transform hover:scale-[1.02]"
                  onClick={preview ? (e) => e.preventDefault() : undefined}
                >
                  <div className="flex items-center gap-3">
                    {link.imageUrl ? (
                      <img 
                        src={link.imageUrl} 
                        alt={link.title} 
                        className="w-8 h-8 rounded-md object-cover" 
                      />
                    ) : (
                      link.platform ? getPlatformIcon(link.platform) : <ExternalLink size={16} />
                    )}
                    <span className="text-white">{link.title}</span>
                  </div>
                  <ExternalLink size={16} className="text-white/70" />
                </a>
              ))
          ) : (
            <div className="text-center py-4 text-sm text-white/50">
              {preview ? 'Your links will appear here' : 'No links yet'}
            </div>
          )}
        </div>
      </div>

      {/* Audio Widget */}
      {profile.soundEnabled && profile.soundUrl && (
        <div className={`mt-4 glass-card border-white/10 p-3 rounded-xl flex items-center gap-3 max-w-md w-full relative z-10 ${entered || preview ? 'animate-fade-in' : 'opacity-0'}`}>
          {profile.songCoverUrl ? (
            <img 
              src={profile.songCoverUrl} 
              alt="Song Cover" 
              className="w-12 h-12 rounded-md object-cover animate-pulse-slow"
            />
          ) : (
            <div className="w-12 h-12 rounded-md bg-black/30 flex items-center justify-center animate-pulse-slow">
              <Music size={20} className="text-white/70" />
            </div>
          )}
          
          <div className="flex-1 overflow-hidden">
            <p className="text-white font-medium truncate">{profile.songTitle || "Background Music"}</p>
            <p className="text-white/60 text-xs truncate">{profile.songArtist || "Unknown Artist"}</p>
          </div>
          
          <button
            onClick={toggleAudio}
            className="bg-black/30 hover:bg-black/40 backdrop-blur-sm text-white px-3 py-2 rounded-full flex items-center gap-1 transition-all duration-200 border border-white/10"
          >
            {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      )}

      {profile.soundEnabled && profile.soundUrl && (
        <audio 
          ref={audioRef} 
          src={profile.soundUrl} 
          loop 
          className="hidden"
        />
      )}
      
      {/* Footer */}
      <div className={`mt-6 text-white/30 text-xs relative z-10 ${entered || preview ? 'animate-fade-in' : 'opacity-0'}`}>
        wraith.life
      </div>
    </div>
  );
};

export default BioLink;
