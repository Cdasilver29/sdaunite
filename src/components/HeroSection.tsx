import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TickerBar from "./TickerBar";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-primary">
      {/* Background image */}
      <img
        src="/images/sda-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Clean dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Subtle bottom gradient for content fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Small label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50"
          >
            Christ-Centered Community
          </motion.p>

          {/* Headline */}
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

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/50"
          >
            Discover events, connect with Adventist youth, and strengthen your walk in fellowship.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
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

          {/* Ticker */}
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
