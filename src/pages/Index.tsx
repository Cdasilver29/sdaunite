import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <FeaturedEvents />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-2xl bg-sda-gradient p-8 text-center shadow-sda-lg md:p-12">
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              Ready to Grow in Faith Together?
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Join thousands of Adventist youth discovering fellowship, service, and spiritual growth.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
                Join Fellowship
              </button>
              <button className="rounded-lg border border-primary-foreground/30 px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
