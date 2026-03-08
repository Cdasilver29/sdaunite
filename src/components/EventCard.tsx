import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DbEvent } from "@/hooks/useEvents";
import heroSingles from "@/assets/hero-singles-fellowship.jpg";
import heroHike from "@/assets/hero-youth-hike.jpg";
import heroService from "@/assets/hero-service-mission.jpg";

const IMAGE_MAP: Record<string, string> = {
  "singles-fellowship": heroSingles,
  "youth-hike": heroHike,
  "service-mission": heroService,
};

const EventCard = ({ event }: { event: DbEvent }) => {
  const imgSrc = (event.image_url && IMAGE_MAP[event.image_url]) || heroSingles;
  const lowestPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map((t) => t.price))
    : 0;
  const ticketsSold = event.tickets?.length || 0;
  const spotsLeft = event.event_capacity - ticketsSold;

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sda transition-all hover:shadow-sda-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imgSrc}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge className="bg-accent text-accent-foreground border-0 text-xs font-semibold">
            {event.event_category}
          </Badge>
          {event.verified && (
            <Badge className="bg-primary text-primary-foreground border-0 text-xs gap-1">
              <BadgeCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-bold text-foreground leading-tight line-clamp-2">
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="text-xs font-medium italic text-secondary">{event.subtitle}</p>
        )}

        <div className="mt-auto flex flex-col gap-1.5 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              {new Date(event.start_datetime).toLocaleDateString("en-KE", { dateStyle: "medium" })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{event.location_name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : "Sold out"}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-bold text-primary">
            {lowestPrice === 0 ? "Free" : `From KSh ${lowestPrice.toLocaleString()}`}
          </span>
          <span className="text-xs font-semibold text-secondary group-hover:underline">
            Secure Your Ticket →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
