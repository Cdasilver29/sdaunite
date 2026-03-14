import { Link } from "react-router-dom";
import { Calendar, MapPin, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DbEvent } from "@/hooks/useEvents";
import { getEventImageUrl } from "@/lib/event-image";
import { useToast } from "@/hooks/use-toast";

const EventCard = ({ event }: { event: DbEvent }) => {
  const { toast } = useToast();
  const imgSrc = getEventImageUrl(event.image_url, event.event_category);
  const lowestPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map((t) => t.price))
    : 0;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!" });
  };

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-sda-lg hover:-translate-y-1"
    >
      {/* Image - compact aspect ratio */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imgSrc}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        <Badge className="absolute top-2.5 left-2.5 bg-accent text-accent-foreground border-0 text-[10px] font-semibold">
          {event.event_category}
        </Badge>
        {/* Share icon */}
        <button
          onClick={handleShare}
          className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white"
          aria-label="Share event"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content - compact */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>
            {new Date(event.start_datetime).toLocaleDateString("en-KE", { dateStyle: "medium" })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.location_name}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5 mt-2">
          <span className="text-xs font-bold text-primary">
            {lowestPrice === 0 ? "Free" : `From KSh ${lowestPrice.toLocaleString()}`}
          </span>
          <span className="text-[11px] font-semibold text-secondary group-hover:underline">
            Get Ticket →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
