import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  backgroundImage?: string;
}

const PageHeader = ({ title, subtitle, icon, children, backgroundImage }: PageHeaderProps) => {
  return (
    <section className="relative overflow-hidden min-h-[40vh] flex items-center">
      {/* Background: image or gradient */}
      {backgroundImage ? (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Animated gradient layer */}
          <div className="hero-animated-bg opacity-40" />
          {/* Dark readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(202,100%,10%/0.80)] via-[hsl(202,100%,12%/0.65)] to-[hsl(var(--background)/0.95)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 page-header-gradient" />
          <div className="hero-animated-bg opacity-25" />
        </>
      )}

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full px-4">
        <div className="mx-auto max-w-3xl text-center">
          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full glass"
            >
              {icon}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold text-white md:text-5xl [text-shadow:_0_4px_24px_rgb(0_0_0_/_50%)]"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="mt-4 text-lg text-slate-100/90 leading-relaxed [text-shadow:_0_2px_14px_rgb(0_0_0_/_35%)]"
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
