import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: string, confidence: number) => void;
}

const EmotionDetector = ({ onEmotionDetected }: EmotionDetectorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
        
        toast({
          title: "Camera activated",
          description: "Emotion detection will start shortly",
        });
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use emotion detection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsActive(false);
      setCurrentEmotion(null);
      
      toast({
        title: "Camera deactivated",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Simulate emotion detection (in production, use @huggingface/transformers)
  useEffect(() => {
    if (!isActive) return;

    const emotions = ["happy", "sad", "neutral", "angry", "surprised"];
    const interval = setInterval(() => {
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.7 + Math.random() * 0.3;
      
      setCurrentEmotion(emotion);
      onEmotionDetected(emotion, confidence);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, onEmotionDetected]);

  const getEmotionColor = (emotion: string | null) => {
    if (!emotion) return "text-foreground";
    
    const colors: Record<string, string> = {
      happy: "text-emotion-happy",
      sad: "text-emotion-sad",
      angry: "text-emotion-angry",
      neutral: "text-emotion-neutral",
      surprised: "text-emotion-surprised",
    };
    
    return colors[emotion] || "text-foreground";
  };

  return (
    <Card className="bg-gradient-card border-border/50 p-6 shadow-elevated">
      <div className="space-y-4">
        <div className="relative aspect-video bg-background/50 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <p className="text-muted-foreground">Camera inactive</p>
            </div>
          )}

          {currentEmotion && isActive && (
            <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Detected Emotion</p>
              <p className={`text-2xl font-bold capitalize ${getEmotionColor(currentEmotion)}`}>
                {currentEmotion}
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={isActive ? stopCamera : startCamera}
          disabled={loading}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting...
            </>
          ) : isActive ? (
            <>
              <CameraOff className="w-4 h-4 mr-2" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default EmotionDetector;
