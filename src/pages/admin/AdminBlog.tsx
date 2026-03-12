import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, BookOpen, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

const AdminBlog = () => {
  const { user } = useAuth();

  const { data: articles, isLoading, refetch } = useQuery({
    queryKey: ["admin-blog"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("blog_articles").update({ published: !current }).eq("id", id);
    if (error) toast.error("Failed to update");
    else { toast.success(current ? "Unpublished" : "Published"); refetch(); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from("blog_articles").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Deleted"); refetch(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Blog Articles</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}</div>
      ) : articles && articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((a) => (
            <div key={a.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <BookOpen className="h-4 w-4 text-secondary" />
                  <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
                  <Badge variant={a.published ? "default" : "secondary"} className="text-xs">{a.published ? "Published" : "Draft"}</Badge>
                  <Badge variant="outline" className="text-xs">{a.category}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{a.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => togglePublished(a.id, a.published)} className="gap-1">
                  {a.published ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                  {a.published ? "Unpublish" : "Publish"}
                </Button>
                <Button asChild variant="outline" size="sm"><a href={`/insider/${a.slug}`} target="_blank"><Eye className="h-3.5 w-3.5" /></a></Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(a.id, a.title)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No articles yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
