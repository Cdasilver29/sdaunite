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
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-3">
            <div className="section-line" />
          </div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Why <span className="text-secondary">SDA Unite</span>?
          </h2>
        </motion.div>

        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <point.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{point.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySDAUnite;
