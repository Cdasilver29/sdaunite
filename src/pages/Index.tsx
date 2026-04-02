import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedEvents from "@/components/FeaturedEvents";
import WhySDAUnite from "@/components/WhySDAUnite";
import FeatureCards from "@/components/FeatureCards";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <StatsSection />
      <FeaturedEvents />
      <CategoryGrid />
      <WhySDAUnite />
      <FeatureCards />

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-sda-gradient p-10 text-center shadow-sda-lg md:p-14"
          >
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/20 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary/30 blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
                Ready to Grow in Faith Together?
              </h2>
              <p className="mt-3 text-primary-foreground/70 text-sm md:text-base max-w-lg mx-auto">
                Join thousands of Adventist youth discovering fellowship,
                service, and spiritual growth across the nation.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 rounded-xl shadow-lg shadow-accent/20 gap-2"
                >
                  <Link to="/auth/sign-up">
                    Join Fellowship <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 font-semibold rounded-xl"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
