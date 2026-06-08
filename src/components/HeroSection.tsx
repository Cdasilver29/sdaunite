import { motion, AnimatePresence, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";

import imgEvents from "@/assets/flyer-social-fellowship.jpg";
import imgSingles from "@/assets/singles-spark-hero.jpg";
import imgFootball from "@/assets/football-league-hero.jpg";
import imgRetreats from "@/assets/retreat-nature.jpg";
import imgCamp from "@/assets/flyer-spiritual-retreat.jpg";
import imgStreams from "@/assets/worship-concert.jpg";
import imgFundraisers from "@/assets/flyer-fundraiser.jpg";
import imgHikes from "@/assets/hero-youth-hike.jpg";
import imgService from "@/assets/hero-service-mission.jpg";
import imgPrayer from "@/assets/flyer-music-worship.jpg";
import imgConcerts from "@/assets/singles-worship.jpg";

const SUBTITLES = [
  "Discover events, connect with Adventist youth, and strengthen your walk in fellowship.",
  "Experience Christ-centered gatherings that inspire faith and build lasting bonds.",
  "Join a community rooted in service, worship, and spiritual growth.",
];

type OrbitItem = {
  label: string;
  to: string;
  image: string;
};

const ORBIT_ITEMS: OrbitItem[] = [
  { label: "Events", to: "/events", image: imgEvents },
  { label: "Singles Spark", to: "/singles-spark", image: imgSingles },
  { label: "Football League", to: "/football-league", image: imgFootball },
  { label: "Retreats", to: "/retreats", image: imgRetreats },
  { label: "Camp Meeting", to: "/camp-meeting", image: imgCamp },
  { label: "Streams", to: "/streams", image: imgStreams },
  { label: "Fundraisers", to: "/camp-meeting#donate", image: imgFundraisers },
  { label: "Nature Hikes", to: "/events?category=Outdoor+%26+Nature", image: imgHikes },
  { label: "Service Missions", to: "/events?category=Service+%26+Mission", image: imgService },
  { label: "Prayer & Worship", to: "/events?category=Music+%26+Worship", image: imgPrayer },
  { label: "Music Concerts", to: "/events?category=Music+%26+Worship", image: imgConcerts },
];

const HeroSection = () => {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const rotation = useMotionValue(0);
  const ringInverse = useMotionValue(0);
  const draggingRef = useRef(false);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, rot: 0 });
  const lastTimeRef = useRef<number | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const location = useLocation();
  const activeKey = useMemo(() => {
    const path = location.pathname.replace(/\/$/, "");
    const search = location.search;
    const full = `${path}${search}`;
    const exact = ORBIT_ITEMS.find((it) => it.to.replace(/\/$/, "") === full);
    if (exact) return exact.label;
    const byPath = ORBIT_ITEMS.find((it) => it.to.split("?")[0].replace(/\/$/, "") === path);
    return byPath?.label ?? null;
  }, [location.pathname, location.search]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useAnimationFrame((t) => {
    if (lastTimeRef.current == null) {
      lastTimeRef.current = t;
      return;
    }
    const dt = t - lastTimeRef.current;
    lastTimeRef.current = t;
    if (!draggingRef.current) {
      rotation.set(rotation.get() + dt * 0.008);
    }
    ringInverse.set(ringInverse.get() - dt * 0.004);
  });

  const count = ORBIT_ITEMS.length;

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
    animate(rotation, rotation.get(), { type: "spring", stiffness: 80, damping: 20 });
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-primary">
      <img
        src="/images/sda-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[hsl(202,60%,8%)]/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(202,60%,6%)]/90 via-[hsl(202,60%,8%)]/60 to-[hsl(202,60%,6%)]/75" />

      <div className="relative z-10 flex flex-1 items-center px-4 pt-8 pb-16 md:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
          {/* LEFT: rotating orbit */}
          <div className="order-2 flex justify-center md:order-1">
            <div
              ref={orbitRef}
              className="relative mx-auto aspect-square w-[300px] sm:w-[340px] md:w-[380px] lg:w-[420px] touch-none select-none cursor-grab active:cursor-grabbing"
              style={{ flex: "0 0 auto" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              role="group"
              aria-label="Drag to rotate categories"
            >
              {/* Soft pulsing radial halo */}
              <motion.div
                className="absolute inset-[-6%] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, hsl(var(--sda-warm)/0.22), transparent 60%)",
                  filter: "blur(20px)",
                }}
                animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.04, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />


              {/* Rotating ring with items */}
              <motion.div
                className="absolute inset-0"
                style={{ rotate: rotation, transformOrigin: "50% 50%" }}
              >
                {ORBIT_ITEMS.map((item, i) => {
                  const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
                  const radiusPct = 46;
                  const x = 50 + Math.cos(angle) * radiusPct;
                  const y = 50 + Math.sin(angle) * radiusPct;
                  const isActive = activeKey === item.label;
                  const isPressed = pressed === item.label;
                  const isHovered = hovered === item.label;
                  const showLabel = isActive || isPressed || isHovered;

                  return (
                    <motion.div
                      key={item.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.05 * i, ease: "easeOut" }}
                    >
                      <CounterRotated rotation={rotation}>
                        <Link
                          to={item.to}
                          aria-label={item.label}
                          aria-current={isActive ? "page" : undefined}
                          onClick={(e) => {
                            if (draggingRef.current) e.preventDefault();
                          }}
                          onPointerDown={() => setPressed(item.label)}
                          onPointerUp={() => setPressed(null)}
                          onPointerLeave={() => {
                            setPressed(null);
                            setHovered(null);
                          }}
                          onPointerEnter={() => setHovered(item.label)}
                          draggable={false}
                          className="group relative flex flex-col items-center focus:outline-none"
                        >
                          {/* Floating label (only visible when active/hover/pressed) */}
                          <span
                            className={`pointer-events-none absolute -top-7 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur-md transition-all duration-200 ${
                              showLabel
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-1"
                            } ${
                              isActive
                                ? "bg-[hsl(var(--sda-warm))] text-[hsl(202,60%,12%)] shadow"
                                : "bg-[hsl(202,60%,8%)]/85 text-white/95 ring-1 ring-white/15"
                            }`}
                          >
                            {item.label}
                          </span>

                          {/* Glow */}
                          <div
                            className={`absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-300 ${
                              isActive || isPressed
                                ? "opacity-90 bg-[hsl(var(--sda-warm))]/55"
                                : "opacity-0 group-hover:opacity-60 bg-[hsl(var(--sda-warm))]/40"
                            }`}
                          />

                          {/* Tile with real image */}
                          <div
                            className={`relative h-11 w-11 overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-active:scale-95 ${
                              isActive
                                ? "ring-2 ring-[hsl(var(--sda-warm))] shadow-[0_8px_32px_-4px_hsl(var(--sda-warm)/0.6)]"
                                : isPressed
                                  ? "ring-2 ring-[hsl(var(--sda-warm))] shadow-[0_8px_28px_-4px_hsl(var(--sda-warm)/0.55)]"
                                  : "ring-1 ring-white/25 group-hover:ring-[hsl(var(--sda-warm))]/70"
                            }`}
                          >
                            <img
                              src={item.image}
                              alt=""
                              draggable={false}
                              loading="lazy"
                              className={`h-full w-full object-cover transition-transform duration-500 ${
                                isActive || isPressed ? "scale-110 brightness-110" : "group-hover:scale-110"
                              }`}
                            />
                            {/* Dark gradient overlay for legibility/contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(202,60%,6%)]/55 via-transparent to-[hsl(202,60%,6%)]/15" />
                            {isActive && (
                              <motion.span
                                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--sda-warm))] ring-2 ring-[hsl(202,60%,8%)]"
                                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                                transition={{ duration: 1.6, repeat: Infinity }}
                              />
                            )}
                          </div>
                        </Link>
                      </CounterRotated>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Center "A" badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(202,60%,12%)] to-[hsl(202,60%,6%)] ring-2 ring-[hsl(var(--sda-warm))]/70 shadow-2xl sm:h-16 sm:w-16"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="font-serif text-2xl font-bold text-[hsl(var(--sda-warm))] sm:text-3xl">
                    A
                  </span>
                  {/* Orbiting micro-dot */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="absolute left-1/2 -top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-[hsl(var(--sda-warm))] shadow-[0_0_10px_hsl(var(--sda-warm))]" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Mobile hint */}
              <div className="md:hidden absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/60 pointer-events-none">
                <motion.span
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↻
                </motion.span>
                Swipe to rotate
              </div>
            </div>
          </div>

          {/* RIGHT: headline */}
          <div className="order-1 flex justify-center md:order-2 md:justify-end">
            <div className="max-w-xl text-center md:text-right">
              {/* Eyebrow with gold rule */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex items-center gap-3 justify-center md:justify-end"
              >
                <span className="h-px w-8 bg-[hsl(var(--sda-warm))]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[hsl(var(--sda-warm))]">
                  Christ-Centered Community
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-5xl lg:text-6xl"
              >
                Unite in Faith.
                <br />
                <span className="font-serif italic font-normal text-[hsl(var(--sda-warm))]">
                  Grow Together.
                </span>
              </motion.h1>

              <div className="mt-6 min-h-[3.5rem] relative md:ml-auto max-w-[360px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={subtitleIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="text-sm leading-relaxed text-white/70 md:text-right"
                  >
                    {SUBTITLES[subtitleIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 flex flex-col sm:flex-row items-center md:justify-end justify-center gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-[hsl(var(--sda-warm))] text-[hsl(202,60%,12%)] hover:bg-[hsl(var(--sda-warm))]/90 hover:shadow-[0_10px_30px_-8px_hsl(var(--sda-warm)/0.7)] transition-all font-semibold rounded-full px-7 text-sm h-11 min-w-[160px]"
                >
                  <Link to="/events">
                    Browse Events <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Link
                  to="/singles-spark"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/85 hover:text-[hsl(var(--sda-warm))] transition-colors"
                >
                  Singles Spark
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              {/* Meta chips - desktop only */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="hidden md:flex mt-8 items-center gap-2 justify-end text-[11px] text-white/55"
              >
                <span className="rounded-full border border-white/15 px-3 py-1">1,200+ members</span>
                <span className="rounded-full border border-white/15 px-3 py-1">60+ events</span>
                <span className="rounded-full border border-white/15 px-3 py-1">24 churches</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
