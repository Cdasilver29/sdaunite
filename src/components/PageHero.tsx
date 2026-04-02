import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CTA {
  label: string;
  to: string;
  variant?: "primary" | "outline";
  icon?: ReactNode;
}

interface PageHeroProps {
  label: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  backgroundImage: string;
  ctas?: CTA[];
  children?: ReactNode;
}

const PageHero = ({ label, title, titleAccent, subtitle, backgroundImage, ctas = [], children }: PageHeroProps) => {
  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-primary">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />

      {/* Animated gradient overlay */}
      <div className="hero-animated-bg" />

      {/* Dark readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(202,100%,12%/0.82)] via-[hsl(202,100%,14%/0.70)] to-[hsl(202,100%,10%/0.88)]" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--sda-warm))] animate-pulse" />
              {label}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl [text-shadow:_0_4px_30px_rgb(0_0_0_/_50%)]"
          >
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="text-[hsl(var(--sda-warm))] drop-shadow-lg">{titleAccent}</span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-slate-200/80 leading-relaxed [text-shadow:_0_2px_14px_rgb(0_0_0_/_35%)]"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          {ctas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              {ctas.map((cta, i) => (
                <Button
                  key={i}
                  asChild
                  size="lg"
                  className={
                    cta.variant === "outline"
                      ? "border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-semibold rounded-full px-8 py-5 text-base min-w-[200px] bg-transparent"
                      : "bg-[hsl(var(--sda-warm))] text-accent-foreground hover:bg-[hsl(var(--sda-warm))]/90 font-semibold gap-2 rounded-full px-8 py-5 text-base shadow-lg shadow-[hsl(var(--sda-warm))/0.25] min-w-[200px]"
                  }
                  variant={cta.variant === "outline" ? "outline" : "default"}
                >
                  <Link to={cta.to}>
                    {cta.label} {cta.icon}
                  </Link>
                </Button>
              ))}
            </motion.div>
          )}

          {/* Extra children */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default PageHero;
