import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, BadgeCheck, ArrowLeft, BookOpen, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EventDetailTicketPanel from "@/components/EventDetailTicketPanel";
import EventShareButton from "@/components/EventShareButton";
import { useEventById } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { getEventImageUrl } from "@/lib/event-image";

const EventDetail = () => {
  const { id } = useParams();
  const { data: event, isLoading } = useEventById(id);
  const { user, profile } = useAuth();

  const profileComplete = !!user && !!profile?.full_name && !!profile?.church_id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
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

  const imgSrc = getEventImageUrl(event.image_url);
  const ticketsSold = event.tickets?.length || 0;
  const spotsLeft = event.event_capacity - ticketsSold;
  const churchName = event.churches?.church_name;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-64 md:h-96">
        <img src={imgSrc} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <div className="container absolute inset-x-0 bottom-6">
          <div className="mb-3 flex items-center justify-between">
            <Link
              to="/events"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-foreground/80 hover:text-primary-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Events
            </Link>
            <EventShareButton
              title={event.title}
              url={window.location.href}
            />
          </div>
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
            {/* Quick info always visible */}
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

            {/* Gated content — requires profile */}
            {profileComplete ? (
              <>
                {/* Bible verse */}
                {event.bible_verse && (
                  <blockquote className="rounded-xl border border-accent/30 bg-accent/10 p-6">
                    <BookOpen className="mb-2 h-5 w-5 text-secondary" />
                    <p className="text-base italic text-foreground">"{event.bible_verse}"</p>
                    <cite className="mt-2 block text-sm font-semibold text-secondary">
                      — {event.bible_reference}
                    </cite>
                  </blockquote>
                )}

                {/* About */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">About This Event</h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
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
              </>
            ) : (
              <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
                <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-bold text-foreground">
                  {user ? "Complete your profile to see full details" : "Sign in to see full details"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Event description, bible verse, and registration options are available after {user ? "completing your profile" : "signing in"}.
                </p>
                <Button asChild className="mt-4 bg-sda-gradient text-primary-foreground hover:opacity-90">
                  <Link to={user ? "/profile" : "/login"}>
                    {user ? "Complete Profile" : "Sign In"}
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Ticket panel */}
          <div className="lg:col-span-1">
            <EventDetailTicketPanel event={event} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetail;
