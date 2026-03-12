import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trash2, Image } from "lucide-react";
import { toast } from "sonner";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const AdminXperience = () => {
  const { user } = useAuth();

  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ["admin-xperience-photos"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xperience_photos")
        .select("*, events ( title )")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const toggleApproval = async (id: string, current: boolean) => {
    const updates: any = { approved: !current };
    if (!current) updates.approved_by = user!.id;
    const { error } = await supabase.from("xperience_photos").update(updates).eq("id", id);
    if (error) toast.error("Failed to update");
    else { toast.success(current ? "Unapproved" : "Approved"); refetch(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("xperience_photos").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Photo deleted"); refetch(); }
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `${SUPABASE_URL}/storage/v1/object/public/xperience-photos/${url}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Xperience Photo Approvals</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />)}</div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="relative h-40">
                <img src={getImageUrl(p.image_url)} alt={p.caption || "Xperience photo"} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge variant={p.approved ? "default" : "destructive"} className="text-xs">
                    {p.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-foreground truncate">{p.events?.title || "Unknown event"}</p>
                {p.caption && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.caption}</p>}
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => toggleApproval(p.id, p.approved)} className="flex-1 gap-1">
                    {p.approved ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    {p.approved ? "Reject" : "Approve"}
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Image className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No photos uploaded yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminXperience;
