import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/events-data";
import { Link } from "react-router-dom";

const CategorySection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Find Your <span className="text-secondary">Fellowship</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Explore events across all areas of Adventist life
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/events?category=${encodeURIComponent(cat.label)}`}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:shadow-sda-lg hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <cat.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{cat.label}</h3>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;