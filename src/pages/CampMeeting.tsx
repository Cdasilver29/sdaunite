import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Radio, Clock, Music, Heart, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AudioPlayer from "@/components/AudioPlayer";
import CampMeetingDonation from "@/components/CampMeetingDonation";
import { useCampSchedules, useCampTracks } from "@/hooks/useCampMeeting";

const CATEGORIES = ["All", "Hymns", "Worship", "Advent Hope", "Sermons"];

const CampMeeting = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeYear, setActiveYear] = useState("All");
  const [showLivePlayer, setShowLivePlayer] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);

  const { data: schedules, isLoading: loadingSchedules } = useCampSchedules();
  const { data: tracks, isLoading: loadingTracks } = useCampTracks();

  const years = tracks
    ? ["All", ...Array.from(new Set(tracks.map(t => t.year))).sort().reverse()]
    : ["All"];

  const filtered = (tracks || []).filter(t => {
    const catMatch = activeCategory === "All" || t.category === activeCategory;
    const yearMatch = activeYear === "All" || t.year === activeYear;
    return catMatch && yearMatch;
  });

  const handlePlayTrack = (filteredIndex: number) => {
    // Map filtered index to full tracks array index
    const track = filtered[filteredIndex];
    if (!tracks || !track) return;
    const realIndex = tracks.findIndex(t => t.id === track.id);
    setActiveTrackIndex(realIndex);
  };

  return (
    <div className={`min-h-screen bg-background ${activeTrackIndex !== null ? "pb-16" : ""}`}>

      {/* LIVE STREAM SECTION */}
      <section id="live" className="border-b border-border bg-card">
        <div className="container py-12 md:py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <h2 className="text-xl font-bold text-foreground">Live Now</h2>
            </div>
            <Badge variant="outline" className="text-[10px] font-medium">Camp Meeting 2026</Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-primary/10 border border-border">
                {showLivePlayer ? (
                  <>
                    <iframe
                      src={(() => {
                        const liveItem = (schedules || []).find(s => s.status === "live" && s.stream_url);
                        const url = liveItem?.stream_url || "https://www.youtube.com/embed/live_stream?channel=UCa2gHhwuV3v5RZf0hJg8_Ng";
                        // Convert watch URLs to embed
                        if (url.includes("youtube.com/watch")) {
                          const vid = new URL(url).searchParams.get("v");
                          return `https://www.youtube.com/embed/${vid}?autoplay=1`;
                        }
                        if (url.includes("youtu.be/")) {
                          const vid = url.split("youtu.be/")[1]?.split("?")[0];
                          return `https://www.youtube.com/embed/${vid}?autoplay=1`;
                        }
                        return url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
                      })()}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Live Stream"
                    />
                    <button
                      onClick={() => setShowLivePlayer(false)}
                      className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <img src="/images/camp-meeting-hero.jpg" alt="Live stream" className="h-full w-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => setShowLivePlayer(true)}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--sda-warm))] text-white shadow-lg transition-transform hover:scale-105"
                      >
                        <Play className="h-7 w-7 ml-1" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-xs text-white/60 uppercase tracking-wide">Streaming Live</p>
                      <p className="text-sm font-semibold text-white mt-0.5">Main Worship Service - Camp Meeting 2026</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Today's Schedule</h3>
              <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
                {loadingSchedules ? (
                  Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)
                ) : (
                  (schedules || []).map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                        item.status === "live"
                          ? "border-[hsl(var(--sda-warm))]/30 bg-[hsl(var(--sda-warm))]/5"
                          : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      <span className="shrink-0 text-xs font-medium text-muted-foreground mt-0.5 w-14">{item.time}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.speaker}</p>
                      </div>
                      {item.status === "live" && (
                        <Badge className="shrink-0 bg-red-500 text-white border-0 text-[10px]">LIVE</Badge>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ON-DEMAND LIBRARY */}
      <section id="library" className="bg-background">
        <div className="container py-12 md:py-16">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground">Music Library</h2>
            <p className="mt-1 text-sm text-muted-foreground">Revisit worship moments from past camp meetings</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
            <select
              value={activeYear}
              onChange={(e) => setActiveYear(e.target.value)}
              className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            >
              {years.map(y => <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>)}
            </select>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_80px_50px] gap-4 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
              <span className="w-8" />
              <span>Title</span>
              <span>Artist</span>
              <span>Duration</span>
              <span />
            </div>
            {loadingTracks ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 mx-4 my-2 rounded" />)
            ) : filtered.length > 0 ? (
              filtered.map((track, i) => {
                const isActive = tracks && activeTrackIndex !== null && tracks[activeTrackIndex]?.id === track.id;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className={`group grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_80px_50px] gap-2 sm:gap-4 items-center px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${
                      isActive ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handlePlayTrack(i)}
                  >
                    <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:bg-[hsl(var(--sda-warm))] group-hover:text-white transition-colors">
                      {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                    </button>
                    <div className="flex items-center gap-3 sm:block">
                      <button className="sm:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                      </button>
                      <div>
                        <p className={`text-sm font-medium leading-snug ${isActive ? "text-[hsl(var(--sda-warm))]" : "text-foreground"}`}>{track.title}</p>
                        <p className="sm:hidden text-xs text-muted-foreground mt-0.5">{track.artist}</p>
                      </div>
                    </div>
                    <span className="hidden sm:block text-sm text-muted-foreground truncate">{track.artist}</span>
                    <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {track.duration}
                    </span>
                    <Badge variant="outline" className="hidden sm:inline-flex text-[10px] w-fit">{track.category}</Badge>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">No tracks found for this filter.</div>
            )}
          </div>
        </div>
      </section>

      {/* DONATION CTA */}
      <section className="border-t border-border bg-card">
        <div className="container py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-xl text-center"
          >
            <Heart className="mx-auto h-8 w-8 text-[hsl(var(--sda-warm))] mb-4" />
            <h2 className="text-xl font-bold text-foreground">Support Camp Meeting Music</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              All camp meeting music is freely available. Your generous contributions help cover production costs, musician travel, and equipment for future camp meetings.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <CampMeetingDonation />
              <Button
                variant="outline"
                className="rounded-full px-8 h-10 font-medium text-sm min-w-[160px] border-border"
                onClick={() => {
                  window.open("https://wa.me/254700000000?text=I%20would%20like%20to%20support%20Camp%20Meeting%20music", "_blank");
                }}
              >
                <ExternalLink className="mr-1.5 h-4 w-4" /> Other Ways to Give
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              "Make a joyful noise unto the Lord, all ye lands." — Psalm 100:1
            </p>
          </motion.div>
        </div>
      </section>

      {/* Audio Player */}
      {activeTrackIndex !== null && tracks && (
        <AudioPlayer
          tracks={tracks}
          currentIndex={activeTrackIndex}
          onTrackChange={setActiveTrackIndex}
        />
      )}
    </div>
  );
};

export default CampMeeting;
