import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Play, Lock, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  sermon: "Sermon",
  seminar: "Seminar",
  concert: "Concert",
  retreat: "Retreat",
  youth_program: "Youth Program",
};

const StreamDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState(false);

  const { data: stream, isLoading } = useQuery({
    queryKey: ["stream", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*, churches(church_name)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: access } = useQuery({
    queryKey: ["stream-access", id, user?.id],
    enabled: !!id && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stream_access")
        .select("*")
        .eq("stream_id", id!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const hasAccess = stream?.pricing_model === "free" || !!access;
  const isExpired = access?.expires_at && new Date(access.expires_at) < new Date();
  const canWatch = hasAccess && !isExpired;

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please sign in to purchase this stream.");
      return;
    }
    setPurchasing(true);
    try {
      // For free streams, grant immediate access
      if (stream?.pricing_model === "free") {
        const { error } = await supabase.from("stream_access").insert({
          user_id: user.id,
          stream_id: stream.id,
        });
        if (error) throw error;
        toast.success("Access granted!");
        window.location.reload();
      } else {
        // Paid streams would go through payment flow
        toast.info("Payment integration coming soon. Contact the organizer for access.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to get access.");
    } finally {
      setPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Stream not found.</p>
        <Button asChild variant="outline"><Link to="/streams">Back to Streams</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Link to="/streams" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Streams
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Player area */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
              {canWatch && stream.video_url ? (
                <video
                  src={stream.video_url}
                  controls
                  className="h-full w-full object-contain bg-black"
                  poster={stream.thumbnail_url || undefined}
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-sda-gradient text-primary-foreground gap-3">
                  {stream.thumbnail_url && (
                    <img src={stream.thumbnail_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <Lock className="h-10 w-10" />
                    <p className="text-sm font-medium">
                      {stream.pricing_model === "free" ? "Sign in to watch" : `Purchase to unlock (${stream.currency} ${stream.price})`}
                    </p>
                    <Button onClick={handlePurchase} disabled={purchasing} className="rounded-xl gap-2">
                      {stream.pricing_model === "free" ? (
                        <><Play className="h-4 w-4" /> Watch Free</>
                      ) : (
                        <><Lock className="h-4 w-4" /> Buy to Watch</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary">{TYPE_LABELS[stream.stream_type] || stream.stream_type}</Badge>
                {stream.duration_minutes && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {stream.duration_minutes} min</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{stream.title}</h1>
              {(stream as any).churches?.church_name && (
                <p className="mt-1 text-sm text-muted-foreground">{(stream as any).churches.church_name}</p>
              )}
              <p className="mt-4 text-muted-foreground whitespace-pre-line">{stream.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {stream.bible_text && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4 text-accent" /> Scripture</CardTitle></CardHeader>
                <CardContent>
                  <blockquote className="border-l-2 border-accent pl-3 text-sm italic text-muted-foreground">
                    {stream.bible_text}
                  </blockquote>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="text-center">
                  {stream.pricing_model === "free" ? (
                    <p className="text-xl font-bold text-secondary">Free</p>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground">{stream.pricing_model === "rent" ? "Rent" : "Buy"}</span>
                      <p className="text-2xl font-bold text-foreground">{stream.currency} {stream.price}</p>
                      {stream.pricing_model === "rent" && stream.rent_duration_hours && (
                        <p className="text-xs text-muted-foreground">{stream.rent_duration_hours}h access</p>
                      )}
                    </>
                  )}
                </div>
                {!canWatch && (
                  <Button onClick={handlePurchase} disabled={purchasing} className="w-full rounded-xl gap-2">
                    {stream.pricing_model === "free" ? "Get Access" : "Purchase Now"}
                  </Button>
                )}
                {canWatch && (
                  <p className="text-center text-sm text-secondary font-medium">You have access</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamDetail;
