import { motion } from "framer-motion";
import { usePublishedEvents } from "@/hooks/useEvents";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedEvents = () => {
  const { data: events, isLoading } = usePublishedEvents();
  const featured = events?.slice(0, 6) ?? [];

  return (
    <section className="py-14 md:py-18 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="section-line mb-3" />
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Featured <span className="text-secondary">Events</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Secure your spot at the next fellowship gathering
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="hidden gap-1 text-secondary font-semibold md:flex shrink-0"
          >
            <Link to="/events">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-14 text-center">
            <p className="text-muted-foreground">
              No upcoming events yet. Check back soon!
            </p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline" className="gap-1 rounded-full">
            <Link to="/events">
              View All Events <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
