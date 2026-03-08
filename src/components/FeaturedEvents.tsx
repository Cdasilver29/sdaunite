import { motion } from "framer-motion";
import { FEATURED_EVENTS } from "@/lib/events-data";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedEvents = () => {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Upcoming <span className="text-secondary">Events</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Secure your spot at the next fellowship gathering
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden gap-1 text-secondary md:flex">
            <Link to="/events">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_EVENTS.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline" className="gap-1">
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
