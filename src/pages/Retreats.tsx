import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Utensils, Bus, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import PageHero from "@/components/PageHero";

const useRetreats = () =>
  useQuery({
    queryKey: ["retreats", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retreats")
        .select("*, churches(church_name)")
        .eq("retreat_status", "published")
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

const Retreats = () => {
  const { data: retreats = [], isLoading } = useRetreats();

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        label="Escape & Reconnect"
        title="Retreat"
        titleAccent="Escapes."
        subtitle="Unplug, reconnect with God, and experience fellowship in nature"
        backgroundImage="/images/sda-retreats-hikes.jpg"
        ctas={[
          { label: "View Retreats", to: "#retreats" },
        ]}
      />

      <section id="retreats" className="container py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : retreats.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-foreground">No retreats available yet</h3>
            <p className="mt-2 text-muted-foreground">Check back soon for upcoming retreat escapes.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {retreats.map((retreat: any, i: number) => (
              <motion.div
                key={retreat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="overflow-hidden group hover:shadow-sda-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={retreat.image_url || "/images/sda-retreats-hikes.jpg"}
                      alt={retreat.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {retreat.starting_price > 0 && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-semibold">
                        From {retreat.currency} {retreat.starting_price.toLocaleString()}
                      </Badge>
                    )}
                    {retreat.starting_price === 0 && (
                      <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground font-semibold">
                        Free
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-foreground line-clamp-1">{retreat.title}</h3>
                    {retreat.spiritual_objective && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{retreat.spiritual_objective}</p>
                    )}
                    <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {retreat.location_name}, {retreat.city}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(retreat.start_date), "MMM d")} – {format(new Date(retreat.end_date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {retreat.includes_accommodation && (
                        <span className="flex items-center gap-1 text-xs text-secondary"><HomeIcon className="h-3 w-3" /> Stay</span>
                      )}
                      {retreat.includes_meals && (
                        <span className="flex items-center gap-1 text-xs text-secondary"><Utensils className="h-3 w-3" /> Meals</span>
                      )}
                      {retreat.includes_transport && (
                        <span className="flex items-center gap-1 text-xs text-secondary"><Bus className="h-3 w-3" /> Transport</span>
                      )}
                    </div>
                    <Button asChild className="mt-4 w-full rounded-xl" size="sm">
                      <Link to={`/retreats/${retreat.id}`}>View Retreat</Link>
                    </Button>
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

export default Retreats;
