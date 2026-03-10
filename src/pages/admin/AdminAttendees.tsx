import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Ticket } from "lucide-react";

const AdminAttendees = () => {
  const { user, roles } = useAuth();
  const isAdmin = roles.includes("admin");
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const { data: events } = useQuery({
    queryKey: ["admin-events-list", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const query = supabase.from("events").select("id, title").order("start_datetime", { ascending: false });
      if (!isAdmin) query.eq("organizer_id", user!.id);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin-attendees", selectedEvent],
    enabled: !!selectedEvent,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select(`*, profiles:user_id ( full_name, email ), ticket_types ( name )`)
        .eq("event_id", selectedEvent)
        .order("purchased_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Attendees</h1>

      <div className="mb-6 max-w-sm">
        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Select Event</label>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an event..." />
          </SelectTrigger>
          <SelectContent>
            {events?.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedEvent ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">Select an event to view attendees.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ticket</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((t: any) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{t.profiles?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{t.profiles?.email || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.ticket_types?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={t.ticket_status === "valid" ? "default" : "secondary"} className="text-xs">
                      {t.ticket_status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Ticket className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No attendees for this event yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAttendees;
