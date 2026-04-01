import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        ctas={[
          { label: "Browse Streams", to: "#streams" },
        ]}
      />

      <section id="streams" className="container py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeType === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t === "All" ? "All" : TYPE_LABELS[t] || t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Play className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No streams available</h3>
            <p className="mt-2 text-muted-foreground">Video content will appear here once published.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((stream: any, i: number) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="overflow-hidden group hover:shadow-sda-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-44 overflow-hidden bg-muted">
                    {stream.thumbnail_url ? (
                      <img src={stream.thumbnail_url} alt={stream.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-sda-gradient flex items-center justify-center">
                        <Play className="h-12 w-12 text-primary-foreground/60" />
                      </div>
                    )}
                    <Badge className={`absolute top-3 right-3 ${stream.pricing_model === 'free' ? 'bg-secondary text-secondary-foreground' : 'bg-accent text-accent-foreground'}`}>
                      {stream.pricing_model === "free" ? "Free" : `${stream.currency} ${stream.price}`}
                    </Badge>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <Badge variant="outline" className="self-start mb-2 text-xs">{TYPE_LABELS[stream.stream_type] || stream.stream_type}</Badge>
                    <h3 className="text-lg font-bold text-foreground line-clamp-2">{stream.title}</h3>
                    {(stream as any).churches?.church_name && (
                      <p className="mt-1 text-xs text-muted-foreground">{(stream as any).churches.church_name}</p>
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      {stream.duration_minutes && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" /> {stream.duration_minutes} min
                        </span>
                      )}
                      <Button asChild size="sm" className="rounded-xl gap-1.5">
                        <Link to={`/streams/${stream.id}`}>
                          {stream.pricing_model === "free" ? (
                            <>Watch now <Play className="h-3.5 w-3.5" /></>
                          ) : (
                            <>Buy to watch <Lock className="h-3.5 w-3.5" /></>
                          )}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Streams;
