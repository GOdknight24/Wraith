
import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Music, 
  FileAudio, 
  Save,
  Upload
} from 'lucide-react';
import BioLink from '@/components/BioLink';
import { toast } from 'sonner';

const Audio = () => {
  const { userProfile, updateProfile } = useProfile();
  const [soundEnabled, setSoundEnabled] = useState(userProfile?.soundEnabled || false);
  const [soundUrl, setSoundUrl] = useState(userProfile?.soundUrl || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const [previewProfile, setPreviewProfile] = useState(userProfile);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const testAudioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when form values change
  useEffect(() => {
    setPreviewProfile({
      ...userProfile,
      soundEnabled,
      soundUrl
    });
  }, [userProfile, soundEnabled, soundUrl]);

  // Initialize form with profile data
  useEffect(() => {
    if (userProfile) {
      setSoundEnabled(userProfile.soundEnabled || false);
      setSoundUrl(userProfile.soundUrl || '');
    }
  }, [userProfile]);

  const handleSave = () => {
    updateProfile({
      soundEnabled,
      soundUrl
    });
    toast.success('Audio settings saved successfully');
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleTestAudio = () => {
    if (testAudioRef.current) {
      if (isTestPlaying) {
        testAudioRef.current.pause();
      } else {
        testAudioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Could not play the audio. Please check the URL.");
        });
      }
      setIsTestPlaying(!isTestPlaying);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload with progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Create a fake URL for the demo
          const fakeUrl = `https://example.com/audio/${file.name.replace(/\s+/g, '-')}`;
          setSoundUrl(fakeUrl);
          toast.success('Audio file uploaded successfully');
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const fileType = file.type;
    if (!fileType.includes('audio/')) {
      toast.error('Please upload an audio file (MP3, WAV, etc.)');
      return;
    }
    
    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast.error('File size exceeds 20MB limit');
      return;
    }
    
    simulateUpload(file);
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Music size={24} className="mr-2 text-wraith-accent" />
            Audio Settings
          </h1>
          <p className="text-white/60 mt-1">Customize the sound experience for your biolink</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-wraith-accent to-wraith-hover text-white hover:from-wraith-hover hover:to-wraith-accent transition-all duration-300"
          onClick={handleSave}
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          <Card className="glass-card border-white/10 card-glow-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Volume2 size={18} className="mr-2 text-wraith-accent" />
                Background Sound
              </CardTitle>
              <CardDescription className="text-white/60">
                Add background music that plays when visitors open your page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="soundEnabled"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  className="data-[state=checked]:bg-wraith-accent"
                />
                <Label className="text-white font-medium" htmlFor="soundEnabled">
                  Enable background sound
                </Label>
              </div>
              
              {soundEnabled && (
                <>
                  <div className="space-y-2 mt-4">
                    <Label className="text-white flex items-center gap-1.5" htmlFor="soundUrl">
                      <FileAudio size={14} />
                      Sound URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="soundUrl"
                        className="glass-input text-white flex-1"
                        value={soundUrl}
                        onChange={(e) => setSoundUrl(e.target.value)}
                        placeholder="https://example.com/music.mp3"
                      />
                      <Button
                        variant="outline"
                        className="border-wraith-accent/50 text-wraith-accent hover:bg-wraith-accent/10"
                        onClick={handleOpenFileDialog}
                      >
                        <Upload size={16} className="mr-2" />
                        Upload
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="audio/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                    <p className="text-xs text-white/60">
                      Link to an MP3 or WAV file. For best results, use short loops under 20MB.
                    </p>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2 py-2">
                      <div className="text-xs text-white/80 flex justify-between">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div 
                          className="bg-wraith-accent h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {soundUrl && (
                    <div className="space-y-2 pt-3">
                      <Label className="text-white">Test Your Sound</Label>
                      <Button
                        className="w-full bg-black/30 hover:bg-black/40 border border-white/10 text-white hover:border-wraith-accent/50 transition-all duration-300"
                        onClick={toggleTestAudio}
                      >
                        {isTestPlaying ? (
                          <>
                            <Pause size={16} className="mr-2" /> Stop Test
                          </>
                        ) : (
                          <>
                            <Play size={16} className="mr-2" /> Play Test
                          </>
                        )}
                      </Button>
                      <audio 
                        ref={testAudioRef} 
                        src={soundUrl} 
                        onEnded={() => setIsTestPlaying(false)} 
                        className="hidden"
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="glass-card border-white/10 card-glow-hover">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Music size={18} className="mr-2 text-wraith-accent" />
                Sound Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <ul className="list-disc pl-5 space-y-2">
                <li>Use high-quality audio files for best user experience</li>
                <li>Keep file sizes small (under 20MB) to ensure fast page loading</li>
                <li>Consider that some users may have their device on silent</li>
                <li>By default, audio will loop continuously</li>
                <li>Users will need to manually start the audio by clicking a button due to browser restrictions</li>
                <li>MP3 format is recommended for wide compatibility</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 h-[600px] overflow-auto rounded-xl border border-white/10 gradient-border">
          <div className="text-center p-2 bg-black/60 text-white text-sm sticky top-0 z-10 backdrop-blur-md border-b border-white/10">
            Live Preview
          </div>
          {previewProfile && (
            <BioLink 
              profile={previewProfile} 
              preview={true} 
              audioRef={audioRef}
              isPlaying={isPlaying}
              toggleAudio={toggleAudio}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Audio;
