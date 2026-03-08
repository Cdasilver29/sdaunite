import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Camera, User } from "lucide-react";

const ProfilePhotoUpload = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const photoUrl = profile?.profile_photo_url;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Please select an image file" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ variant: "destructive", title: "Upload failed", description: uploadError.message });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_photo_url: urlData.publicUrl })
      .eq("user_id", user.id);

    if (updateError) {
      toast({ variant: "destructive", title: "Failed to save", description: updateError.message });
    } else {
      await refreshProfile();
      toast({ title: "Photo updated!" });
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative h-24 w-24 rounded-full border-2 border-border bg-muted overflow-hidden transition-all duration-300 hover:border-secondary hover:shadow-sda-lg"
      >
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/10">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/40">
          <Camera className="h-5 w-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      <span className="text-xs text-muted-foreground">
        {uploading ? "Uploading..." : "Click to change photo"}
      </span>
    </div>
  );
};

export default ProfilePhotoUpload;
