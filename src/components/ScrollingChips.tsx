import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Mountain, HeartHandshake, BookHeart, Dumbbell, Music, Handshake, Home } from "lucide-react";
import { LucideIcon } from "lucide-react";

const CHIPS: { label: string; icon: LucideIcon; category: string }[] = [
  { label: "Singles Fellowship", icon: Users, category: "Social & Fellowship" },
  { label: "Youth Hikes", icon: Mountain, category: "Outdoor & Nature" },
  { label: "Service & Mission", icon: HeartHandshake, category: "Service & Mission" },
  { label: "Spiritual Retreats", icon: BookHeart, category: "Spiritual Retreats" },
  { label: "Football League", icon: Dumbbell, category: "Sports & Health" },
  { label: "Music & Worship", icon: Music, category: "Music & Worship" },
  { label: "Fundraisers", icon: Handshake, category: "Fundraisers" },
  { label: "Kids & Family", icon: Home, category: "Social & Fellowship" },
];

const DOUBLED = [...CHIPS, ...CHIPS];

const ScrollingChips = () => {
  return (
    <section className="py-12 overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mb-8"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="section-line" />
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Explore by Category
          </p>
        </div>
      </motion.div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex animate-scroll-x gap-4 w-max">
          {DOUBLED.map((chip, i) => (
            <Link
              key={`${chip.label}-${i}`}
              to={`/events?category=${encodeURIComponent(chip.category)}`}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:shadow-sda hover:border-secondary/50 hover:-translate-y-1 hover:bg-card"
            >
              <chip.icon className="h-4 w-4 text-secondary" />
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollingChips;