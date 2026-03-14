import { motion } from "framer-motion";
import { Calendar, Mountain, BookHeart, Users, Dumbbell, HeartHandshake, Music, Handshake, Play, Heart } from "lucide-react";
import CategoryCard from "./CategoryCard";

const CATEGORIES = [
  {
    icon: Calendar,
    title: "Events",
    description: "Browse all upcoming youth events and gatherings",
    to: "/events",
    accentClass: "bg-primary/10 text-primary",
  },
  {
    icon: BookHeart,
    title: "Retreats",
    description: "Spiritual retreats for rest and renewal in Christ",
    to: "/retreats",
    accentClass: "bg-secondary/10 text-secondary",
  },
  {
    icon: Play,
    title: "Streams",
    description: "Watch sermons, seminars, and worship on demand",
    to: "/streams",
    accentClass: "bg-primary/10 text-primary",
  },
  {
    icon: Heart,
    title: "Adventist Singles Spark",
    description: "Christ-centered fellowship for Adventist singles",
    to: "/singles-spark",
    accentClass: "bg-accent/15 text-accent-foreground",
  },
  {
    icon: Dumbbell,
    title: "Adventist Football League",
    description: "Inter-church sports bringing fellowship through competition",
    to: "/football-league",
    accentClass: "bg-secondary/10 text-secondary",
  },
  {
    icon: Mountain,
    title: "Nature & Hikes",
    description: "Explore God's creation with fellow believers",
    to: "/events?category=Outdoor+%26+Nature",
    accentClass: "bg-primary/10 text-primary",
  },
  {
    icon: HeartHandshake,
    title: "Missions & Service",
    description: "Serve your community through outreach projects",
    to: "/events?category=Service+%26+Mission",
    accentClass: "bg-secondary/10 text-secondary",
  },
  {
    icon: Handshake,
    title: "Fundraisers & Causes",
    description: "Support church ministries and community causes",
    to: "/events?category=Fundraisers",
    accentClass: "bg-accent/15 text-accent-foreground",
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-3">
            <div className="section-line" />
          </div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Find Your <span className="text-secondary">Fellowship</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore events across all areas of Adventist life
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <CategoryCard {...cat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
