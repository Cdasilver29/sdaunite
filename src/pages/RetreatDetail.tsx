import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { MapPin, Calendar, Users, Utensils, Bus, Home as HomeIcon, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RetreatDetail = () => {
  const { id } = useParams();

  const { data: retreat, isLoading } = useQuery({
    queryKey: ["retreat", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retreats")
        .select("*, churches(church_name)")
        .eq("id", id!)
        .single();
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

  if (!retreat) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Retreat not found.</p>
      </div>
    );
  }

  const schedule = Array.isArray(retreat.schedule) ? retreat.schedule : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px]">
        <img
          src={retreat.image_url || "/images/sda-retreats-hikes.jpg"}
          alt={retreat.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <Badge className="bg-accent text-accent-foreground mb-3">Retreat Escape</Badge>
            <h1 className="text-3xl font-bold text-foreground md:text-5xl">{retreat.title}</h1>
            {retreat.subtitle && <p className="mt-2 text-lg text-muted-foreground">{retreat.subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>About This Retreat</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{retreat.description}</p>
                {retreat.spiritual_objective && (
                  <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <BookOpen className="h-4 w-4 text-accent" /> Spiritual Focus
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{retreat.spiritual_objective}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader><CardTitle>What's Included</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {retreat.includes_accommodation && (
                    <div className="flex items-center gap-2 rounded-lg border p-3">
                      <HomeIcon className="h-5 w-5 text-secondary" />
                      <span className="text-sm font-medium">Accommodation</span>
                    </div>
                  )}
                  {retreat.includes_meals && (
                    <div className="flex items-center gap-2 rounded-lg border p-3">
                      <Utensils className="h-5 w-5 text-secondary" />
                      <span className="text-sm font-medium">Meals</span>
                    </div>
                  )}
                  {retreat.includes_transport && (
                    <div className="flex items-center gap-2 rounded-lg border p-3">
                      <Bus className="h-5 w-5 text-secondary" />
                      <span className="text-sm font-medium">Transport</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            {schedule.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedule.map((item: any, i: number) => (
                      <div key={i} className="flex gap-3 rounded-lg border p-3">
                        <div className="text-xs font-semibold text-secondary min-w-[60px]">{item.time || `Day ${i + 1}`}</div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.title || item.activity}</p>
                          {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  {retreat.starting_price > 0 ? (
                    <div>
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <p className="text-3xl font-bold text-foreground">{retreat.currency} {retreat.starting_price.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-secondary">Free</p>
                  )}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {format(new Date(retreat.start_date), "MMM d")} – {format(new Date(retreat.end_date), "MMM d, yyyy")}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {retreat.location_name}, {retreat.city}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {retreat.capacity} spots</div>
                </div>
                {(retreat as any).churches?.church_name && (
                  <p className="text-xs text-muted-foreground">Organized by {(retreat as any).churches.church_name}</p>
                )}
                <Button className="w-full rounded-xl" size="lg">Register Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetreatDetail;
