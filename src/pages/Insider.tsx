import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["All", "Faith", "Service", "Retreats", "Youth Life"];

const useBlogArticles = () =>
  useQuery({
    queryKey: ["blog-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

const Insider = () => {
  const { data: articles = [], isLoading } = useBlogArticles();
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? articles : articles.filter((a: any) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">

      <section id="articles" className="container pt-4 pb-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-foreground">No articles yet</h3>
            <p className="mt-2 text-muted-foreground">Check back soon for inspiring content.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article: any, i: number) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="overflow-hidden group hover:shadow-sda-lg transition-shadow h-full flex flex-col">
                  {article.image_url && (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-5 flex flex-col flex-1">
                    <Badge variant="secondary" className="self-start mb-2 text-xs">{article.category}</Badge>
                    <h3 className="text-lg font-bold text-foreground line-clamp-2">{article.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{article.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{format(new Date(article.created_at), "MMM d, yyyy")}</span>
                      <Link
                        to={`/insider/${article.slug}`}
                        className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-primary transition-colors"
                      >
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Insider;
