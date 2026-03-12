import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Video, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const AdminStreams = () => {
  const { user, roles } = useAuth();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");

  const { data: streams, isLoading, refetch } = useQuery({
    queryKey: ["admin-streams"],
    enabled: !!user,
    queryFn: async () => {
      const query = supabase.from("streams").select("*").order("created_at", { ascending: false });
      if (!isAdmin) query.eq("organizer_id", user!.id);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const toggleApproval = async (id: string, current: boolean) => {
    const { error } = await supabase.from("streams").update({ approved: !current }).eq("id", id);
    if (error) toast.error("Failed to update");
    else { toast.success(current ? "Unapproved" : "Approved"); refetch(); }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "published" ? "draft" : "published";
    const { error } = await supabase.from("streams").update({ stream_status: next }).eq("id", id);
    if (error) toast.error("Failed to update");
    else { toast.success(`Stream ${next}`); refetch(); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete stream "${title}"?`)) return;
    const { error } = await supabase.from("streams").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Deleted"); refetch(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Streams</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}</div>
      ) : streams && streams.length > 0 ? (
        <div className="space-y-4">
          {streams.map((s) => (
            <div key={s.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Video className="h-4 w-4 text-secondary" />
                  <h3 className="font-semibold text-foreground truncate">{s.title}</h3>
                  <Badge variant={s.stream_status === "published" ? "default" : "secondary"} className="text-xs">{s.stream_status}</Badge>
                  <Badge variant={s.approved ? "default" : "destructive"} className="text-xs">{s.approved ? "Approved" : "Pending"}</Badge>
                  <Badge variant="outline" className="text-xs">{s.pricing_model} · {s.stream_type}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.duration_minutes ? `${s.duration_minutes} min` : "Duration N/A"} · {s.price > 0 ? `KES ${Number(s.price).toLocaleString()}` : "Free"}</p>
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => toggleApproval(s.id, s.approved)} className="gap-1">
                    {s.approved ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    {s.approved ? "Unapprove" : "Approve"}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => toggleStatus(s.id, s.stream_status)}>
                  {s.stream_status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button asChild variant="outline" size="sm"><a href={`/streams/${s.id}`} target="_blank"><Eye className="h-3.5 w-3.5" /></a></Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(s.id, s.title)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No streams yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminStreams;
