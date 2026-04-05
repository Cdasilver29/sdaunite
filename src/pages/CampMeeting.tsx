import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Radio, Clock, Music, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHero from "@/components/PageHero";

/* ── Sample Data ── */

const LIVE_SCHEDULE = [
  { time: "6:00 AM", title: "Morning Devotion & Hymns", speaker: "Pastor James Mwangi", status: "upcoming" as const },
  { time: "9:00 AM", title: "Main Worship Service", speaker: "Elder Sarah Wanjiku", status: "live" as const },
  { time: "11:30 AM", title: "Youth Praise Session", speaker: "SDA Unite Worship Team", status: "upcoming" as const },
  { time: "2:00 PM", title: "Afternoon Seminars", speaker: "Dr. Peter Ochieng", status: "upcoming" as const },
  { time: "5:00 PM", title: "Vespers & Evening Praise", speaker: "Camp Meeting Choir", status: "upcoming" as const },
  { time: "7:00 PM", title: "Evening Revival Service", speaker: "Pastor Grace Njeri", status: "upcoming" as const },
];

const ON_DEMAND_TRACKS = [
  { id: 1, title: "Great Is Thy Faithfulness", artist: "Camp Meeting Choir 2025", duration: "5:23", category: "Hymns", year: "2025" },
  { id: 2, title: "How Great Thou Art", artist: "Elder David Kimani", duration: "4:47", category: "Hymns", year: "2025" },
  { id: 3, title: "It Is Well With My Soul", artist: "Youth Worship Band", duration: "6:12", category: "Hymns", year: "2025" },
  { id: 4, title: "A Mighty Fortress Is Our God", artist: "Nairobi SDA Chorale", duration: "4:58", category: "Hymns", year: "2024" },
  { id: 5, title: "Sabbath Morning Worship Medley", artist: "Camp Meeting Orchestra", duration: "12:34", category: "Worship", year: "2024" },
  { id: 6, title: "Soon and Very Soon", artist: "Combined Camp Choir", duration: "5:01", category: "Advent Hope", year: "2024" },
  { id: 7, title: "We Have This Hope", artist: "East Africa Division Choir", duration: "4:22", category: "Advent Hope", year: "2023" },
  { id: 8, title: "Blessed Assurance", artist: "Karen SDA Youth", duration: "5:45", category: "Hymns", year: "2023" },
  { id: 9, title: "Morning Devotion – Day 3 Full", artist: "Pastor John Odhiambo", duration: "42:10", category: "Sermons", year: "2024" },
  { id: 10, title: "The Three Angels' Message in Song", artist: "Camp Meeting Ensemble", duration: "8:15", category: "Worship", year: "2023" },
];

const CATEGORIES = ["All", "Hymns", "Worship", "Advent Hope", "Sermons"];

const CampMeeting = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeYear, setActiveYear] = useState("All");

  const years = ["All", ...Array.from(new Set(ON_DEMAND_TRACKS.map(t => t.year))).sort().reverse()];

  const filtered = ON_DEMAND_TRACKS.filter(t => {
    const catMatch = activeCategory === "All" || t.category === activeCategory;
    const yearMatch = activeYear === "All" || t.year === activeYear;
    return catMatch && yearMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        label="Camp Meeting Music"
        title="Worship Without"
        titleAccent="Walls."
        subtitle="Stream live camp meeting sessions or revisit your favorite worship moments from past gatherings"
        backgroundImage="/images/camp-meeting-hero.jpg"
        ctas={[
          { label: "Watch Live", to: "#live", icon: <Radio className="h-4 w-4" /> },
          { label: "Browse Library", to: "#library", variant: "outline", icon: <Music className="h-4 w-4" /> },
        ]}
      />

      {/* ── LIVE STREAM SECTION ── */}
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
            {/* Live player placeholder */}
            <div className="lg:col-span-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-primary/10 border border-border">
                <img
                  src="/images/camp-meeting-hero.jpg"
                  alt="Live stream"
                  className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--sda-warm))] text-white shadow-lg transition-transform hover:scale-105">
                    <Play className="h-7 w-7 ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-xs text-white/60 uppercase tracking-wide">Streaming Live</p>
                  <p className="text-sm font-semibold text-white mt-0.5">Main Worship Service – Camp Meeting 2026</p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Today's Schedule</h3>
              <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
                {LIVE_SCHEDULE.map((item, i) => (
                  <motion.div
                    key={i}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ON-DEMAND LIBRARY ── */}
      <section id="library" className="bg-background">
        <div className="container py-12 md:py-16">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground">Music Library</h2>
            <p className="mt-1 text-sm text-muted-foreground">Revisit worship moments from past camp meetings</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
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
              {years.map(y => (
                <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>
              ))}
            </select>
          </div>

          {/* Track list */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_80px_50px] gap-4 px-4 py-2.5 bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
              <span className="w-8" />
              <span>Title</span>
              <span>Artist</span>
              <span>Duration</span>
              <span />
            </div>
            {filtered.length > 0 ? (
              filtered.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="group grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_80px_50px] gap-2 sm:gap-4 items-center px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:bg-[hsl(var(--sda-warm))] group-hover:text-white transition-colors">
                    <Play className="h-3.5 w-3.5 ml-0.5" />
                  </button>
                  <div className="flex items-center gap-3 sm:block">
                    <button className="sm:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Play className="h-3.5 w-3.5 ml-0.5" />
                    </button>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-snug">{track.title}</p>
                      <p className="sm:hidden text-xs text-muted-foreground mt-0.5">{track.artist}</p>
                    </div>
                  </div>
                  <span className="hidden sm:block text-sm text-muted-foreground truncate">{track.artist}</span>
                  <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {track.duration}
                  </span>
                  <Badge variant="outline" className="hidden sm:inline-flex text-[10px] w-fit">{track.category}</Badge>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">No tracks found for this filter.</div>
            )}
          </div>
        </div>
      </section>

      {/* ── DONATION CTA ── */}
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
              <Button className="bg-[hsl(var(--sda-warm))] text-white hover:bg-[hsl(var(--sda-warm))]/90 rounded-full px-8 h-10 font-medium text-sm min-w-[160px]">
                <Heart className="mr-1.5 h-4 w-4" /> Support via M-Pesa
              </Button>
              <Button variant="outline" className="rounded-full px-8 h-10 font-medium text-sm min-w-[160px] border-border">
                <ExternalLink className="mr-1.5 h-4 w-4" /> Other Ways to Give
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              "Make a joyful noise unto the Lord, all ye lands." — Psalm 100:1
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CampMeeting;
