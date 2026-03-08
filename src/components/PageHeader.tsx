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
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background: image or gradient */}
      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(202,100%,8%/0.60)] via-[hsl(202,100%,10%/0.45)] to-[hsl(var(--background)/0.95)]" />
        </>
      ) : (
        <div className="absolute inset-0 page-header-gradient" />
      )}

      {/* Floating orbs */}
      <div className="page-orb page-orb--1" />
      <div className="page-orb page-orb--2" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container relative z-10 max-w-3xl text-center">
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
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="text-3xl font-bold text-primary-foreground md:text-5xl [text-shadow:_0_2px_16px_rgb(0_0_0_/_40%)]"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" as const }}
            className="mt-4 text-lg text-primary-foreground/90 leading-relaxed [text-shadow:_0_1px_10px_rgb(0_0_0_/_25%)]"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" as const }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
