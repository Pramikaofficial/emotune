import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Settings } from "lucide-react";
import EmotionDetector from "@/components/EmotionDetector";
import LanguageSelector from "@/components/LanguageSelector";
import SpotifyPlayer from "@/components/SpotifyPlayer";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [language, setLanguage] = useState("english");
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);
      loadUserProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session) {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("preferred_language")
        .eq("user_id", uid)
        .single();

      if (error) throw error;

      if (data) {
        setLanguage(data.preferred_language || "english");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    if (!userId) return;

    setLanguage(newLanguage);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ preferred_language: newLanguage })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Language updated",
        description: `Preferences set to ${newLanguage}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEmotionDetected = useCallback(async (emotion: string, confidence: number) => {
    if (!userId) return;

    setCurrentEmotion(emotion);

    // Save emotion to history
    try {
      await supabase.from("emotion_history").insert([
        {
          user_id: userId,
          emotion,
          confidence: confidence * 100,
        },
      ]);

      // Mock music recommendations based on emotion
      const mockTracks = [
        { id: "1", name: "Happy Vibes", artist: "Artist 1", uri: "spotify:track:example1" },
        { id: "2", name: "Mood Booster", artist: "Artist 2", uri: "spotify:track:example2" },
        { id: "3", name: "Feel Good", artist: "Artist 3", uri: "spotify:track:example3" },
      ];

      setRecommendations(mockTracks);
    } catch (error) {
      console.error("Error saving emotion:", error);
    }
  }, [userId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "See you soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EmoTune Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Let your emotions guide your music
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-border/50"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-border/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EmotionDetector onEmotionDetected={handleEmotionDetected} />
            <SpotifyPlayer tracks={recommendations} emotion={currentEmotion} />
          </div>

          <div className="space-y-6">
            <LanguageSelector value={language} onChange={handleLanguageChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
