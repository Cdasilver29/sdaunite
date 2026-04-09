import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TickerBar from "./TickerBar";
import { useState, useEffect } from "react";

const SUBTITLES = [
  "Discover events, connect with Adventist youth, and strengthen your walk in fellowship.",
  "Experience Christ-centered gatherings that inspire faith and build lasting bonds.",
  "Join a community rooted in service, worship, and spiritual growth.",
];

const HeroSection = () => {
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-primary">
      {/* Background image */}
      <img
        src="/images/sda-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Clean dark overlay */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Content — right-aligned on desktop, centered on mobile */}
      <div className="relative z-10 w-full px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Headline block — right-aligned on desktop */}
          <div className="flex justify-center md:justify-end">
            <div className="max-w-xl text-center md:text-right">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50"
              >
                Christ-Centered Community
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Unite in Faith.
                <br />
                <span className="text-[hsl(var(--sda-warm))]">Grow Together.</span>
              </motion.h1>

              <div className="mt-5 h-12 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={subtitleIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5 }}
                    className="text-[15px] leading-relaxed text-white/50"
                  >
                    {SUBTITLES[subtitleIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* CTAs — always centered */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-[hsl(var(--sda-warm))] text-white hover:bg-[hsl(var(--sda-warm))]/90 font-medium rounded-full px-8 text-sm h-11 min-w-[160px]"
            >
              <Link to="/events">
                Browse Events <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-medium rounded-full px-8 text-sm h-11 min-w-[160px] bg-transparent"
            >
              <Link to="/singles-spark">Singles Spark</Link>
            </Button>
          </motion.div>

          {/* Ticker — always centered */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <TickerBar />
          </motion.div>
        </div>
      </div>

      {/* Clean bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
