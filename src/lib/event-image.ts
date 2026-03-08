import heroSingles from "@/assets/hero-singles-fellowship.jpg";
import heroHike from "@/assets/hero-youth-hike.jpg";
import heroService from "@/assets/hero-service-mission.jpg";

const IMAGE_MAP: Record<string, string> = {
  "singles-fellowship": heroSingles,
  "youth-hike": heroHike,
  "service-mission": heroService,
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function getEventImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return heroSingles;

  // Legacy keys mapped to local assets
  if (IMAGE_MAP[imageUrl]) return IMAGE_MAP[imageUrl];

  // Full URL already (e.g. from storage)
  if (imageUrl.startsWith("http")) return imageUrl;

  // Relative path inside event-images bucket
  return `${SUPABASE_URL}/storage/v1/object/public/event-images/${imageUrl}`;
}
