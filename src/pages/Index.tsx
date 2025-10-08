import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Sparkles, Camera, Headphones } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Music className="w-12 h-12 text-primary animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EmoTune
              </h1>
              <Sparkles className="w-10 h-10 text-accent animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
            
            <p className="text-2xl text-foreground/90 mb-4">
              Music That Matches Your Mood
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience intelligent emotion-based music recommendations. 
              Our AI detects your facial expressions and curates the perfect playlist through Spotify integration.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-card backdrop-blur-xl p-6 rounded-2xl border border-border/50 shadow-elevated">
              <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Detection</h3>
              <p className="text-muted-foreground">
                Advanced facial emotion recognition using your webcam
              </p>
            </div>

            <div className="bg-gradient-card backdrop-blur-xl p-6 rounded-2xl border border-border/50 shadow-elevated">
              <Music className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Spotify Integration</h3>
              <p className="text-muted-foreground">
                Seamless connection with Spotify for personalized playlists
              </p>
            </div>

            <div className="bg-gradient-card backdrop-blur-xl p-6 rounded-2xl border border-border/50 shadow-elevated">
              <Headphones className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multi-Language</h3>
              <p className="text-muted-foreground">
                Choose from English, Hindi, or Tamil music preferences
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-lg px-8 py-6"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-border/50 text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>

          {/* Emotion badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {["Happy", "Sad", "Angry", "Neutral", "Surprised"].map((emotion) => (
              <span
                key={emotion}
                className="px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full text-sm border border-border/50"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
