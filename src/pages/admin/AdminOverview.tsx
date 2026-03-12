import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Users, Ticket, DollarSign, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useMemo } from "react";

const AdminOverview = () => {
  const { user, profile, roles } = useAuth();
  const isAdmin = roles.includes("admin");

  // Fetch stats + raw ticket data for charts
  const { data } = useQuery({
    queryKey: ["admin-overview", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // Event count
      const eventsQ = supabase.from("events").select("id, title, event_category, event_capacity, start_datetime, event_status");
      if (!isAdmin) eventsQ.eq("organizer_id", user!.id);
      const { data: events, error: evErr } = await eventsQ;
      if (evErr) throw evErr;

      // Tickets
      const { data: tickets, error: tkErr } = await supabase
        .from("tickets")
        .select("id, purchased_at, event_id, ticket_status");
      if (tkErr) throw tkErr;

      // Payments (completed)
      const { data: payments, error: pyErr } = await supabase
        .from("payments")
        .select("id, amount, paid_at, payment_status")
        .eq("payment_status", "completed");
      if (pyErr) throw pyErr;

      return { events: events || [], tickets: tickets || [], payments: payments || [] };
    },
  });

  const events = data?.events || [];
  const tickets = data?.tickets || [];
  const payments = data?.payments || [];

  // KPI cards
  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
  const cards = [
    { label: "Total Events", value: events.length, icon: CalendarDays, color: "text-secondary" },
    { label: "Tickets Sold", value: tickets.length, icon: Ticket, color: "text-accent" },
    { label: "Revenue (KES)", value: totalRevenue.toLocaleString(), icon: DollarSign, color: "text-emerald-500" },
    { label: "Published", value: events.filter((e) => e.event_status === "published").length, icon: TrendingUp, color: "text-primary" },
  ];

  // Ticket sales over time (last 12 months)
  const ticketTrend = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString("en", { month: "short", year: "2-digit" }),
      });
    }
    const counts: Record<string, number> = {};
    tickets.forEach((t) => {
      const d = new Date(t.purchased_at);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      counts[k] = (counts[k] || 0) + 1;
    });
    return months.map((m) => ({ name: m.label, tickets: counts[m.key] || 0 }));
  }, [tickets]);

  // Revenue over time
  const revenueTrend = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString("en", { month: "short", year: "2-digit" }),
      });
    }
    const sums: Record<string, number> = {};
    payments.forEach((p) => {
      if (!p.paid_at) return;
      const d = new Date(p.paid_at);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      sums[k] = (sums[k] || 0) + Number(p.amount);
    });
    return months.map((m) => ({ name: m.label, revenue: sums[m.key] || 0 }));
  }, [payments]);

  // Events by category (pie)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      counts[e.event_category] = (counts[e.event_category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [events]);

  const PIE_COLORS = [
    "hsl(202, 100%, 25%)",
    "hsl(36, 75%, 55%)",
    "hsl(160, 50%, 45%)",
    "hsl(270, 50%, 55%)",
    "hsl(10, 70%, 55%)",
    "hsl(200, 60%, 50%)",
    "hsl(45, 80%, 50%)",
  ];

  // Attendance per event (bar) — top 8 events by ticket count
  const attendanceByEvent = useMemo(() => {
    const countMap: Record<string, number> = {};
    tickets.forEach((t) => {
      countMap[t.event_id] = (countMap[t.event_id] || 0) + 1;
    });
    return events
      .map((e) => ({ name: e.title.length > 18 ? e.title.slice(0, 18) + "…" : e.title, attendees: countMap[e.id] || 0, capacity: e.event_capacity }))
      .sort((a, b) => b.attendees - a.attendees)
      .slice(0, 8);
  }, [events, tickets]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {profile?.full_name || "Admin"}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your events and registrations</p>
        </div>
        <Button asChild className="bg-sda-gradient text-primary-foreground hover:opacity-90 gap-2">
          <Link to="/admin/create-event"><Plus className="h-4 w-4" /> Create Event</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg bg-muted p-2.5 ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-xl font-bold text-foreground">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Ticket Trend + Revenue Trend */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Ticket Sales (12 months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={ticketTrend}>
              <defs>
                <linearGradient id="ticketGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(202, 100%, 25%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(202, 100%, 25%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 80% / 0.3)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="tickets" stroke="hsl(202, 100%, 25%)" fill="url(#ticketGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Trend (KES)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 50%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 50%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 80% / 0.3)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`KES ${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(160, 50%, 45%)" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Categories Pie + Attendance Bar */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Events by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-sm text-muted-foreground">No events yet</div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Attendance by Event</h3>
          {attendanceByEvent.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={attendanceByEvent} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 80% / 0.3)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(0 0% 60%)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(0 0% 60%)" width={100} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="attendees" fill="hsl(36, 75%, 55%)" radius={[0, 4, 4, 0]} barSize={18} />
                <Bar dataKey="capacity" fill="hsl(0 0% 85%)" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-sm text-muted-foreground">No attendance data</div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <Link to="/admin/retreats" className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group">
          <TrendingUp className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <h3 className="font-semibold text-foreground">Manage Retreats</h3>
          <p className="text-sm text-muted-foreground mt-1">Publish and manage retreat escapes</p>
        </Link>
        <Link to="/admin/blog" className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group">
          <CalendarDays className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <h3 className="font-semibold text-foreground">Blog Articles</h3>
          <p className="text-sm text-muted-foreground mt-1">Publish insider blog content</p>
        </Link>
        <Link to="/admin/streams" className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group">
          <Ticket className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <h3 className="font-semibold text-foreground">Streams</h3>
          <p className="text-sm text-muted-foreground mt-1">Approve and manage video streams</p>
        </Link>
        <Link to="/admin/xperience" className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group">
          <Users className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <h3 className="font-semibold text-foreground">Xperience Photos</h3>
          <p className="text-sm text-muted-foreground mt-1">Review and approve gallery photos</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminOverview;
