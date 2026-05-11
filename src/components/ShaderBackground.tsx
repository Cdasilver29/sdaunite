import { motion } from "framer-motion";

/**
 * Animated SDA-palette "shader" background.
 * Layered radial gradients that drift slowly (20–30s loop).
 * Calm, reverent — primary navy with sky + warm gold accents.
 */
const ShaderBackground = ({ className = "" }: { className?: string }) => {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Base deep navy */}
      <div className="absolute inset-0 bg-[hsl(202,100%,12%)]" />

      {/* Drifting radial blobs */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] h-[60vw] w-[60vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(202 81% 45% / 0.55), transparent 65%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 60, -20, 0],
          y: [0, 40, -10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-[15%] -right-[15%] h-[55vw] w-[55vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(202 100% 30% / 0.5), transparent 65%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.08, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[20%] left-[20%] h-[50vw] w-[50vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(30 75% 70% / 0.28), transparent 65%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle vignette for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(202,100%,8%)]/40 via-transparent to-[hsl(202,100%,8%)]/70" />
    </div>
  );
};

export default ShaderBackground;
