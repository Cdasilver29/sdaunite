import { Link } from "react-router-dom";

const CHIPS = [
  { label: "Singles Fellowship", icon: "👥", category: "Social & Fellowship" },
  { label: "Youth Hikes", icon: "🏔️", category: "Outdoor & Nature" },
  { label: "Service & Mission", icon: "💛", category: "Service & Mission" },
  { label: "Spiritual Retreats", icon: "🙏", category: "Spiritual Retreats" },
  { label: "Football League", icon: "⚽", category: "Sports & Health" },
  { label: "Music & Worship", icon: "🎵", category: "Music & Worship" },
  { label: "Fundraisers", icon: "🤝", category: "Fundraisers" },
];

// Double the chips for seamless infinite scroll
const DOUBLED = [...CHIPS, ...CHIPS];

const ScrollingChips = () => {
  return (
    <section className="py-10 overflow-hidden bg-background">
      <div className="container mb-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Explore by Category
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

        <div className="flex animate-scroll-x gap-4 w-max">
          {DOUBLED.map((chip, i) => (
            <Link
              key={`${chip.label}-${i}`}
              to={`/events?category=${encodeURIComponent(chip.category)}`}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:shadow-sda hover:border-secondary hover:-translate-y-0.5"
            >
              <span className="text-lg">{chip.icon}</span>
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollingChips;
