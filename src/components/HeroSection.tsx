import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SocialShareBar from "./SocialShareBar";

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
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Layer 1: Full-bleed background image */}
      <img
        src="/images/sda-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Layer 2: Animated gradient overlay (SDA blue/gold breathing) */}
      <div className="hero-animated-bg" />

      {/* Layer 3: Dark readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(202,100%,12%/0.82)] via-[hsl(202,100%,14%/0.70)] to-[hsl(202,100%,10%/0.88)]" />

      {/* Layer 4: Content */}
      <div className="relative z-10 w-full px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-xs font-semibold tracking-widest uppercase text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--sda-warm))] animate-pulse" />
              Christ-Centered Community
            </span>
          </motion.div>

          {/* Headline — large, high contrast */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="mt-8 text-5xl font-bold leading-[1.06] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem] [text-shadow:_0_4px_30px_rgb(0_0_0_/_50%)]"
          >
            Unite in Faith.
            <br />
            <span className="text-[hsl(var(--sda-warm))] drop-shadow-lg">Grow Together.</span>
          </motion.h1>

          {/* Subtitle — high contrast */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-100/90 md:text-xl [text-shadow:_0_2px_16px_rgb(0_0_0_/_40%)]"
          >
            Discover SDA youth events, retreats, service missions, and fellowship
            gatherings. Register, connect, and strengthen your walk with Christ.
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: "easeOut" }}
            className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl glass p-2"
          >
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 text-white/40 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, hikes, retreats..."
                className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/35 outline-none"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-[hsl(var(--sda-warm))] text-accent-foreground hover:bg-[hsl(var(--sda-warm))]/90 font-semibold gap-2 rounded-xl px-6 shrink-0 shadow-lg shadow-[hsl(var(--sda-warm))/0.25]"
            >
              <span className="hidden sm:inline">Find Events</span>
              <span className="sm:hidden">Go</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-8 text-white/60"
          >
            {[
              { value: "2,400+", label: "Members" },
              { value: "120+", label: "Events" },
              { value: "45+", label: "Churches" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && <div className="h-8 w-px bg-white/20 -ml-4 mr-0" />}
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white md:text-3xl drop-shadow-sm">
                    {stat.value}
                  </span>
                  <span className="text-xs uppercase tracking-wider">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Social share */}
          <SocialShareBar className="mt-10 justify-center" />
        </div>
      </div>

      {/* Floating social on right side (desktop only) */}
      <div className="hidden lg:block">
        <SocialShareBar variant="floating" />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
