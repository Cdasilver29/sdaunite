import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Ticket, QrCode, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_COLORS: Record<string, string> = {
  valid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  checked_in: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  cancelled: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
};

const MyTickets = () => {
  const { user } = useAuth();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["my-tickets", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          events ( id, title, start_datetime, location_name, city ),
          ticket_types ( name, price, currency )
        `)
        .eq("user_id", user!.id)
        .order("purchased_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader
        title="My Tickets"
        subtitle="Your event tickets and QR codes in one place."
      />

      <section className="py-12">
        <div className="container max-w-3xl">
          {!user ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <Ticket className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 font-medium text-foreground">
                Sign in to view your tickets
              </p>
              <Button asChild className="mt-4 bg-sda-gradient text-primary-foreground hover:opacity-90">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : !tickets || tickets.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <Ticket className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 font-medium text-foreground">
                No tickets yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse events and register to see your tickets here.
              </p>
              <Button asChild className="mt-4 bg-sda-gradient text-primary-foreground hover:opacity-90">
                <Link to="/events">Explore Events</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sda sm:flex-row sm:items-center"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <QrCode className="h-10 w-10 text-muted-foreground/60" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/events/${ticket.events?.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {ticket.events?.title ?? "Event"}
                    </Link>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {ticket.events?.start_datetime && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(ticket.events.start_datetime), "MMM d, yyyy · h:mm a")}
                        </span>
                      )}
                      {ticket.events?.location_name && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ticket.events.location_name}, {ticket.events.city}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {ticket.ticket_types?.name} · {ticket.ticket_types?.currency} {ticket.ticket_types?.price}
                    </p>
                  </div>

                  <Badge className={STATUS_COLORS[ticket.ticket_status] ?? "bg-muted text-muted-foreground"}>
                    {ticket.ticket_status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyTickets;
