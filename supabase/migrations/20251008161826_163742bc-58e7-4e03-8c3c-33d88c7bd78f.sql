-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  preferred_language TEXT DEFAULT 'english' CHECK (preferred_language IN ('english', 'hindi', 'tamil')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create emotion history table
CREATE TABLE public.emotion_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  emotion TEXT NOT NULL,
  confidence DECIMAL(5,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.emotion_history ENABLE ROW LEVEL SECURITY;

-- Policies for emotion history
CREATE POLICY "Users can view their own emotion history"
  ON public.emotion_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emotion history"
  ON public.emotion_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create music recommendations table
CREATE TABLE public.music_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  emotion TEXT NOT NULL,
  track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  spotify_uri TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.music_recommendations ENABLE ROW LEVEL SECURITY;

-- Policies for music recommendations
CREATE POLICY "Users can view their own recommendations"
  ON public.music_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
  ON public.music_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create user spotify tokens table (for storing OAuth tokens)
CREATE TABLE public.spotify_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.spotify_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for spotify tokens
CREATE POLICY "Users can view their own tokens"
  ON public.spotify_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
  ON public.spotify_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens"
  ON public.spotify_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens"
  ON public.spotify_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spotify_tokens_updated_at
  BEFORE UPDATE ON public.spotify_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();