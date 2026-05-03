import { motion, AnimatePresence, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { ArrowRight, Calendar, Mountain, BookHeart, Users, Dumbbell, HeartHandshake, Music, Heart, Tent, PlayCircle, HandCoins, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const SUBTITLES = [
  "Discover events, connect with Adventist youth, and strengthen your walk in fellowship.",
  "Experience Christ-centered gatherings that inspire faith and build lasting bonds.",
  "Join a community rooted in service, worship, and spiritual growth.",
];

type OrbitItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const ORBIT_ITEMS: OrbitItem[] = [
  { label: "Events", to: "/events", icon: Calendar },
  { label: "Singles Spark", to: "/singles-spark", icon: Heart },
  { label: "Football League", to: "/football-league", icon: Dumbbell },
  { label: "Retreats", to: "/retreats", icon: BookHeart },
  { label: "Camp Meeting", to: "/camp-meeting", icon: Tent },
  { label: "Streams", to: "/streams", icon: PlayCircle },
  { label: "Fundraisers", to: "/camp-meeting#donate", icon: HandCoins },
  { label: "Nature Hikes", to: "/events?category=Outdoor+%26+Nature", icon: Mountain },
  { label: "Service Missions", to: "/events?category=Service+%26+Mission", icon: HeartHandshake },
  { label: "Prayer & Worship", to: "/events?category=Music+%26+Worship", icon: Music },
  { label: "Music Concerts", to: "/events?category=Music+%26+Worship", icon: Music },
];

const HeroSection = () => {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const rotation = useMotionValue(0);
  const draggingRef = useRef(false);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, rot: 0 });
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Continuous auto-rotation when not dragging
  useAnimationFrame((t) => {
    if (lastTimeRef.current == null) {
      lastTimeRef.current = t;
      return;
    }
    const dt = t - lastTimeRef.current;
    lastTimeRef.current = t;
    if (draggingRef.current) return;
    // ~9 deg/sec → full rotation in 40s
    rotation.set(rotation.get() + dt * 0.009);
  });

  const count = ORBIT_ITEMS.length;

  // Pointer-based drag (works for mouse + touch). Prevents page scroll via touch-action: none.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!orbitRef.current) return;
    draggingRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY, rot: rotation.get() };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !orbitRef.current) return;
    const rect = orbitRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const a1 = Math.atan2(dragStartRef.current.y - cy, dragStartRef.current.x - cx);
    const a2 = Math.atan2(e.clientY - cy, e.clientX - cx);
    const delta = ((a2 - a1) * 180) / Math.PI;
    rotation.set(dragStartRef.current.rot + delta);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    // soft inertia: glide to nearest 0.5 deg snap (subtle)
    animate(rotation, rotation.get(), { type: "spring", stiffness: 80, damping: 20 });
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-primary">
      {/* Background image */}
      <img
        src="/images/sda-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-[hsl(202,60%,8%)]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(202,60%,6%)]/85 via-[hsl(202,60%,8%)]/55 to-[hsl(202,60%,6%)]/70" />

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center px-4 pt-24 pb-16 md:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-8">
          {/* LEFT: rotating orbit */}
          <div className="order-2 flex justify-center md:order-1">
            <div
              ref={orbitRef}
              className="relative aspect-square w-[340px] sm:w-[400px] md:w-[460px] lg:w-[520px] touch-none select-none cursor-grab active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              role="group"
              aria-label="Drag to rotate categories"
            >
              {/* Concentric guide rings */}
              <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute inset-[12%] rounded-full border border-dashed border-white/10 pointer-events-none" />
              <div className="absolute inset-[28%] rounded-full bg-[hsl(var(--sda-warm))]/5 border border-white/5 pointer-events-none" />

              {/* Rotating ring with items */}
              <motion.div
                className="absolute inset-0"
                style={{ rotate: rotation, transformOrigin: "50% 50%" }}
              >
                {ORBIT_ITEMS.map((item, i) => {
                  const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
                  const radiusPct = 44;
                  const x = 50 + Math.cos(angle) * radiusPct;
                  const y = 50 + Math.sin(angle) * radiusPct;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <CounterRotated rotation={rotation}>
                        <Link
                          to={item.to}
                          aria-label={item.label}
                          onClick={(e) => {
                            // prevent navigation if user was dragging
                            if (draggingRef.current) e.preventDefault();
                          }}
                          draggable={false}
                          className="group flex flex-col items-center gap-1.5"
                        >
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/95 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-[hsl(var(--sda-warm))] group-hover:border-[hsl(var(--sda-warm))]">
                            <Icon className="h-7 w-7 text-[hsl(202,60%,12%)]" />
                          </div>
                          <span className="whitespace-nowrap rounded-full bg-[hsl(202,60%,8%)]/85 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                            {item.label}
                          </span>
                        </Link>
                      </CounterRotated>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Center "A" badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[hsl(202,60%,10%)] ring-4 ring-[hsl(var(--sda-warm))]/70 shadow-2xl sm:h-28 sm:w-28">
                  <span className="font-serif text-5xl font-bold text-[hsl(var(--sda-warm))] sm:text-6xl">
                    A
                  </span>
                  <span className="absolute -bottom-1 right-3 h-2.5 w-2.5 rounded-full bg-[hsl(var(--sda-warm))]" />
                </div>
              </div>

              {/* Mobile hint */}
              <div className="md:hidden absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/50 pointer-events-none">
                Drag to rotate
              </div>
            </div>
          </div>

          {/* RIGHT: headline */}
          <div className="order-1 flex justify-center md:order-2 md:justify-end">
            <div className="max-w-xl text-center md:text-right">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-white/60"
              >
                Christ-Centered Community
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Unite in Faith.
                <br />
                <span className="text-[hsl(var(--sda-warm))]">Grow Together.</span>
              </motion.h1>

              <div className="mt-6 h-14 relative overflow-hidden md:ml-auto max-w-[380px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={subtitleIndex}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm leading-relaxed text-white/70"
                  >
                    {SUBTITLES[subtitleIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 flex flex-col sm:flex-row items-center md:justify-end justify-center gap-3"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-[hsl(var(--sda-warm))] text-[hsl(202,60%,12%)] hover:bg-[hsl(var(--sda-warm))]/90 font-semibold rounded-full px-7 text-sm h-11 min-w-[160px]"
                >
                  <Link to="/events">
                    Browse Events <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10 hover:border-white hover:text-white font-medium rounded-full px-7 text-sm h-11 min-w-[160px] bg-transparent"
                >
                  <Link to="/singles-spark">Singles Spark</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Keeps children visually upright while parent rotates
function CounterRotated({
  rotation,
  children,
}: {
  rotation: ReturnType<typeof useMotionValue<number>>;
  children: React.ReactNode;
}) {
  const inverse = useMotionValue(0);
  useAnimationFrame(() => {
    inverse.set(-rotation.get());
  });
  return <motion.div style={{ rotate: inverse }}>{children}</motion.div>;
}

export default HeroSection;
