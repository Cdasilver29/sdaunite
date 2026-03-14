import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children?: ReactNode;
  backgroundImage?: string;
  useProfileCover?: boolean;
  /** Compact mode for functional pages like /events, /streams (160-260px) */
  compact?: boolean;
}

const PageHeader = ({ title, subtitle, icon, children, backgroundImage, useProfileCover, compact }: PageHeaderProps) => {
  const { profile } = useAuth();

  const bgImage = useProfileCover && profile?.profile_photo_url
    ? profile.profile_photo_url
    : backgroundImage;

  const isCoverOnly = !title && !subtitle && !icon && !children;

  if (compact) {
    return (
      <section className="relative overflow-hidden bg-primary">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 page-header-gradient" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 container py-10 md:py-14">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-bold text-primary-foreground md:text-3xl"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="mt-2 text-sm text-primary-foreground/70"
              >
                {subtitle}
              </motion.p>
            )}
            {children && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-4"
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden min-h-[62vh] md:min-h-[70vh] flex items-end">
      {bgImage ? (
        <>
          <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="hero-animated-bg opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 page-header-gradient" />
          <div className="hero-animated-bg opacity-25" />
        </>
      )}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {!isCoverOnly && (
        <div className="relative z-10 w-full px-4 pb-14 md:pb-20">
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
      )}
    </section>
  );
};

export default PageHeader;
