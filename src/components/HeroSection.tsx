import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const HeroSection = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/events?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/events");
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 hero-gradient-bg" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      <div className="container relative z-10 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="mb-6 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2 text-xs font-semibold tracking-widest uppercase text-primary-foreground">
              Christ-Centered Community
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-5xl font-extrabold leading-[1.1] text-primary-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Unite in Faith.
            <br />
            <span className="text-accent">Grow Together.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/75 md:text-xl"
          >
            Discover SDA youth events, retreats, service missions, and fellowship gatherings.
            Register, connect, and strengthen your walk with Christ — together.
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl bg-primary-foreground/10 p-2 backdrop-blur-md border border-primary-foreground/15"
          >
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-5 w-5 text-primary-foreground/50 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, hikes, retreats..."
                className="w-full bg-transparent py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold gap-2 rounded-xl px-6 shrink-0"
            >
              Find Events <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/60"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-foreground">2,400+</span>
              <span className="text-sm">Members</span>
            </div>
            <div className="h-6 w-px bg-primary-foreground/20" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-foreground">120+</span>
              <span className="text-sm">Events</span>
            </div>
            <div className="h-6 w-px bg-primary-foreground/20" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-foreground">45+</span>
              <span className="text-sm">Churches</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
