import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ChurchCombobox from "@/components/ChurchCombobox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Phone, Mail, CheckCircle } from "lucide-react";

const Profile = () => {
  const { user, profile, roles, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [churchId, setChurchId] = useState("");
  const [customChurchName, setCustomChurchName] = useState("");
  const [saving, setSaving] = useState(false);

  const isNewProfile = !!profile && (!profile.church_id || !profile.phone_number);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhoneNumber(profile.phone_number || "");
      setGender(profile.gender || "");
      setAgeGroup(profile.age_group || "");
      setChurchId(profile.church_id || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    let finalChurchId = churchId;
    if (!churchId && customChurchName.trim()) {
      const { data: newChurch } = await supabase
        .from("churches")
        .insert({ church_name: customChurchName.trim(), city: "Nairobi" })
        .select("id")
        .single();
      if (newChurch) finalChurchId = newChurch.id;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim() || null,
        gender: (gender as "male" | "female") || null,
        age_group: ageGroup || null,
        church_id: finalChurchId || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      await refreshProfile();
      toast({ title: "Profile updated!", description: "Your changes have been saved. Redirecting..." });
      setTimeout(() => navigate("/events"), 800);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNewProfile
              ? "Complete your profile to unlock event details and ticket purchasing"
              : "Manage your SDA Unite account details"}
          </p>

          {isNewProfile && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/10 p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Almost there!</p>
                <p className="text-xs text-muted-foreground">
                  Fill in your details below to access full event information, purchase tickets, and register for events.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {roles.map((r) => (
              <span key={r} className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary capitalize">{r}</span>
            ))}
          </div>

          <form onSubmit={handleSave} className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sda">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Email</Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Phone Number</Label>
                <Input id="phone" placeholder="+254 712 345 678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18–24</SelectItem>
                    <SelectItem value="25-30">25–30</SelectItem>
                    <SelectItem value="30-40">30–40</SelectItem>
                    <SelectItem value="40+">40+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ChurchCombobox
                churchId={churchId}
                customChurchName={customChurchName}
                onChurchIdChange={setChurchId}
                onCustomChurchNameChange={setCustomChurchName}
                required
                label="Home Church"
              />
            </div>
            <Button type="submit" disabled={saving} className="bg-sda-gradient text-primary-foreground hover:opacity-90">
              {saving ? "Saving..." : isNewProfile ? "Complete Profile & Explore Events" : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
