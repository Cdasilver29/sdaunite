import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganizerEvents } from "@/hooks/useEvents";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Eye, Edit, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const { user, profile, roles } = useAuth();
  const { data: events, isLoading } = useOrganizerEvents(user?.id);

  const isOrganizer = roles.includes("organizer") || roles.includes("admin");

  return (
    <div className="min-h-screen bg-background">
      

      <PageHeader
        title={`Welcome, ${profile?.full_name || "Organizer"}`}
        subtitle="Manage your events and registrations"
        icon={<LayoutDashboard className="h-6 w-6 text-primary-foreground" />}
      />

      <div className="container py-10">
        {isOrganizer && (
          <div className="mb-6 flex justify-end">
            <Button asChild className="bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2">
              <Link to="/dashboard/create-event">
                <Plus className="h-4 w-4" /> Create Event
              </Link>
            </Button>
          </div>
        )}

        {!isOrganizer && (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sda">
            <h2 className="text-lg font-semibold text-foreground">Want to organize events?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact your church administrator to be granted organizer privileges.
            </p>
          </div>
        )}

        {isOrganizer && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Your Events</h2>

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
                    className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sda sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        <Badge
                          variant={event.event_status === "published" ? "default" : "secondary"}
                          className="text-xs"
                        >
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
                          {event.tickets?.length || 0} / {event.event_capacity} registered
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="gap-1">
                        <Link to={`/events/${event.id}`}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="gap-1">
                        <Link to={`/dashboard/edit-event/${event.id}`}>
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">No events created yet.</p>
                <Button asChild className="mt-4 bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2">
                  <Link to="/dashboard/create-event">
                    <Plus className="h-4 w-4" /> Create Your First Event
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Dashboard;
