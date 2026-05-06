import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ScanLine,
  Keyboard,
  Users,
  Loader2,
  Mail,
} from "lucide-react";
import { format } from "date-fns";

type ScanResult = {
  ok: boolean;
  reason?: string;
  attendee_name?: string | null;
  attendee_email?: string | null;
  ticket_type?: string | null;
  scanned_at?: string;
};

const REASON_LABEL: Record<string, string> = {
  invalid_token: "Invalid QR code",
  not_found: "Ticket not found",
  bad_signature: "QR signature invalid",
  wrong_event: "Ticket is for a different event",
  forbidden: "You can't scan this event",
  ticket_invalid: "Ticket cancelled or refunded",
  already_checked_in: "Already checked in",
  event_missing: "Event not found",
};

const CheckIn = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { user, roles, loading } = useAuth();
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [manualValue, setManualValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<ScanResult | null>(null);
  const cooldownRef = useRef<Map<string, number>>(new Map());

  const isPrivileged =
    roles.includes("admin") ||
    roles.includes("super_admin") ||
    roles.includes("organizer") ||
    roles.includes("church_admin");

  const { data: event, isLoading: evLoading } = useQuery({
    queryKey: ["checkin-event", eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, start_datetime, location_name, city, organizer_id, event_capacity")
        .eq("id", eventId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["checkin-stats", eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const [{ count: checkedIn }, { count: tickets }] = await Promise.all([
        supabase
          .from("event_checkins")
          .select("id", { count: "exact", head: true })
          .eq("event_id", eventId!),
        supabase
          .from("tickets")
          .select("id", { count: "exact", head: true })
          .eq("event_id", eventId!),
      ]);
      return { checkedIn: checkedIn ?? 0, tickets: tickets ?? 0 };
    },
  });

  // Realtime updates
  useEffect(() => {
    if (!eventId) return;
    const channel = supabase
      .channel(`checkins-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "event_checkins",
          filter: `event_id=eq.${eventId}`,
        },
        () => refetchStats(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, refetchStats]);

  const canAccess = useMemo(() => {
    if (!event || !user) return false;
    return isPrivileged || event.organizer_id === user.id;
  }, [event, user, isPrivileged]);

  const submit = async (token: string) => {
    if (!token || busy) return;
    const now = Date.now();
    const last = cooldownRef.current.get(token);
    if (last && now - last < 3000) return;
    cooldownRef.current.set(token, now);

    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-checkin", {
        body: { token: token.trim(), event_id: eventId },
      });
      if (error) throw error;
      const r = data as ScanResult;
      setLast(r);
      if (r.ok) {
        toast.success(`Checked in: ${r.attendee_name ?? "attendee"}`);
        refetchStats();
      } else {
        toast.error(REASON_LABEL[r.reason ?? ""] ?? r.reason ?? "Scan failed");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Scan failed");
    } finally {
      setBusy(false);
    }
  };

  // Email export dialog state
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);
  const [emailTo, setEmailTo] = useState("");
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.email) setEmailTo((cur) => cur || profile.email!);
  }, [profile?.email]);

  const { data: ticketTypes } = useQuery({
    queryKey: ["checkin-ticket-types", eventId],
    enabled: !!eventId && exportOpen,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_types")
        .select("id, name")
        .eq("event_id", eventId!)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggleType = (id: string) => {
    setSelectedTypeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const sendExport = async () => {
    if (!eventId) return;
    if (!emailTo.trim()) {
      toast.error("Add a recipient email");
      return;
    }
    setExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("export-checkins", {
        body: {
          event_id: eventId,
          ticket_type_ids: selectedTypeIds.length ? selectedTypeIds : undefined,
          email_to: emailTo.trim(),
        },
      });
      if (error) throw error;
      if (!data?.ok) {
        toast.error(data?.reason ?? "Export failed");
        return;
      }
      if (data.email_sent) {
        toast.success(
          `Sent to ${data.recipient}. The secure link expires in 24 hours.`,
        );
      } else if (data.download_url) {
        toast.success("Export ready. Opening download…");
        window.open(data.download_url, "_blank", "noopener,noreferrer");
      } else {
        toast.success("Export ready.");
      }
      setExportOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Export failed");
    } finally {
      setExporting(false);
    }
  };

  if (loading || evLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/sign-in" replace />;
  if (!event) return <Navigate to="/admin/events" replace />;
  if (!canAccess) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">You don't have access to scan this event.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/admin/events">Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1">
        <Link to="/admin/events"><ArrowLeft className="h-4 w-4" /> Back to events</Link>
      </Button>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">{event.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {format(new Date(event.start_datetime), "EEE, MMM d · h:mm a")} ·{" "}
          {event.location_name}, {event.city}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            {stats?.checkedIn ?? 0} / {stats?.tickets ?? 0} checked in
          </Badge>
          <span className="text-xs text-muted-foreground">
            Capacity {event.event_capacity}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1"
            onClick={exportCsv}
            disabled={exporting || !stats?.checkedIn}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button
          variant={mode === "camera" ? "default" : "outline"}
          size="sm"
          className="gap-1"
          onClick={() => setMode("camera")}
        >
          <ScanLine className="h-4 w-4" /> Camera
        </Button>
        <Button
          variant={mode === "manual" ? "default" : "outline"}
          size="sm"
          className="gap-1"
          onClick={() => setMode("manual")}
        >
          <Keyboard className="h-4 w-4" /> Manual
        </Button>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        {mode === "camera" ? (
          <div className="overflow-hidden rounded-lg bg-black aspect-square max-w-md mx-auto">
            <Scanner
              onScan={(codes) => {
                const v = codes?.[0]?.rawValue;
                if (v) submit(v);
              }}
              onError={() => {}}
              constraints={{ facingMode: "environment" }}
              styles={{ container: { width: "100%", height: "100%" } }}
            />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(manualValue);
              setManualValue("");
            }}
            className="flex gap-2"
          >
            <Input
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
              placeholder="Paste ticket code (ticketId.signature)"
              autoFocus
            />
            <Button type="submit" disabled={busy || !manualValue.trim()}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
            </Button>
          </form>
        )}
      </div>

      {last && (
        <div
          className={`mt-4 rounded-xl border p-5 shadow-sm ${
            last.ok
              ? "border-green-500/40 bg-green-500/5"
              : "border-destructive/40 bg-destructive/5"
          }`}
        >
          <div className="flex items-start gap-3">
            {last.ok ? (
              <CheckCircle2 className="h-8 w-8 shrink-0 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 shrink-0 text-destructive" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                {last.ok
                  ? "Checked in"
                  : REASON_LABEL[last.reason ?? ""] ?? last.reason}
              </p>
              {last.attendee_name && (
                <p className="text-sm text-muted-foreground">
                  {last.attendee_name}
                  {last.attendee_email ? ` · ${last.attendee_email}` : ""}
                </p>
              )}
              {last.ticket_type && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {last.ticket_type}
                </p>
              )}
              {last.scanned_at && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {format(new Date(last.scanned_at), "PPpp")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckIn;
