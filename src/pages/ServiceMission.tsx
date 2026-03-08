import PageHeader from "@/components/PageHeader";
import EventCard from "@/components/EventCard";
import { usePublishedEvents } from "@/hooks/useEvents";
import { Heart } from "lucide-react";

const ServiceMission = () => {
  const { data: events, isLoading } = usePublishedEvents();

  const serviceEvents = (events ?? []).filter(
    (e) => e.event_category === "Service & Mission"
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Service & Mission"
        subtitle="Hospital visits, children's home outreaches, community clean-ups, and more. Put your faith into action."
        icon={<Heart className="h-6 w-6 text-primary-foreground" />}
        backgroundImage="/images/sda-service-mission.jpg"
      />

      {/* Why serve — quote section */}
      <section className="border-b border-border bg-muted/30 py-16">
        <div className="container max-w-3xl text-center">
          <blockquote>
            <p className="text-lg italic text-foreground/90">
              "I was sick and you looked after me, I was in prison and you came to visit me."
            </p>
            <cite className="mt-2 block text-sm font-semibold text-secondary">
              — Matthew 25:36
            </cite>
          </blockquote>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            As Adventists, service is at the heart of our faith. These outreach events are opportunities to be the hands and feet of Jesus in your community. Browse upcoming mission events below and sign up to make a difference.
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : serviceEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {serviceEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                No service events scheduled yet.
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Check back soon — or contact us if you'd like to organize one!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServiceMission;
