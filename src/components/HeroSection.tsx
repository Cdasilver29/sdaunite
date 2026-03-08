import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
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
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/sda-hero.jpg')" }}
      />

      {/* Dark overlay for strong text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(202,100%,8%/0.65)] via-[hsl(202,100%,10%/0.50)] to-[hsl(202,100%,6%/0.80)]" />

      {/* Subtle animated orbs on top */}
      <div className="hero-orb hero-orb--1 opacity-[0.08]" />
      <div className="hero-orb hero-orb--3 opacity-[0.06]" />

      <div className="container relative z-10 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-xs font-semibold tracking-widest uppercase text-primary-foreground/90">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Christ-Centered Community
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" as const }}
            className="mt-8 text-5xl font-bold leading-[1.08] text-primary-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem] [text-shadow:_0_2px_20px_rgb(0_0_0_/_40%)]"
          >
            Unite in Faith.
            <br />
            <span className="text-accent drop-shadow-md">Grow Together.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: "easeOut" as const }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/90 md:text-xl [text-shadow:_0_1px_12px_rgb(0_0_0_/_30%)]"
          >
            Discover SDA youth events, retreats, service missions, and fellowship
            gatherings. Register, connect, and strengthen your walk with Christ.
          </motion.p>

          {/* Search bar — glassmorphic */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: "easeOut" as const }}
            className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl glass p-2"
          >
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 text-primary-foreground/40 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, hikes, retreats..."
                className="w-full bg-transparent py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/35 outline-none"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold gap-2 rounded-xl px-6 shrink-0 shadow-lg shadow-accent/20"
            >
              <span className="hidden sm:inline">Find Events</span>
              <span className="sm:hidden">Go</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/60"
          >
            {[
              { value: "2,400+", label: "Members" },
              { value: "120+", label: "Events" },
              { value: "45+", label: "Churches" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && <div className="h-8 w-px bg-primary-foreground/20 -ml-4 mr-0" />}
                <div className="text-center">
                  <span className="block text-2xl font-bold text-primary-foreground md:text-3xl drop-shadow-sm">
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

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
