import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Lock } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useState } from "react";

const TYPES = ["All", "sermon", "seminar", "concert", "retreat", "youth_program"];
const TYPE_LABELS: Record<string, string> = {
  sermon: "Sermon",
  seminar: "Seminar",
  concert: "Concert",
  retreat: "Retreat",
  youth_program: "Youth Program",
};

const useStreams = () =>
  useQuery({
    queryKey: ["streams", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*, churches(church_name)")
        .eq("stream_status", "published")
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

const Streams = () => {
  const { data: streams = [], isLoading } = useStreams();
  const [activeType, setActiveType] = useState("All");

  const filtered = activeType === "All" ? streams : streams.filter((s: any) => s.stream_type === activeType);

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        label="Watch & Be Inspired"
        title="Live Streams &"
        titleAccent="Replays."
        subtitle="Watch sermons, seminars, concerts, and youth programs on demand"
        backgroundImage="/images/sda-hero.jpg"
        ctas={[{ label: "Browse Streams", to: "#streams" }]}
      />

      <section id="streams" className="container py-8">
        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeType === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t === "All" ? "All" : TYPE_LABELS[t] || t}
            </button>
          ))}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Available Streams</h2>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Play className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No streams available</h3>
            <p className="mt-2 text-muted-foreground">Video content will appear here once published.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((stream: any, i: number) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <Link
                  to={`/streams/${stream.id}`}
                  className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-sda-lg hover:-translate-y-0.5"
                >
                  {/* Thumbnail */}
                  <div className="relative sm:w-72 md:w-80 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-44 overflow-hidden bg-muted">
                    {stream.thumbnail_url ? (
                      <img
                        src={stream.thumbnail_url}
                        alt={stream.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-sda-gradient flex items-center justify-center">
                        <Play className="h-10 w-10 text-primary-foreground/60" />
                      </div>
                    )}
                    <Badge className={`absolute top-2.5 right-2.5 border-0 text-[10px] font-semibold ${stream.pricing_model === 'free' ? 'bg-secondary text-secondary-foreground' : 'bg-accent text-accent-foreground'}`}>
                      {stream.pricing_model === "free" ? "Free" : `${stream.currency} ${stream.price}`}
                    </Badge>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between gap-2 p-4 sm:p-5">
                    <div>
                      <Badge variant="outline" className="mb-2 text-[10px]">{TYPE_LABELS[stream.stream_type] || stream.stream_type}</Badge>
                      <h3 className="text-base font-bold text-foreground line-clamp-2 group-hover:text-secondary transition-colors">{stream.title}</h3>
                      {(stream as any).churches?.church_name && (
                        <p className="mt-1 text-xs text-muted-foreground">{(stream as any).churches.church_name}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                      {stream.duration_minutes && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> {stream.duration_minutes} min
                        </span>
                      )}
                      <span className="ml-auto text-xs font-semibold text-secondary group-hover:underline flex items-center gap-1">
                        {stream.pricing_model === "free" ? (
                          <>Watch now <Play className="h-3 w-3" /></>
                        ) : (
                          <>Buy to watch <Lock className="h-3 w-3" /></>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Streams;
