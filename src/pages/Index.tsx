import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrollingChips from "@/components/ScrollingChips";
import FeatureCards from "@/components/FeatureCards";
import CategorySection from "@/components/CategorySection";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ScrollingChips />
      <FeatureCards />
      <CategorySection />
      <FeaturedEvents />

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl rounded-3xl bg-sda-gradient p-10 text-center shadow-sda-lg md:p-14"
          >
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Grow in Faith Together?
            </h2>
            <p className="mt-4 text-primary-foreground/75 md:text-lg">
              Join thousands of Adventist youth discovering fellowship, service, and spiritual growth.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 rounded-xl">
                <Link to="/signup">Join Fellowship</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold rounded-xl"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
