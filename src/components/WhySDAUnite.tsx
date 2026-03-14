import { motion } from "framer-motion";
import { Users, BookOpen, HeartHandshake, Sparkles } from "lucide-react";

const POINTS = [
  {
    icon: Users,
    title: "Community",
    description: "Connect with Adventist youth who share your values and walk of faith.",
  },
  {
    icon: BookOpen,
    title: "Spiritual Growth",
    description: "Deepen your relationship with Christ through retreats, worship, and Bible study.",
  },
  {
    icon: HeartHandshake,
    title: "Service",
    description: "Make a difference through mission trips, outreach, and community projects.",
  },
  {
    icon: Sparkles,
    title: "Fun & Fellowship",
    description: "Enjoy hikes, sports, social gatherings, and meaningful connections.",
  },
];

const WhySDAUnite = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="section-line" />
          </div>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Why <span className="text-secondary">SDA Unite</span>?
          </h2>
        </motion.div>

        <div className="mx-auto max-w-5xl grid gap-10 sm:grid-cols-2 lg:gap-16">
          {POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/10">
                <point.icon className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{point.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySDAUnite;
