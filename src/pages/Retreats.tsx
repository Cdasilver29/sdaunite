import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Utensils, Bus, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

      <div className="container pt-8 pb-2">
        <h2 className="text-lg font-bold text-foreground">Upcoming Retreats</h2>
      </div>

      <section id="retreats" className="container pb-12">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : retreats.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-foreground">No retreats available yet</h3>
            <p className="mt-2 text-muted-foreground">Check back soon for upcoming retreat escapes.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {retreats.map((retreat: any, i: number) => (
              <motion.div
                key={retreat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <Link
                  to={`/retreats/${retreat.id}`}
                  className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-sda-lg hover:-translate-y-0.5"
                >
                  <div className="relative sm:w-72 md:w-80 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-48 overflow-hidden">
                    <img
                      src={retreat.image_url || "/images/sda-retreats-hikes.jpg"}
                      alt={retreat.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {retreat.starting_price > 0 ? (
                      <Badge className="absolute top-2.5 right-2.5 bg-accent text-accent-foreground border-0 text-[10px] font-semibold">
                        From {retreat.currency} {retreat.starting_price.toLocaleString()}
                      </Badge>
                    ) : (
                      <Badge className="absolute top-2.5 right-2.5 bg-secondary text-secondary-foreground border-0 text-[10px] font-semibold">
                        Free
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-2 p-4 sm:p-5">
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
                        {retreat.title}
                      </h3>
                      {retreat.spiritual_objective && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{retreat.spiritual_objective}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {retreat.location_name}, {retreat.city}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(retreat.start_date), "MMM d")} – {format(new Date(retreat.end_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t border-border pt-3 mt-1">
                      {retreat.includes_accommodation && (
                        <span className="flex items-center gap-1 text-xs text-secondary"><HomeIcon className="h-3 w-3" /> Stay</span>
                      )}
                      {retreat.includes_meals && (
                        <span className="flex items-center gap-1 text-xs text-secondary"><Utensils className="h-3 w-3" /> Meals</span>
                      )}
                      {retreat.includes_transport && (
                        <span className="flex items-center gap-1 text-xs text-secondary"><Bus className="h-3 w-3" /> Transport</span>
                      )}
                      <span className="ml-auto text-xs font-semibold text-secondary group-hover:underline">
                        View Retreat →
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

export default Retreats;
