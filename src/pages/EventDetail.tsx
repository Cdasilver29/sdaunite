import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, BadgeCheck, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEventById } from "@/hooks/useEvents";
import heroSingles from "@/assets/hero-singles-fellowship.jpg";
import heroHike from "@/assets/hero-youth-hike.jpg";
import heroService from "@/assets/hero-service-mission.jpg";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const IMAGE_MAP: Record<string, string> = {
  "singles-fellowship": heroSingles,
  "youth-hike": heroHike,
  "service-mission": heroService,
};

const EventDetail = () => {
  const { id } = useParams();
  const { data: event, isLoading } = useEventById(id);
  const [selectedTier, setSelectedTier] = useState(0);
  const [conductAgreed, setConductAgreed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Event not found</h1>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const imgSrc = (event.image_url && IMAGE_MAP[event.image_url]) || heroSingles;
  const ticketsSold = event.tickets?.length || 0;
  const spotsLeft = event.event_capacity - ticketsSold;
  const tiers = event.ticket_types || [];
  const tier = tiers[selectedTier];
  const churchName = event.churches?.church_name;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-64 md:h-96">
        <img src={imgSrc} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="container absolute inset-x-0 bottom-6">
          <Link
            to="/events"
            className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Events
          </Link>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-accent text-accent-foreground border-0">{event.event_category}</Badge>
            {event.verified && churchName && (
              <Badge className="bg-primary text-primary-foreground border-0 gap-1">
                <BadgeCheck className="h-3 w-3" /> Official SDA Church Event — {churchName}
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-primary-foreground md:text-4xl">
            {event.title}
          </h1>
          {event.subtitle && (
            <p className="mt-1 text-lg italic text-accent">{event.subtitle}</p>
          )}
        </div>
      </div>

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bible verse */}
            {event.bible_verse && (
              <blockquote className="rounded-xl border border-accent/30 bg-sda-warm-light p-6">
                <BookOpen className="mb-2 h-5 w-5 text-secondary" />
                <p className="text-base italic text-foreground">"{event.bible_verse}"</p>
                <cite className="mt-2 block text-sm font-semibold text-secondary">
                  — {event.bible_reference}
                </cite>
              </blockquote>
            )}

            {/* Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">About This Event</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {event.description}
              </p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: Calendar, label: "Date", value: new Date(event.start_datetime).toLocaleDateString("en-KE", { dateStyle: "medium" }) },
                { icon: Calendar, label: "Time", value: `${new Date(event.start_datetime).toLocaleTimeString("en-KE", { timeStyle: "short" })} — ${new Date(event.end_datetime).toLocaleTimeString("en-KE", { timeStyle: "short" })}` },
                { icon: MapPin, label: "Location", value: event.location_name },
                { icon: Users, label: "Spots Left", value: `${spotsLeft} / ${event.event_capacity}` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-4">
                  <item.icon className="mb-1 h-4 w-4 text-secondary" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Metadata */}
            {(event.ministry_focus || event.age_group) && (
              <div className="flex flex-wrap gap-3">
                {event.ministry_focus && (
                  <Badge variant="secondary" className="text-xs">Ministry: {event.ministry_focus}</Badge>
                )}
                {event.age_group && (
                  <Badge variant="secondary" className="text-xs">Ages: {event.age_group}</Badge>
                )}
              </div>
            )}
          </div>

          {/* Ticket panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-6 shadow-sda">
              <h3 className="text-lg font-bold text-foreground">Secure Your Ticket</h3>

              {tiers.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {tiers.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTier(i)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        selectedTier === i
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">{t.name}</span>
                        <span className="text-sm font-bold text-primary">
                          {t.price === 0 ? "Free" : `${t.currency} ${t.price.toLocaleString()}`}
                        </span>
                      </div>
                      {t.description && (
                        <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No ticket types available yet.</p>
              )}

              {/* Code of conduct checkbox */}
              <div className="mt-6 flex items-start gap-2">
                <Checkbox
                  id="conduct"
                  checked={conductAgreed}
                  onCheckedChange={(v) => setConductAgreed(v === true)}
                  className="mt-0.5"
                />
                <label htmlFor="conduct" className="text-xs leading-relaxed text-muted-foreground">
                  I agree to follow the{" "}
                  <Link to="/code-of-conduct" className="font-medium text-secondary underline">
                    SDA event code of conduct
                  </Link>
                  .
                </label>
              </div>

              <Button
                disabled={!conductAgreed || tiers.length === 0}
                className="mt-4 w-full bg-sda-gradient text-primary-foreground hover:opacity-90 font-semibold"
                size="lg"
              >
                {tier?.price === 0
                  ? "Register for Free"
                  : tier
                  ? `Pay ${tier.currency} ${tier.price.toLocaleString()}`
                  : "No Tickets Available"}
              </Button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Payments via M-Pesa & Card
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetail;
