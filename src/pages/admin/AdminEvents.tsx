import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Eye, Edit, Trash2, ScanLine } from "lucide-react";
import { toast } from "sonner";

const AdminEvents = () => {
  const { user, roles } = useAuth();
  const isAdmin = roles.includes("admin");

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["admin-events", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const query = supabase
        .from("events")
        .select(`*, churches ( church_name ), tickets ( id )`)
        .order("created_at", { ascending: false });

      // church_admin only sees own events; admin sees all
      if (!isAdmin) {
        query.eq("organizer_id", user!.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete event");
    } else {
      toast.success("Event deleted");
      refetch();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Events</h1>
        <Button asChild className="bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2">
          <Link to="/admin/create-event">
            <Plus className="h-4 w-4" /> Create Event
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
                  <Badge variant={event.event_status === "published" ? "default" : "secondary"} className="text-xs">
                    {event.event_status}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.start_datetime).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.tickets?.length || 0} / {event.event_capacity}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link to={`/events/${event.id}`}><Eye className="h-3.5 w-3.5" /> View</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link to={`/admin/edit-event/${event.id}`}><Edit className="h-3.5 w-3.5" /> Edit</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link to={`/admin/check-in/${event.id}`}><ScanLine className="h-3.5 w-3.5" /> Check-in</Link>
                </Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(event.id, event.title)}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No events yet.</p>
          <Button asChild className="mt-4 bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2">
            <Link to="/admin/create-event"><Plus className="h-4 w-4" /> Create Your First Event</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
