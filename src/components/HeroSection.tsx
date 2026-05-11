import { motion, AnimatePresence, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";

import ShaderBackground from "@/components/ShaderBackground";
import LampGlow from "@/components/LampGlow";
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
  sub?: string;
  to: string;
  image: string;
};

// 8 items spaced cleanly around the ring (ShipFast-style)
const ORBIT_ITEMS: OrbitItem[] = [
  { label: "Events", sub: "fellowship", to: "/events", image: imgEvents },
  { label: "Singles Spark", sub: "connect", to: "/singles-spark", image: imgSingles },
  { label: "Football League", sub: "compete", to: "/football-league", image: imgFootball },
  { label: "Retreats", sub: "renew", to: "/retreats", image: imgRetreats },
  { label: "Camp Meeting", sub: "worship", to: "/camp-meeting", image: imgCamp },
  { label: "Streams", sub: "watch live", to: "/streams", image: imgStreams },
  { label: "Service Missions", sub: "serve", to: "/events?category=Service+%26+Mission", image: imgService },
  { label: "Prayer & Worship", sub: "pray", to: "/events?category=Music+%26+Worship", image: imgPrayer },
];

const HeroSection = () => {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const rotation = useMotionValue(0);
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
      rotation.set(rotation.get() + dt * 0.005);
    }
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
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[hsl(202,100%,12%)]">
      <ShaderBackground />
      <LampGlow intensity="medium" />

      <div className="relative z-10 flex flex-1 items-center px-4 pt-24 pb-16 md:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* LEFT: headline (ShipFast-style) */}
          <div className="order-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-3"
            >
              <span className="h-px w-8 bg-[hsl(var(--sda-warm))]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[hsl(var(--sda-warm))]">
                Christ-Centered Community
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Unite in faith,
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 font-serif italic font-semibold text-[hsl(202,60%,12%)] px-3 py-1">
                  grow together
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 -skew-x-3 bg-[hsl(var(--sda-warm))] rounded-sm shadow-[0_8px_24px_-8px_hsl(var(--sda-warm)/0.7)]"
                />
              </span>
            </motion.h1>

            <div className="mt-8 min-h-[3.5rem] max-w-md mx-auto md:mx-0">
              <AnimatePresence mode="wait">
                <motion.p
                  key={subtitleIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.45 }}
                  className="text-base leading-relaxed text-white/75"
                >
                  {SUBTITLES[subtitleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 flex flex-col sm:flex-row items-center md:justify-start justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-[hsl(var(--sda-warm))] text-[hsl(202,60%,12%)] hover:bg-[hsl(var(--sda-warm))]/90 hover:shadow-[0_10px_30px_-8px_hsl(var(--sda-warm)/0.7)] transition-all font-semibold rounded-xl px-7 text-sm h-12 min-w-[180px]"
              >
                <Link to="/events">
                  Browse Events <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Link
                to="/auth/sign-up"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/85 hover:text-[hsl(var(--sda-warm))] transition-colors"
              >
                Join Fellowship
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden md:flex mt-10 items-center gap-2 text-[11px] text-white/55"
            >
              <span className="rounded-full border border-white/15 px-3 py-1">1,200+ members</span>
              <span className="rounded-full border border-white/15 px-3 py-1">60+ events</span>
              <span className="rounded-full border border-white/15 px-3 py-1">24 churches</span>
            </motion.div>
          </div>

          {/* RIGHT: orbit ring */}
          <div className="order-2 flex justify-center md:justify-end">
            <div
              ref={orbitRef}
              className="relative aspect-square w-[340px] sm:w-[400px] md:w-[440px] lg:w-[500px] touch-none select-none cursor-grab active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              role="group"
              aria-label="Drag to rotate categories"
            >
              {/* Visible thin orbit ring */}
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-[8%] rounded-full border border-white/5" />

              {/* Soft center glow */}
              <div
                className="absolute inset-[20%] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--sda-warm)/0.18), transparent 70%)",
                  filter: "blur(20px)",
                }}
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
                  const highlight = isActive || isPressed || isHovered;

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
                          className="group flex items-center gap-2 focus:outline-none"
                        >
                          {/* Icon tile */}
                          <div
                            className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${
                              highlight
                                ? "ring-2 ring-[hsl(var(--sda-warm))] shadow-[0_8px_28px_-4px_hsl(var(--sda-warm)/0.55)]"
                                : "ring-1 ring-white/20"
                            }`}
                          >
                            <img
                              src={item.image}
                              alt=""
                              draggable={false}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(202,60%,6%)]/40 to-transparent" />
                          </div>
                          {/* Label block */}
                          <div className="min-w-0">
                            <div
                              className={`text-[12px] font-semibold leading-tight whitespace-nowrap transition-colors ${
                                highlight ? "text-[hsl(var(--sda-warm))]" : "text-white"
                              }`}
                            >
                              {item.label}
                            </div>
                            {item.sub && (
                              <div className="text-[10px] text-white/55 leading-tight whitespace-nowrap">
                                — {item.sub}
                              </div>
                            )}
                          </div>
                        </Link>
                      </CounterRotated>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Center brand badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  className="rounded-md bg-[hsl(202,60%,6%)] px-3 py-1.5 ring-1 ring-white/15 shadow-2xl"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-[11px] font-bold tracking-[0.18em] text-white">
                    ADVENTIST <span className="text-[hsl(var(--sda-warm))]">UNITE</span>
                  </span>
                </motion.div>
              </div>

              {/* Mobile hint */}
              <div className="md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/60 pointer-events-none">
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
