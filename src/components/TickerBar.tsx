import { Link } from "react-router-dom";

const TICKER_ITEMS = [
  { label: "Youth Events", to: "/events" },
  { label: "Retreats", to: "/retreats" },
  { label: "Service Missions", to: "/events?category=Service+%26+Mission" },
  { label: "Fellowship Gatherings", to: "/events?category=Social+%26+Fellowship" },
  { label: "Adventist Singles Socials", to: "/singles-spark" },
  { label: "Prayer & Worship Nights", to: "/events?category=Music+%26+Worship" },
  { label: "Football League", to: "/football-league" },
  { label: "Nature Hikes", to: "/events?category=Outdoor+%26+Nature" },
];

const DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS];

const TickerBar = () => {
  return (
    <div className="relative mt-6 overflow-hidden" role="marquee" aria-label="Event categories">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-black/60 to-transparent" />

      <div className="flex animate-scroll-x gap-3 w-max py-1">
        {DOUBLED.map((item, i) => (
          <Link
            key={`${item.label}-${i}`}
            to={item.to}
            className="shrink-0 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:text-white hover:border-white/30"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
