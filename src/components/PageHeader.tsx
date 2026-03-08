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
}

const PageHeader = ({ title, subtitle, icon, children, backgroundImage, useProfileCover }: PageHeaderProps) => {
  const { profile } = useAuth();

  // Use uploaded profile photo as cover if enabled and available
  const bgImage = useProfileCover && profile?.profile_photo_url
    ? profile.profile_photo_url
    : backgroundImage;

  // Cover-only mode: no title/subtitle/icon passed — render a clean full cover
  const isCoverOnly = !title && !subtitle && !icon && !children;

  return (
    <section className="relative overflow-hidden min-h-[62vh] md:min-h-[70vh] flex items-end">
      {/* Background: image or gradient */}
      {bgImage ? (
        <>
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Animated gradient layer */}
          <div className="hero-animated-bg opacity-30" />
          {/* Dark readability overlay — lighter at top to show image, darker at bottom for text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
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

      {!isCoverOnly && (
        <div className="relative z-10 w-full px-4 pb-10 md:pb-14">
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
