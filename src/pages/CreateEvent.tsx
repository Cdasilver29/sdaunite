import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useChurches } from "@/hooks/useChurches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import EventImageUpload from "@/components/EventImageUpload";
import { CATEGORIES } from "@/lib/events-data";
import { Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type TicketTierForm = { name: string; price: string; currency: string; description: string; quantity: string };

const emptyTier = (): TicketTierForm => ({
  name: "", price: "0", currency: "KES", description: "", quantity: "100",
});

const CreateEvent = () => {
  const { user } = useAuth();
  const { data: churches } = useChurches();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("Nairobi");
  const [churchId, setChurchId] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [capacity, setCapacity] = useState("100");
  const [ministryFocus, setMinistryFocus] = useState("");
  const [bibleVerse, setBibleVerse] = useState("");
  const [bibleReference, setBibleReference] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tiers, setTiers] = useState<TicketTierForm[]>([emptyTier()]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const updateTier = (idx: number, field: keyof TicketTierForm, value: string) => {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !category) return;
    setSaving(true);

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .insert({
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        description: description.trim(),
        event_category: category as any,
        organizer_id: user.id,
        location_name: locationName.trim(),
        city: city.trim(),
        church_id: churchId || null,
        start_datetime: new Date(startDatetime).toISOString(),
        end_datetime: new Date(endDatetime).toISOString(),
        event_capacity: parseInt(capacity) || 100,
        event_status: status,
        ministry_focus: ministryFocus.trim() || null,
        bible_verse: bibleVerse.trim() || null,
        bible_reference: bibleReference.trim() || null,
        age_group: ageGroup.trim() || null,
        image_url: imageUrl,
      })
      .select("id")
      .single();

    if (eventError) {
      toast({ variant: "destructive", title: "Error creating event", description: eventError.message });
      setSaving(false);
      return;
    }

    const validTiers = tiers.filter((t) => t.name.trim());
    if (validTiers.length > 0) {
      const { error: tierError } = await supabase.from("ticket_types").insert(
        validTiers.map((t) => ({
          event_id: eventData.id,
          name: t.name.trim(),
          price: parseFloat(t.price) || 0,
          currency: t.currency || "KES",
          description: t.description.trim() || null,
          quantity_available: parseInt(t.quantity) || 100,
        }))
      );
      if (tierError) {
        toast({ variant: "destructive", title: "Event created but ticket tiers failed", description: tierError.message });
      }
    }

    queryClient.invalidateQueries({ queryKey: ["events"] });
    toast({ title: "Event created!", description: `"${title}" has been saved as ${status}.` });
    navigate("/dashboard");
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-foreground">Create New Event</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fill in the details for your SDA event</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Banner Image */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sda">
              <EventImageUpload imageUrl={imageUrl} onImageUrlChange={setImageUrl} />
            </div>

            {/* Basic Info */}
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sda">
              <h2 className="text-lg font-semibold text-foreground">Event Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Subtitle</Label>
                  <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} maxLength={200} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description *</Label>
                  <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={5000} />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.label} value={c.label}>{c.icon} {c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location & Time */}
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sda">
              <h2 className="text-lg font-semibold text-foreground">Location & Schedule</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location Name *</Label>
                  <Input value={locationName} onChange={(e) => setLocationName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Church</Label>
                  <Select value={churchId} onValueChange={setChurchId}>
                    <SelectTrigger><SelectValue placeholder="Select church (optional)" /></SelectTrigger>
                    <SelectContent>
                      {churches?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.church_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} min="1" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date & Time *</Label>
                  <Input type="datetime-local" value={startDatetime} onChange={(e) => setStartDatetime(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>End Date & Time *</Label>
                  <Input type="datetime-local" value={endDatetime} onChange={(e) => setEndDatetime(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Age Group</Label>
                  <Input placeholder="e.g. 20-40" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Spiritual */}
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sda">
              <h2 className="text-lg font-semibold text-foreground">Spiritual Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Ministry Focus</Label>
                  <Input placeholder="e.g. Youth Ministries" value={ministryFocus} onChange={(e) => setMinistryFocus(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Bible Reference</Label>
                  <Input placeholder="e.g. Psalm 19:1" value={bibleReference} onChange={(e) => setBibleReference(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Bible Verse</Label>
                  <Textarea placeholder="Enter the verse text" value={bibleVerse} onChange={(e) => setBibleVerse(e.target.value)} maxLength={500} />
                </div>
              </div>
            </div>

            {/* Ticket Tiers */}
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sda">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Ticket Tiers</h2>
                <Button type="button" variant="outline" size="sm" onClick={() => setTiers((p) => [...p, emptyTier()])} className="gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add Tier
                </Button>
              </div>
              {tiers.map((tier, idx) => (
                <div key={idx} className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input placeholder="e.g. Early Bird" value={tier.name} onChange={(e) => updateTier(idx, "name", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Price (KES)</Label>
                    <Input type="number" min="0" value={tier.price} onChange={(e) => updateTier(idx, "price", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Quantity</Label>
                    <Input type="number" min="1" value={tier.quantity} onChange={(e) => updateTier(idx, "quantity", e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    {tiers.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setTiers((p) => p.filter((_, i) => i !== idx))} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="bg-sda-gradient text-primary-foreground hover:opacity-90">
                {saving ? "Creating..." : "Create Event"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateEvent;
