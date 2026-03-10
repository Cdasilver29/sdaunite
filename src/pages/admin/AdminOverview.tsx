import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Users, Ticket, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminOverview = () => {
  const { user, profile, roles } = useAuth();
  const isAdmin = roles.includes("admin");

  const { data: stats } = useQuery({
    queryKey: ["admin-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const eventsQuery = supabase.from("events").select("id", { count: "exact", head: true });
      if (!isAdmin) eventsQuery.eq("organizer_id", user!.id);
      const { count: eventCount } = await eventsQuery;

      const ticketsQuery = supabase.from("tickets").select("id, event_id", { count: "exact", head: true });
      // tickets are visible via RLS for organizers
      const { count: ticketCount } = await ticketsQuery;

      return { events: eventCount || 0, tickets: ticketCount || 0 };
    },
  });

  const cards = [
    { label: "Total Events", value: stats?.events ?? "—", icon: CalendarDays, color: "text-secondary" },
    { label: "Total Tickets", value: stats?.tickets ?? "—", icon: Ticket, color: "text-accent" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {profile?.full_name || "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your events and registrations</p>
        </div>
        <Button asChild className="bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2">
          <Link to="/admin/create-event"><Plus className="h-4 w-4" /> Create Event</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-muted p-2.5 ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin/events" className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group">
          <CalendarDays className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <h3 className="font-semibold text-foreground">Manage Events</h3>
          <p className="text-sm text-muted-foreground mt-1">Create, edit, and manage your events</p>
        </Link>
        <Link to="/admin/attendees" className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group">
          <Users className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <h3 className="font-semibold text-foreground">View Attendees</h3>
          <p className="text-sm text-muted-foreground mt-1">See who's registered for each event</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminOverview;
