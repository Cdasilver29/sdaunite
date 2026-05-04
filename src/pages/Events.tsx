import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { usePublishedEvents } from "@/hooks/useEvents";
import { CATEGORIES } from "@/lib/events-data";
import { Search, Calendar, MapPin, Share2, Ticket, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import PageHero from "@/components/PageHero";
import { getEventImageUrl } from "@/lib/event-image";
import type { DbEvent } from "@/hooks/useEvents";
import { motion } from "framer-motion";

const STATUS_FILTERS = ["All", "Upcoming", "Past"] as const;

/* Wide event card — inspired by Zenlipa event listing */
const WideEventCard = ({ event, index }: { event: DbEvent; index: number }) => {
  const { toast } = useToast();
  const imgSrc = getEventImageUrl(event.image_url, event.event_category);
  const lowestPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map((t) => t.price))
    : 0;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`);
    toast({ title: "Link copied!" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link
        to={`/events/${event.id}`}
        className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-sda-lg hover:-translate-y-0.5"
      >
        {/* Image */}
        <div className="relative sm:w-72 md:w-80 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-48 overflow-hidden">
          <img
            src={imgSrc}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 sm:bg-gradient-to-t sm:from-transparent sm:to-transparent" />
          <Badge className="absolute top-2.5 left-2.5 bg-accent text-accent-foreground border-0 text-[10px] font-semibold">
            {event.event_category}
          </Badge>
          <button
            onClick={handleShare}
            className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white"
            aria-label="Share event"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between gap-2 p-4 sm:p-5">
          <div>
            <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
              {event.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {new Date(event.start_datetime).toLocaleDateString("en-KE", { dateStyle: "medium" })}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate max-w-[200px]">{event.location_name}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
            <span className="text-sm font-bold text-primary">
              {lowestPrice === 0 ? "Free" : `From KSh ${lowestPrice.toLocaleString()}`}
            </span>
            <span className="text-xs font-semibold text-secondary group-hover:underline">
              Get Ticket →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const { data: events, isLoading } = usePublishedEvents();

  // Sync filter when navigating with a different ?category=
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
  }, [searchParams]);

  // When user changes the filter via UI, update the URL so it's shareable/bookmarkable
  const updateCategory = (value: string) => {
    setSelectedCategory(value);
    const next = new URLSearchParams(searchParams);
    if (value) next.set("category", value);
    else next.delete("category");
    setSearchParams(next, { replace: true });
  };

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
      <PageHero
        label="Discover Adventist Events"
        title="Experience Every"
        titleAccent="Moment."
        subtitle="Find fellowship, service, and spiritual growth near you"
        backgroundImage="/images/sda-hero.jpg"
        ctas={[
          { label: "Browse Events", to: "#events", icon: <Ticket className="h-4 w-4" /> },
          { label: "Create Event", to: "/auth/sign-in", variant: "outline", icon: <PlusCircle className="h-4 w-4" /> },
        ]}
      />

      {/* Filter bar */}
      <div id="events" className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
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
            <select
              value={selectedCategory}
              onChange={(e) => updateCategory(e.target.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                selectedCategory
                  ? "border-secondary bg-secondary/10 text-secondary"
                  : "border-border bg-background text-foreground font-medium"
              }`}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.label} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <button
                onClick={() => updateCategory("")}
                className="rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-secondary/20 transition-colors"
                aria-label="Clear category filter"
              >
                {selectedCategory} ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 md:min-w-[260px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>
      </div>

      {/* Featured Events label */}
      <div className="container pt-8 pb-2">
        <h2 className="text-lg font-bold text-foreground">Featured Events</h2>
      </div>

      {/* Events list */}
      <div className="container pb-12">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <Skeleton className="sm:w-72 md:w-80 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-48 rounded-none" />
                <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-3 pt-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((event, i) => (
              <WideEventCard key={event.id} event={event} index={i} />
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
