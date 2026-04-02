import { motion } from "framer-motion";
import { usePublishedEvents } from "@/hooks/useEvents";

const StatsSection = () => {
  const { data: events } = usePublishedEvents();
  const eventCount = events?.length ?? 0;

  const STATS = [
    { value: `${eventCount}+`, label: "Events Hosted" },
    { value: "500+", label: "Youth Connected" },
    { value: "20+", label: "Churches Represented" },
    { value: "10K+", label: "Tickets Distributed" },
  ];

  return (
    <section className="border-b border-border bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-secondary md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
