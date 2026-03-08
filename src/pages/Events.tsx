import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      <Navbar />

      <section className="bg-sda-gradient py-12">
        <div className="container text-center">
          <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">
            Discover SDA Events
          </h1>
          <p className="mt-2 text-primary-foreground/70">
            Find fellowship, service, and spiritual growth near you
          </p>

          <div className="mx-auto mt-6 flex max-w-lg items-center gap-2 rounded-xl bg-primary-foreground/10 px-4 py-2 backdrop-blur">
            <Search className="h-4 w-4 text-primary-foreground/60" />
            <input
              type="text"
              placeholder="Search events or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none"
            />
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
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
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat.label
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No events found. Try a different search or category.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Events;
