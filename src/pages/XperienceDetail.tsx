import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const XperienceDetail = () => {
  const { id } = useParams();

  const { data: event } = useQuery({
    queryKey: ["xperience-event", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["xperience-photos", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xperience_photos")
        .select("*")
        .eq("event_id", id!)
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch similar upcoming events
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ["upcoming-similar", event?.event_category],
    enabled: !!event?.event_category,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, start_datetime, image_url, city")
        .eq("event_status", "published")
        .eq("event_category", event!.event_category)
        .gte("start_datetime", new Date().toISOString())
        .order("start_datetime", { ascending: true })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px]">
        <img src={event.image_url || "/images/sda-hero.jpg"} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <Link to="/xperience" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-3">
              <ArrowLeft className="h-4 w-4" /> All Experiences
            </Link>
            <Badge className="bg-accent text-accent-foreground mb-2 block w-fit">{event.event_category}</Badge>
            <h1 className="text-3xl font-bold text-white md:text-4xl">{event.title}</h1>
            <p className="mt-1 text-white/70">{format(new Date(event.start_datetime), "MMMM d, yyyy")} · {event.city}</p>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Recap */}
        <div className="max-w-2xl mb-10">
          <h2 className="text-xl font-bold text-foreground mb-3">Event Highlights</h2>
          <p className="text-muted-foreground">{event.description}</p>
        </div>

        {/* Gallery */}
        <h2 className="text-xl font-bold text-foreground mb-4">Gallery</h2>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : photos.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center">No approved photos for this event yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo: any) => (
              <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
                <img src={photo.image_url} alt={photo.caption || ""} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upcoming similar events */}
        {upcomingEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-foreground mb-4">Join Similar Upcoming Events</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((e: any) => (
                <Link key={e.id} to={`/events/${e.id}`} className="flex gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                  <img src={e.image_url || "/images/sda-hero.jpg"} alt={e.title} className="h-16 w-16 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(e.start_datetime), "MMM d, yyyy")} · {e.city}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default XperienceDetail;
