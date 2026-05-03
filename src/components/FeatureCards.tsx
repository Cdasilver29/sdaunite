import { motion } from "framer-motion";
import { Users, Heart, Church, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: Users,
    title: "Built for SDA Youth",
    description:
      "Discover events designed for young Adventists — hikes, retreats, sports, and spiritual growth that bring you closer to Christ and each other.",
    link: "/events",
    linkLabel: "Browse Youth Events",
    accent: "bg-secondary/10 text-secondary",
    borderAccent: "group-hover:border-secondary/30",
    bgImage: "/images/sda-retreats-hikes.jpg",
  },
  {
    icon: Heart,
    title: "Built for Singles Fellowship",
    description:
      "Christ-centered fellowship for Adventist singles. Connect through meaningful events, group activities, and service projects — equally yoked.",
    link: "/events?category=Social+%26+Fellowship",
    linkLabel: "Explore Fellowship",
    accent: "bg-accent/15 text-accent-foreground",
    borderAccent: "group-hover:border-accent/40",
    bgImage: "/images/sda-hero.jpg",
  },
  {
    icon: Church,
    title: "Built for Churches",
    description:
      "Organize, manage, and promote your church events with ease. From worship nights to community outreach — reach your congregation and beyond.",
    link: "/about",
    linkLabel: "Learn More",
    accent: "bg-primary/10 text-primary",
    borderAccent: "group-hover:border-primary/30",
    bgImage: "/images/sda-sports.jpg",
  },
];

const FeatureCards = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background accent orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="section-line" />
          </div>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            One Platform.{" "}
            <span className="text-secondary">Every Fellowship.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground leading-relaxed">
            Whether you're a young adult seeking community, a single looking for
            godly connections, or a church organizing outreach — Adventist Unite is
            built for you.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.12,
                ease: "easeOut" as const,
              }}
              className={`card-glow group relative rounded-2xl border border-border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-sda-lg hover:-translate-y-1.5 ${feature.borderAccent}`}
            >
              {/* Card background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${feature.bgImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-[hsl(var(--card)/0.85)] to-[hsl(var(--card)/0.6)]" />

              <div className="relative z-10 p-8">
                <div
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.accent} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-colors hover:text-primary"
                >
                  {feature.linkLabel}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
