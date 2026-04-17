import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const SUBTITLES = [
  "Discover events, connect with Adventist youth, and strengthen your walk in fellowship.",
  "Experience Christ-centered gatherings that inspire faith and build lasting bonds.",
  "Join a community rooted in service, worship, and spiritual growth.",
];

const CATEGORY_PILLS = [
  "Adventist Singles Socials",
  "Prayer & Worship Nights",
  "Football League",
  "Nature Hikes",
  "Youth Events",
  "Retreats",
  "Service Missions",
  "Fellowship Gatherings",
];

const PILLS_DOUBLED = [...CATEGORY_PILLS, ...CATEGORY_PILLS];

const HeroSection = () => {
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-primary">
      {/* Background image */}
      <img
        src="/images/sda-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-[hsl(202,60%,8%)]/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(202,60%,8%)]/70 via-[hsl(202,60%,8%)]/40 to-transparent" />

      {/* Main content — vertically centered, right-aligned on desktop */}
      <div className="relative z-10 flex flex-1 items-center px-4 pt-24 pb-32 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex justify-center md:justify-end">
            <div className="max-w-xl text-center md:text-right">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-white/60"
              >
                Christ-Centered Community
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Unite in Faith.
                <br />
                <span className="text-[hsl(var(--sda-warm))]">Grow Together.</span>
              </motion.h1>

              <div className="mt-6 h-14 relative overflow-hidden md:ml-auto max-w-[380px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={subtitleIndex}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm leading-relaxed text-white/65"
                  >
                    {SUBTITLES[subtitleIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 flex flex-col sm:flex-row items-center md:justify-end justify-center gap-3"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-[hsl(var(--sda-warm))] text-[hsl(202,60%,12%)] hover:bg-[hsl(var(--sda-warm))]/90 font-semibold rounded-full px-7 text-sm h-11 min-w-[160px]"
                >
                  <Link to="/events">
                    Browse Events <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10 hover:border-white hover:text-white font-medium rounded-full px-7 text-sm h-11 min-w-[160px] bg-transparent"
                >
                  <Link to="/singles-spark">Singles Spark</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee category strip — flush at bottom */}
      <div className="relative z-10 overflow-hidden border-t border-white/5 bg-[hsl(202,60%,6%)]/70 backdrop-blur-sm py-3">
        <div className="flex w-max animate-marquee gap-3">
          {PILLS_DOUBLED.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
