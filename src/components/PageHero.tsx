import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LampGlow from "@/components/LampGlow";

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
    <section className="relative flex min-h-[44vh] items-center justify-center overflow-hidden bg-primary">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Clean dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Soft lamp glow behind headline */}
      <LampGlow intensity="soft" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45"
          >
            {label}
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          {ctas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mx-auto mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              {ctas.map((cta, i) =>
                cta.to.startsWith("#") ? (
                  <Button
                    key={i}
                    size="lg"
                    className={
                      cta.variant === "outline"
                        ? "border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-medium rounded-full px-7 text-sm h-10 min-w-[160px] bg-transparent"
                        : "bg-[hsl(var(--sda-warm))] text-white hover:bg-[hsl(var(--sda-warm))]/90 font-medium rounded-full px-7 text-sm h-10 min-w-[160px]"
                    }
                    variant={cta.variant === "outline" ? "outline" : "default"}
                    onClick={() => {
                      const el = document.querySelector(cta.to);
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {cta.label} {cta.icon}
                  </Button>
                ) : (
                  <Button
                    key={i}
                    asChild
                    size="lg"
                    className={
                      cta.variant === "outline"
                        ? "border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-medium rounded-full px-7 text-sm h-10 min-w-[160px] bg-transparent"
                        : "bg-[hsl(var(--sda-warm))] text-white hover:bg-[hsl(var(--sda-warm))]/90 font-medium rounded-full px-7 text-sm h-10 min-w-[160px]"
                    }
                    variant={cta.variant === "outline" ? "outline" : "default"}
                  >
                    <Link to={cta.to}>
                      {cta.label} {cta.icon}
                    </Link>
                  </Button>
                )
              )}
            </motion.div>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
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
