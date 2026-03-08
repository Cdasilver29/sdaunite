import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-singles-fellowship.jpg";

const stats = [
  { icon: Users, label: "Active Members", value: "2,400+" },
  { icon: Heart, label: "Events Hosted", value: "120+" },
  { icon: MapPin, label: "Churches", value: "45+" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="SDA fellowship gathering" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-sda-gradient opacity-85" />
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-foreground">
              Christ-Centered Events for SDA Youth
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl"
          >
            Grow in Faith.{" "}
            <span className="text-accent">Unite in Fellowship.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg leading-relaxed text-primary-foreground/80 md:text-xl"
          >
            Discover SDA youth events, retreats, hikes, service missions, and more.
            Register, connect, and strengthen your walk with Christ — together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold gap-2 px-8"
            >
              <Link to="/events">
                Explore Events <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold"
            >
              <Link to="/code-of-conduct">Our Values</Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-xl bg-primary-foreground/10 px-4 py-4 backdrop-blur-sm"
            >
              <s.icon className="h-5 w-5 text-accent" />
              <span className="text-xl font-bold text-primary-foreground md:text-2xl">
                {s.value}
              </span>
              <span className="text-xs text-primary-foreground/60">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
