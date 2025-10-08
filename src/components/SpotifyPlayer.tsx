import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, ExternalLink } from "lucide-react";

interface Track {
  id: string;
  name: string;
  artist: string;
  uri: string;
}

interface SpotifyPlayerProps {
  tracks: Track[];
  emotion: string | null;
}

const SpotifyPlayer = ({ tracks, emotion }: SpotifyPlayerProps) => {
  const getEmotionGradient = (emotion: string | null) => {
    if (!emotion) return "from-card to-card";
    
    const gradients: Record<string, string> = {
      happy: "from-emotion-happy/20 to-card",
      sad: "from-emotion-sad/20 to-card",
      angry: "from-emotion-angry/20 to-card",
      neutral: "from-emotion-neutral/20 to-card",
      surprised: "from-emotion-surprised/20 to-card",
    };
    
    return gradients[emotion] || "from-card to-card";
  };

  return (
    <Card className={`bg-gradient-to-br ${getEmotionGradient(emotion)} border-border/50 p-6 shadow-elevated`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Recommended Tracks
          </h3>
          {emotion && (
            <span className="text-sm text-muted-foreground capitalize">
              For your {emotion} mood
            </span>
          )}
        </div>

        {tracks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recommendations yet</p>
            <p className="text-sm">Start emotion detection to get music suggestions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/50 hover:bg-background/70 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10"
                    onClick={() => window.open(track.uri, "_blank")}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(track.uri, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Connect your Spotify account for personalized recommendations
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SpotifyPlayer;
