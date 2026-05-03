import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Camera } from "lucide-react";
import PageHero from "@/components/PageHero";

const usePastEventsWithPhotos = () =>
  useQuery({
    queryKey: ["xperience-events"],
    queryFn: async () => {
      const { data: photos, error: pErr } = await supabase
        .from("xperience_photos")
        .select("event_id")
        .eq("approved", true);
      if (pErr) throw pErr;

      const eventIds = [...new Set((photos || []).map((p: any) => p.event_id))];
      if (eventIds.length === 0) return [];

      const { data, error } = await supabase
        .from("events")
        .select("id, title, start_datetime, end_datetime, image_url, city, event_category")
        .in("id", eventIds)
        .order("start_datetime", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

const Xperience = () => {
  const { data: events = [], isLoading } = usePastEventsWithPhotos();

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        label="Relive the Moments"
        title="The Adventist Unite"
        titleAccent="Xperience."
        subtitle="See what God did through our fellowship events"
        backgroundImage="/images/sda-sports.jpg"
        ctas={[
          { label: "View Gallery", to: "#gallery" },
        ]}
      />

      <section id="gallery" className="container py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No experiences yet</h3>
            <p className="mt-2 text-muted-foreground">Photos from past events will appear here once approved.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event: any, i: number) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/xperience/${event.id}`}>
                  <Card className="overflow-hidden group hover:shadow-sda-lg transition-shadow">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={event.image_url || "/images/sda-hero.jpg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge className="bg-accent/90 text-accent-foreground text-xs mb-1">{event.event_category}</Badge>
                        <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
                        <p className="text-xs text-white/70">{format(new Date(event.start_datetime), "MMM d, yyyy")} · {event.city}</p>
                      </div>
                    </div>
                    <CardContent className="p-4 text-center">
                      <span className="text-sm font-medium text-secondary">View Xperience</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Xperience;
