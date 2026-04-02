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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(202,100%,10%/0.65)] via-[hsl(202,100%,12%/0.5)] to-[hsl(202,100%,8%/0.8)]" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--sda-warm))] animate-pulse" />
            {label}
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-3xl font-bold leading-[1.1] text-white sm:text-4xl md:text-5xl"
          >
            {title}
            {titleAccent && (
              <>
                {" "}
                <span className="text-[hsl(var(--sda-warm))]">{titleAccent}</span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-4 max-w-lg text-sm text-white/60 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          {ctas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              {ctas.map((cta, i) => (
                <Button
                  key={i}
                  asChild
                  size="lg"
                  className={
                    cta.variant === "outline"
                      ? "border border-white/25 text-white hover:bg-white/10 hover:border-white/40 font-semibold rounded-full px-7 text-sm min-w-[170px] bg-transparent"
                      : "bg-[hsl(var(--sda-warm))] text-accent-foreground hover:bg-[hsl(var(--sda-warm))]/90 font-semibold gap-2 rounded-full px-7 text-sm shadow-lg shadow-[hsl(var(--sda-warm))/0.2] min-w-[170px]"
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

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-5"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default PageHero;
