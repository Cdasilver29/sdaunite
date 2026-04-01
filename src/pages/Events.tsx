import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import { usePublishedEvents } from "@/hooks/useEvents";
import { CATEGORIES } from "@/lib/events-data";
import { Search, Ticket, PlusCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";

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
      <PageHero
        label="Discover SDA Events"
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
        <div className="container flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
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
