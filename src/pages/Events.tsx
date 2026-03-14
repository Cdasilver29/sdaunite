import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import EventCard from "@/components/EventCard";
import { usePublishedEvents } from "@/hooks/useEvents";
import { CATEGORIES } from "@/lib/events-data";
import { Search } from "lucide-react";

const Events = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [search, setSearch] = useState("");
  const { data: events, isLoading } = usePublishedEvents();

  const filtered = (events ?? []).filter((e) => {
    const matchesCat = !selectedCategory || e.event_category === selectedCategory;
    const matchesSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location_name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Discover SDA Events"
        subtitle="Find fellowship, service, and spiritual growth near you"
        compact
      >
        <div className="flex max-w-md items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
          <Search className="h-4 w-4 text-primary-foreground/50" />
          <input
            type="text"
            placeholder="Search events or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none"
          />
        </div>
      </PageHeader>

      <div className="container py-6">
        {/* Category filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Events
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.label ? "" : cat.label)
              }
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat.label
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <cat.icon className="h-3.5 w-3.5" /> {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
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
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No events found. Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
