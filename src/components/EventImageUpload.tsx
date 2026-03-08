import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface EventImageUploadProps {
  imageUrl: string | null;
  onImageUrlChange: (url: string | null) => void;
}

const EventImageUpload = ({ imageUrl, onImageUrlChange }: EventImageUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Invalid file", description: "Please select an image file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Maximum 5MB allowed." });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("event-images").upload(path, file);

    if (error) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("event-images").getPublicUrl(path);
    onImageUrlChange(publicUrlData.publicUrl);
    setUploading(false);
    toast({ title: "Image uploaded!" });
  };

  const handleRemove = () => {
    onImageUrlChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <Label>Event Banner Image</Label>
      {imageUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-border">
          <img src={imageUrl} alt="Event banner" className="h-48 w-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {uploading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <>
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">Click to upload banner</span>
              <span className="text-xs">JPG, PNG, WebP — max 5MB</span>
            </>
          )}
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};

export default EventImageUpload;
