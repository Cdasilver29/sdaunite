import { motion } from "framer-motion";
import { Users, Heart, Church } from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "Built for SDA Youth",
    description:
      "Discover events designed for young Adventists — hikes, retreats, sports, and spiritual growth opportunities that bring you closer to Christ and each other.",
    accent: "bg-secondary/10 text-secondary",
  },
  {
    icon: Heart,
    title: "Built for Singles",
    description:
      "Christ-centered fellowship for Adventist singles. Connect with like-minded believers through meaningful events, group activities, and service projects.",
    accent: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Church,
    title: "Built for Churches",
    description:
      "Organize, manage, and promote your church events with ease. From worship nights to community outreach, reach your congregation and beyond.",
    accent: "bg-primary/10 text-primary",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

const FeatureCards = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            One Platform.{" "}
            <span className="text-secondary">Every Fellowship.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Whether you're a young adult seeking community, a single looking for godly connections,
            or a church organizing outreach — SDA Unite is built for you.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              className="group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-sda-lg hover:-translate-y-1"
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.accent}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              {/* Subtle gradient glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-sda-gradient opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
