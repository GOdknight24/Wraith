import React, { useState, useRef } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Image, 
  Palette, 
  Brush, 
  Type, 
  Upload,
  Video,
  Music,
  VolumeX,
  Volume2,
  Badge
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import BioLink from "@/components/BioLink";

const gradientOptions = [
  { name: "Purple to Pink", value: "linear-gradient(to right, #8B5CF6, #EC4899)" },
  { name: "Blue to Cyan", value: "linear-gradient(to right, #1E40AF, #0EA5E9)" },
  { name: "Green to Yellow", value: "linear-gradient(to right, #10B981, #FBBF24)" },
  { name: "Orange to Red", value: "linear-gradient(to right, #F97316, #EF4444)" },
  { name: "Dark to Light Purple", value: "linear-gradient(to bottom right, #1a1a1a, #2d1f3f)" },
  { name: "Sunset", value: "linear-gradient(to top, #e6b980 0%, #eacda3 100%)" },
  { name: "Lavender", value: "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)" },
  { name: "Ocean", value: "linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)" },
  { name: "Forest", value: "linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)" },
  { name: "Candy", value: "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)" },
  { name: "Midnight", value: "linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)" },
  { name: "Citrus", value: "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)" },
];

const Appearance = () => {
  const { userProfile, updateProfile, uploadFile } = useProfile();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customGradient, setCustomGradient] = useState("");
  const [badgeName, setBadgeName] = useState("");

  if (!userProfile) return null;

  const {
    displayName,
    bio,
    backgroundType,
    backgroundColor,
    backgroundGradient,
    backgroundImageUrl,
    backgroundVideoUrl,
    avatarUrl,
    cardOpacity,
    cardColor,
    soundEnabled,
    soundUrl,
    usernameEffect,
    customBadgeUrl,
    customBadgeName,
    songTitle,
    songArtist,
    songCoverUrl
  } = userProfile;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'audio' | 'video', field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileType === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, etc.)');
      return;
    } else if (fileType === 'audio' && (!file.type.startsWith('audio/') && file.type !== "application/octet-stream")) {
      toast.error('Please upload an audio file (MP3, WAV, etc.)');
      return;
    } else if (fileType === 'video' && (!file.type.startsWith('video/') && file.type !== "application/octet-stream")) {
      toast.error('Please upload a video file (MP4, WEBM, etc.)');
      return;
    }

    const maxSizeMB = fileType === 'video' ? 30 : (fileType === 'audio' ? 10 : 5);
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    try {
      setIsUploading(true);
      const fileUrl = await uploadFile(file, fileType);
      
      const update: Record<string, any> = {};
      update[field] = fileUrl;
      
      if (field === 'customBadgeUrl' && badgeName) {
        update['customBadgeName'] = badgeName;
      }
      
      updateProfile(update);
      
      toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${fileType}`);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const applyGradient = (gradientValue: string) => {
    updateProfile({ backgroundGradient: gradientValue });
  };

  const applyCustomGradient = () => {
    if (customGradient) {
      updateProfile({ backgroundGradient: customGradient });
      toast.success('Custom gradient applied');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Profile Appearance</h2>
          
          <Tabs defaultValue="general">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
              <TabsTrigger value="background" className="flex-1">Background</TabsTrigger>
              <TabsTrigger value="uploads" className="flex-1">Media</TabsTrigger>
              <TabsTrigger value="effects" className="flex-1">Effects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Info</CardTitle>
                  <CardDescription>
                    Update your basic profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      placeholder="Display name"
                      value={displayName}
                      onChange={(e) => updateProfile({ displayName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      placeholder="Write a short bio"
                      value={bio}
                      onChange={(e) => updateProfile({ bio: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="background">
              <Card>
                <CardHeader>
                  <CardTitle>Background Settings</CardTitle>
                  <CardDescription>
                    Customize your profile background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backgroundType">Background Type</Label>
                    <Select
                      value={backgroundType}
                      onValueChange={(value) => updateProfile({ backgroundType: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select background type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="color">Solid Color</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundEffect">Background Effect</Label>
                    <Select
                      value={userProfile.backgroundEffect || 'none'}
                      onValueChange={(value) => updateProfile({ backgroundEffect: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select background effect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="rain">Rain</SelectItem>
                          <SelectItem value="snow">Snow</SelectItem>
                          <SelectItem value="night">Night Time</SelectItem>
                          <SelectItem value="stars">Stars</SelectItem>
                          <SelectItem value="particles">Particles</SelectItem>
                          <SelectItem value="confetti">Confetti</SelectItem>
                          <SelectItem value="matrix">Matrix</SelectItem>
                          <SelectItem value="fireflies">Fireflies</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {backgroundType === 'color' && (
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => updateProfile({ backgroundColor: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => updateProfile({ backgroundColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}

                  {backgroundType === 'gradient' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Predefined Gradients</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {gradientOptions.map((gradient, index) => (
                            <div 
                              key={index} 
                              className="h-16 rounded-md cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200"
                              style={{ background: gradient.value }}
                              onClick={() => applyGradient(gradient.value)}
                              title={gradient.name}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="backgroundGradient">Custom Gradient CSS</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="customGradient"
                            value={customGradient}
                            onChange={(e) => setCustomGradient(e.target.value)}
                            placeholder="linear-gradient(to right, #ff0000, #0000ff)"
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            onClick={applyCustomGradient}
                          >
                            Apply
                          </Button>
                        </div>
                        <div className="h-16 rounded-md mt-2" style={{ background: customGradient || backgroundGradient }}></div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="backgroundGradient">Current Gradient</Label>
                        <Input
                          id="backgroundGradient"
                          value={backgroundGradient}
                          onChange={(e) => updateProfile({ backgroundGradient: e.target.value })}
                          placeholder="linear-gradient(to right, #ff0000, #0000ff)"
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-4 border-t mt-4">
                    <Label htmlFor="cardColor">Card Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="cardColor"
                        type="color"
                        value={cardColor || '#000000'}
                        onChange={(e) => updateProfile({ cardColor: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={cardColor || '#000000'}
                        onChange={(e) => updateProfile({ cardColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Choose a base color for your profile card</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardOpacity">Card Opacity</Label>
                    <div className="flex space-x-4 items-center">
                      <Slider
                        id="cardOpacity"
                        min={0}
                        max={1}
                        step={0.05}
                        value={[cardOpacity]}
                        onValueChange={(values) => updateProfile({ cardOpacity: values[0] })}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">{Math.round(cardOpacity * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="uploads">
              <Card>
                <CardHeader>
                  <CardTitle>Media Uploads</CardTitle>
                  <CardDescription>
                    Upload images, videos, and audio for your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Profile Picture</Label>
                      {avatarUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateProfile({ avatarUrl: '' })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Image className="text-muted-foreground" size={24} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <Label htmlFor="avatarUpload" className="cursor-pointer">
                          <div className="flex items-center space-x-2 border rounded-md px-3 py-2 border-dashed border-muted-foreground">
                            <Upload size={16} />
                            <span>Upload avatar image</span>
                          </div>
                          <Input 
                            id="avatarUpload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'image', 'avatarUrl')}
                            disabled={isUploading}
                          />
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Custom Badge</Label>
                      {userProfile.customBadgeUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateProfile({ customBadgeUrl: '', customBadgeName: '' })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {userProfile.customBadgeUrl ? (
                          <img src={userProfile.customBadgeUrl} alt="Custom Badge" className="w-full h-full object-contain" />
                        ) : (
                          <Badge className="text-muted-foreground" size={20} />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Badge name (optional)"
                          value={badgeName || userProfile.customBadgeName || ''}
                          onChange={(e) => setBadgeName(e.target.value)}
                        />
                        
                        <Label htmlFor="badgeUpload" className="cursor-pointer">
                          <div className="flex items-center space-x-2 border rounded-md px-3 py-2 border-dashed border-muted-foreground">
                            <Upload size={16} />
                            <span>Upload custom badge</span>
                          </div>
                          <Input 
                            id="badgeUpload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'image', 'customBadgeUrl')}
                            disabled={isUploading}
                          />
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Small icon that appears next to your username</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Background Image</Label>
                      {backgroundImageUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateProfile({ backgroundImageUrl: '' })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {backgroundImageUrl ? (
                          <img src={backgroundImageUrl} alt="Background" className="w-full h-full object-cover" />
                        ) : (
                          <Image className="text-muted-foreground" size={24} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <Label htmlFor="backgroundUpload" className="cursor-pointer">
                          <div className="flex items-center space-x-2 border rounded-md px-3 py-2 border-dashed border-muted-foreground">
                            <Upload size={16} />
                            <span>Upload background image</span>
                          </div>
                          <Input 
                            id="backgroundUpload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'image', 'backgroundImageUrl')}
                            disabled={isUploading}
                          />
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-medium">Background Video</Label>
                      {backgroundVideoUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateProfile({ backgroundVideoUrl: '' })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {backgroundVideoUrl ? (
                          <Video className="text-primary" size={24} />
                        ) : (
                          <Video className="text-muted-foreground" size={24} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <Label htmlFor="videoUpload" className="cursor-pointer">
                          <div className="flex items-center space-x-2 border rounded-md px-3 py-2 border-dashed border-muted-foreground">
                            <Upload size={16} />
                            <span>Upload background video</span>
                          </div>
                          <Input 
                            id="videoUpload" 
                            type="file" 
                            className="hidden" 
                            accept="video/mp4,video/webm,video/ogg"
                            onChange={(e) => handleFileUpload(e, 'video', 'backgroundVideoUrl')}
                            disabled={isUploading}
                          />
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Supports MP4, WebM and Ogg formats (up to 30MB)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="soundEnabled" className="text-base font-medium">Background Audio</Label>
                        <Switch 
                          id="soundEnabled"
                          checked={soundEnabled}
                          onCheckedChange={(checked) => updateProfile({ soundEnabled: checked })}
                        />
                      </div>
                      
                      {soundUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateProfile({ soundUrl: '' })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    {soundEnabled && (
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={toggleAudio}
                          disabled={!soundUrl}
                        >
                          {isAudioPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </Button>
                        
                        <div className="flex-1">
                          <Label htmlFor="audioUpload" className="cursor-pointer">
                            <div className="flex items-center space-x-2 border rounded-md px-3 py-2 border-dashed border-muted-foreground">
                              <Upload size={16} />
                              <span>Upload audio file</span>
                            </div>
                            <Input 
                              id="audioUpload" 
                              type="file" 
                              className="hidden" 
                              accept="audio/*"
                              onChange={(e) => handleFileUpload(e, 'audio', 'soundUrl')}
                              disabled={isUploading}
                            />
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">Supports MP3, WAV and OGG formats (up to 10MB)</p>
                        </div>
                      </div>
                    )}
                    
                    {soundUrl && soundEnabled && (
                      <div className="space-y-2 border-t pt-4 mt-4">
                        <Label className="text-base font-medium">Audio Widget Info</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="songTitle">Song Title</Label>
                            <Input
                              id="songTitle"
                              placeholder="Enter song title"
                              value={userProfile.songTitle || ''}
                              onChange={(e) => updateProfile({ songTitle: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="songArtist">Artist Name</Label>
                            <Input
                              id="songArtist"
                              placeholder="Enter artist name"
                              value={userProfile.songArtist || ''}
                              onChange={(e) => updateProfile({ songArtist: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2 mt-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">Song Cover Image</Label>
                            {userProfile.songCoverUrl && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateProfile({ songCoverUrl: '' })}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                              {userProfile.songCoverUrl ? (
                                <img src={userProfile.songCoverUrl} alt="Song Cover" className="w-full h-full object-cover" />
                              ) : (
                                <Music className="text-muted-foreground" size={20} />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <Label htmlFor="songCoverUpload" className="cursor-pointer">
                                <div className="flex items-center space-x-2 border rounded-md px-3 py-2 border-dashed border-muted-foreground text-sm">
                                  <Upload size={14} />
                                  <span>Upload cover image</span>
                                </div>
                                <Input 
                                  id="songCoverUpload" 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, 'image', 'songCoverUrl')}
                                  disabled={isUploading}
                                />
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {soundUrl && (
                      <audio ref={audioRef} src={soundUrl} className="hidden" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="effects">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Effects</CardTitle>
                  <CardDescription>
                    Add special effects to your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="usernameEffect" className="text-base font-medium">Username Effect</Label>
                    <Select
                      value={usernameEffect}
                      onValueChange={(value) => updateProfile({ usernameEffect: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an effect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="glow">Glow</SelectItem>
                          <SelectItem value="rainbow">Rainbow</SelectItem>
                          <SelectItem value="shake">Shake on hover</SelectItem>
                          <SelectItem value="shadow">Shadow</SelectItem>
                          <SelectItem value="neon">Neon</SelectItem>
                          <SelectItem value="typewriter">Typewriter</SelectItem>
                          <SelectItem value="bounce">Bounce</SelectItem>
                          <SelectItem value="sparkle">Sparkle</SelectItem>
                          <SelectItem value="blur">Blur on hover</SelectItem>
                          <SelectItem value="flip">Flip on hover</SelectItem>
                          <SelectItem value="color-cycle">Color Cycle</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    
                    <div className="py-4 px-6 rounded-lg bg-black/20 backdrop-blur-sm">
                      <h3 className={`text-2xl font-bold text-center ${
                        usernameEffect === 'glow' ? 'text-glow animate-pulse-soft' :
                        usernameEffect === 'rainbow' ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse-soft' :
                        usernameEffect === 'shake' ? 'hover:animate-[wiggle_1s_ease-in-out_infinite]' :
                        usernameEffect === 'shadow' ? 'text-shadow-lg' :
                        usernameEffect === 'neon' ? 'text-[#f72585] text-shadow-neon' :
                        usernameEffect === 'typewriter' ? 'typewriter' :
                        usernameEffect === 'bounce' ? 'animate-bounce' :
                        usernameEffect === 'sparkle' ? 'sparkle-text' :
                        usernameEffect === 'blur' ? 'hover:blur-sm transition-all duration-300' :
                        usernameEffect === 'flip' ? 'hover:rotate-y-180 transition-all duration-500' :
                        usernameEffect === 'color-cycle' ? 'text-animate-color' : ''
                      }`}>
                        {displayName || 'Your Username'}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:sticky lg:top-20 h-max">
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
            <p className="text-sm text-muted-foreground">This is how your profile will look to visitors</p>
          </div>
          
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="h-[600px] overflow-auto">
              <BioLink 
                profile={userProfile} 
                preview={true} 
                audioRef={audioRef}
                isPlaying={isAudioPlaying}
                toggleAudio={toggleAudio}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
