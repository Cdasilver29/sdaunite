import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Mountain } from "lucide-react";
import { toast } from "sonner";

const AdminRetreats = () => {
  const { user, roles } = useAuth();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");

  const { data: retreats, isLoading, refetch } = useQuery({
    queryKey: ["admin-retreats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const query = supabase
        .from("retreats")
        .select("*")
        .order("created_at", { ascending: false });
      if (!isAdmin) query.eq("organizer_id", user!.id);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete retreat "${title}"?`)) return;
    const { error } = await supabase.from("retreats").delete().eq("id", id);
    if (error) toast.error("Failed to delete retreat");
    else { toast.success("Retreat deleted"); refetch(); }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "published" ? "draft" : "published";
    const { error } = await supabase.from("retreats").update({ retreat_status: next }).eq("id", id);
    if (error) toast.error("Failed to update status");
    else { toast.success(`Retreat ${next}`); refetch(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Retreats</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />)}</div>
      ) : retreats && retreats.length > 0 ? (
        <div className="space-y-4">
          {retreats.map((r) => (
            <div key={r.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Mountain className="h-4 w-4 text-secondary" />
                  <h3 className="font-semibold text-foreground truncate">{r.title}</h3>
                  <Badge variant={r.retreat_status === "published" ? "default" : "secondary"} className="text-xs">{r.retreat_status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.location_name}, {r.city} · {new Date(r.start_date).toLocaleDateString()} – {new Date(r.end_date).toLocaleDateString()} · KES {Number(r.starting_price || 0).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleStatus(r.id, r.retreat_status)}>
                  {r.retreat_status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button asChild variant="outline" size="sm"><a href={`/retreats/${r.id}`} target="_blank"><Eye className="h-3.5 w-3.5" /></a></Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(r.id, r.title)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No retreats yet. Add seed data or create one.</p>
        </div>
      )}
    </div>
  );
};

export default AdminRetreats;
