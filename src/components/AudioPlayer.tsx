import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { CampTrack } from "@/hooks/useCampMeeting";

type AudioPlayerProps = {
  tracks: CampTrack[];
  currentIndex: number;
  onTrackChange: (index: number) => void;
};

const AudioPlayer = ({ tracks, currentIndex, onTrackChange }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);

  const track = tracks[currentIndex];
  if (!track) return null;

  const hasAudio = !!track.audio_url;

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !hasAudio) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, hasAudio]);

  const skip = useCallback(
    (dir: 1 | -1) => {
      const next = currentIndex + dir;
      if (next >= 0 && next < tracks.length) {
        onTrackChange(next);
        setIsPlaying(true);
      }
    },
    [currentIndex, tracks.length, onTrackChange]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
  }, [track.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume / 100;
  }, [volume, muted]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      {hasAudio && (
        <audio
          ref={audioRef}
          src={track.audio_url!}
          onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => skip(1)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      <div className="container flex items-center gap-4 py-2.5">
        {/* Track info */}
        <div className="min-w-0 flex-1 max-w-[200px]">
          <p className="truncate text-sm font-medium text-foreground">{track.title}</p>
          <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => skip(-1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" aria-label="Previous">
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={togglePlay}
            disabled={!hasAudio}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button onClick={() => skip(1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" aria-label="Next">
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex flex-1 items-center gap-2">
          <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right">{fmt(progress)}</span>
          <Slider
            value={[progress]}
            max={duration || 1}
            step={1}
            onValueChange={([v]) => {
              if (audioRef.current) audioRef.current.currentTime = v;
            }}
            className="flex-1"
          />
          <span className="text-[10px] tabular-nums text-muted-foreground w-8">{fmt(duration)}</span>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-1.5">
          <button onClick={() => setMuted(!muted)} className="p-1 text-muted-foreground hover:text-foreground">
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Slider
            value={[muted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={([v]) => { setVolume(v); setMuted(false); }}
            className="w-20"
          />
        </div>

        {!hasAudio && (
          <span className="text-[10px] text-muted-foreground italic">No audio file uploaded yet</span>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
