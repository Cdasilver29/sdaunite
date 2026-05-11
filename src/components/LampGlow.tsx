import { motion } from "framer-motion";

interface LampGlowProps {
  className?: string;
  intensity?: "soft" | "medium" | "strong";
}

/**
 * Soft "spotlight lamp" glow rendered behind hero headlines.
 * Calm, reverent — uses SDA navy / sky / warm gold palette.
 */
const LampGlow = ({ className = "", intensity = "medium" }: LampGlowProps) => {
  const opacity =
    intensity === "soft" ? 0.45 : intensity === "strong" ? 0.85 : 0.65;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ mixBlendMode: "screen" }}
    >
      {/* Top conic beam */}
      <motion.div
        className="absolute left-1/2 -top-40 h-[520px] w-[860px] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(202 81% 45% / 0.55) 0%, hsl(202 81% 33% / 0.25) 35%, transparent 70%)",
          filter: "blur(60px)",
          opacity,
        }}
        animate={{ opacity: [opacity * 0.85, opacity, opacity * 0.85] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Warm gold core */}
      <motion.div
        className="absolute left-1/2 top-1/3 h-[300px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(30 75% 70% / 0.45) 0%, hsl(30 75% 70% / 0.15) 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Thin spotlight line */}
      <div
        className="absolute left-1/2 top-0 h-[2px] w-[420px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(30 75% 70% / 0.6), transparent)",
        }}
      />
    </div>
  );
};

export default LampGlow;
