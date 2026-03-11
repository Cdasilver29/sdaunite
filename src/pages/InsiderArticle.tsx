import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const InsiderArticle = () => {
  const { slug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ["blog-article", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch related events
  const { data: relatedEvents = [] } = useQuery({
    queryKey: ["related-events", article?.related_event_ids],
    enabled: !!article?.related_event_ids?.length,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, start_datetime, image_url, city")
        .in("id", article!.related_event_ids)
        .eq("event_status", "published");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Article not found.</p>
        <Button asChild variant="outline"><Link to="/insider">Back to Insider</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {article.image_url && (
        <div className="relative h-[40vh] min-h-[280px]">
          <img src={article.image_url} alt={article.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      )}

      <article className="container max-w-3xl py-10">
        <Link to="/insider" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Insider
        </Link>

        <Badge variant="secondary" className="mb-3">{article.category}</Badge>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{article.title}</h1>
        <p className="mt-3 text-muted-foreground">{format(new Date(article.created_at), "MMMM d, yyyy")}</p>

        <div className="mt-8 prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </article>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="container max-w-3xl pb-16">
          <h3 className="text-xl font-bold text-foreground mb-4">Related Events</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedEvents.map((event: any) => (
              <Link key={event.id} to={`/events/${event.id}`} className="flex gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <img src={event.image_url || "/images/sda-hero.jpg"} alt={event.title} className="h-16 w-16 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(event.start_datetime), "MMM d, yyyy")} · {event.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default InsiderArticle;
