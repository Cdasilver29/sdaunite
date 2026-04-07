import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Music, CalendarDays, Upload, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

/* ── Schedule Management ── */

const ScheduleTab = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ time: "", title: "", speaker: "", status: "upcoming", stream_url: "" });
  const [editId, setEditId] = useState<string | null>(null);

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["admin-camp-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("camp_meeting_schedules").select("*").order("time");
      if (error) throw error;
      return data;
    },
  });

  const save = async () => {
    if (!form.time || !form.title || !form.speaker) { toast.error("Fill in time, title, and speaker"); return; }
    const payload = { time: form.time, title: form.title, speaker: form.speaker, status: form.status, stream_url: form.stream_url || null };

    if (editId) {
      const { error } = await supabase.from("camp_meeting_schedules").update(payload).eq("id", editId);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Schedule updated");
    } else {
      const { error } = await supabase.from("camp_meeting_schedules").insert(payload);
      if (error) { toast.error("Create failed"); return; }
      toast.success("Schedule added");
    }
    qc.invalidateQueries({ queryKey: ["admin-camp-schedules"] });
    qc.invalidateQueries({ queryKey: ["camp-meeting-schedules"] });
    setOpen(false);
    setEditId(null);
    setForm({ time: "", title: "", speaker: "", status: "upcoming", stream_url: "" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this schedule item?")) return;
    const { error } = await supabase.from("camp_meeting_schedules").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-camp-schedules"] }); }
  };

  const startEdit = (s: any) => {
    setForm({ time: s.time, title: s.title, speaker: s.speaker, status: s.status, stream_url: s.stream_url || "" });
    setEditId(s.id);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Live Schedules</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditId(null); setForm({ time: "", title: "", speaker: "", status: "upcoming", stream_url: "" }); } }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Add Session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Schedule Item</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Time (e.g. 9:00 AM)" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              <Input placeholder="Session title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <Input placeholder="Speaker name" value={form.speaker} onChange={e => setForm(f => ({ ...f, speaker: e.target.value }))} />
              <Input placeholder="YouTube/Stream URL (optional)" value={form.stream_url} onChange={e => setForm(f => ({ ...f, stream_url: e.target.value }))} />
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={save} className="w-full">{editId ? "Update" : "Add"} Session</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : (schedules || []).length > 0 ? (
        <div className="space-y-2">
          {(schedules || []).map(s => (
            <div key={s.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <span className="text-sm font-medium text-muted-foreground w-16 shrink-0">{s.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.speaker}</p>
              </div>
              <Badge variant={s.status === "live" ? "destructive" : "secondary"} className="text-xs shrink-0">{s.status}</Badge>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => startEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">No schedule items yet.</div>
      )}
    </div>
  );
};

/* ── Tracks Management ── */

const TracksTab = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: "", artist: "", duration: "", category: "Hymns", year: "2026", audio_url: "" });

  const { data: tracks, isLoading } = useQuery({
    queryKey: ["admin-camp-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("camp_meeting_tracks").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadAudio = async (file: File): Promise<string | null> => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("camp-meeting-audio").upload(path, file, { contentType: file.type });
    setUploading(false);
    if (error) { toast.error("Upload failed: " + error.message); return null; }
    const { data: urlData } = supabase.storage.from("camp-meeting-audio").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadAudio(file);
    if (url) setForm(f => ({ ...f, audio_url: url }));
  };

  const save = async () => {
    if (!form.title || !form.artist) { toast.error("Title and artist required"); return; }
    const payload = { title: form.title, artist: form.artist, duration: form.duration || "0:00", category: form.category, year: form.year, audio_url: form.audio_url || null };

    if (editId) {
      const { error } = await supabase.from("camp_meeting_tracks").update(payload).eq("id", editId);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Track updated");
    } else {
      const { error } = await supabase.from("camp_meeting_tracks").insert(payload);
      if (error) { toast.error("Create failed"); return; }
      toast.success("Track added");
    }
    qc.invalidateQueries({ queryKey: ["admin-camp-tracks"] });
    qc.invalidateQueries({ queryKey: ["camp-meeting-tracks"] });
    setOpen(false);
    setEditId(null);
    setForm({ title: "", artist: "", duration: "", category: "Hymns", year: "2026", audio_url: "" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this track?")) return;
    const { error } = await supabase.from("camp_meeting_tracks").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-camp-tracks"] }); }
  };

  const startEdit = (t: any) => {
    setForm({ title: t.title, artist: t.artist, duration: t.duration, category: t.category, year: t.year, audio_url: t.audio_url || "" });
    setEditId(t.id);
    setOpen(true);
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ title: "", artist: "", duration: "", category: "Hymns", year: "2026", audio_url: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Music Tracks</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Add Track</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Track</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Track title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <Input placeholder="Artist / performer" value={form.artist} onChange={e => setForm(f => ({ ...f, artist: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Duration (e.g. 5:23)" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                <Input placeholder="Year (e.g. 2026)" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
              </div>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Hymns", "Worship", "Advent Hope", "Sermons"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Audio file upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Audio File</label>
                <input ref={fileRef} type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-1.5">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {uploading ? "Uploading..." : "Upload Audio"}
                  </Button>
                  {form.audio_url && (
                    <span className="text-xs text-green-600 flex items-center gap-1">Audio attached</span>
                  )}
                </div>
                <Input placeholder="Or paste audio URL" value={form.audio_url} onChange={e => setForm(f => ({ ...f, audio_url: e.target.value }))} />
              </div>

              <Button onClick={save} className="w-full" disabled={uploading}>{editId ? "Update" : "Add"} Track</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}</div>
      ) : (tracks || []).length > 0 ? (
        <div className="space-y-2">
          {(tracks || []).map(t => (
            <div key={t.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
              <Music className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.artist} · {t.duration} · {t.year}</p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">{t.category}</Badge>
              {t.audio_url ? (
                <Badge className="text-[10px] bg-green-600 text-white border-0 shrink-0">Audio</Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] shrink-0">No file</Badge>
              )}
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => startEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">No tracks yet.</div>
      )}
    </div>
  );
};

/* ── Main Admin Page ── */

const AdminCampMeeting = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Camp Meeting</h1>
      <Tabs defaultValue="schedules">
        <TabsList>
          <TabsTrigger value="schedules" className="gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Schedules</TabsTrigger>
          <TabsTrigger value="tracks" className="gap-1.5"><Music className="h-3.5 w-3.5" /> Music Tracks</TabsTrigger>
        </TabsList>
        <TabsContent value="schedules" className="mt-6"><ScheduleTab /></TabsContent>
        <TabsContent value="tracks" className="mt-6"><TracksTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCampMeeting;
