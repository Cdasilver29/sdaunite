import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import { usePublishedEvents } from "@/hooks/useEvents";
import { CATEGORIES } from "@/lib/events-data";
import { Search, Ticket, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const STATUS_FILTERS = ["All", "Upcoming", "Past"] as const;

const Events = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { data: events, isLoading } = usePublishedEvents();

  const now = new Date();

  const filtered = (events ?? []).filter((e) => {
    const matchesCat = !selectedCategory || e.event_category === selectedCategory;
    const matchesSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location_name.toLowerCase().includes(search.toLowerCase());
    const eventDate = new Date(e.start_datetime);
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Upcoming" && eventDate >= now) ||
      (statusFilter === "Past" && eventDate < now);
    return matchesCat && matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Slim hero inspired by zenlipa */}
      <section className="relative overflow-hidden bg-primary py-14 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--secondary)/0.15),transparent_70%)]" />
        <div className="container relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/50 mb-3"
          >
            Discover SDA Events
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl font-bold text-primary-foreground md:text-5xl"
          >
            Experience Every Moment.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-lg text-sm text-primary-foreground/60 md:text-base"
          >
            Find fellowship, service, and spiritual growth near you
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 gap-2 font-semibold"
            >
              <a href="#events">
                <Ticket className="h-4 w-4" /> Browse Events
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-8 gap-2 font-semibold bg-transparent"
            >
              <Link to="/auth/sign-in">
                <PlusCircle className="h-4 w-4" /> Create Event
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <div id="events" className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status filters */}
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}
              </button>
            ))}
            <div className="h-5 w-px bg-border mx-1 hidden md:block" />
            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.label} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 md:min-w-[280px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>
      </div>

      {/* Events grid */}
      <div className="container py-8">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-foreground">No events found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
