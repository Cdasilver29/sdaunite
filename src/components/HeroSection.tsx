import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TickerBar from "./TickerBar";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src="/images/sda-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Animated gradient overlay */}
      <div className="hero-animated-bg" />

      {/* Dark readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(202,100%,12%/0.82)] via-[hsl(202,100%,14%/0.70)] to-[hsl(202,100%,10%/0.88)]" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--sda-warm))] animate-pulse" />
              Christ-Centered Community
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-5xl font-bold leading-[1.06] text-white sm:text-6xl md:text-7xl [text-shadow:_0_4px_30px_rgb(0_0_0_/_50%)]"
          >
            Unite in Faith.
            <br />
            <span className="text-[hsl(var(--sda-warm))] drop-shadow-lg">Grow Together.</span>
          </motion.h1>

          {/* Short subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-lg text-base text-slate-200/85 md:text-lg [text-shadow:_0_2px_12px_rgb(0_0_0_/_30%)]"
          >
            Discover Christ-centered events, connect with Adventist youth, and strengthen your walk in fellowship.
          </motion.p>

          {/* Ticker bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <TickerBar />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-[hsl(var(--sda-warm))] text-accent-foreground hover:bg-[hsl(var(--sda-warm))]/90 font-semibold gap-2 rounded-full px-8 py-5 text-base shadow-lg shadow-[hsl(var(--sda-warm))/0.25] min-w-[200px]"
            >
              <Link to="/events">
                Browse Events <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-semibold rounded-full px-8 py-5 text-base min-w-[200px] bg-transparent"
            >
              <Link to="/singles-spark">
                Singles Spark
              </Link>
            </Button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex justify-center"
          >
            <ChevronDown className="h-5 w-5 text-white/30 animate-bounce" />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
