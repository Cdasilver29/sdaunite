import heroSingles from "@/assets/hero-singles-fellowship.jpg";
import heroHike from "@/assets/hero-youth-hike.jpg";
import heroService from "@/assets/hero-service-mission.jpg";
import flyerSocial from "@/assets/flyer-social-fellowship.jpg";
import flyerOutdoor from "@/assets/flyer-outdoor-nature.jpg";
import flyerRetreat from "@/assets/flyer-spiritual-retreat.jpg";
import flyerMission from "@/assets/flyer-service-mission.jpg";
import flyerSports from "@/assets/flyer-sports-health.jpg";
import flyerMusic from "@/assets/flyer-music-worship.jpg";
import flyerFundraiser from "@/assets/flyer-fundraiser.jpg";

const IMAGE_MAP: Record<string, string> = {
  "singles-fellowship": heroSingles,
  "youth-hike": heroHike,
  "service-mission": heroService,
};

// Category-based fallback images so each event type gets a relevant flyer
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "Social & Fellowship": flyerSocial,
  "Outdoor & Nature": flyerOutdoor,
  "Spiritual Retreats": flyerRetreat,
  "Service & Mission": flyerMission,
  "Sports & Health": flyerSports,
  "Music & Worship": flyerMusic,
  "Fundraisers": flyerFundraiser,
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function getEventImageUrl(imageUrl: string | null, category?: string): string {
  // If there's an explicit image URL, try to resolve it
  if (imageUrl) {
    // Legacy keys mapped to local assets
    if (IMAGE_MAP[imageUrl]) return IMAGE_MAP[imageUrl];

    // Full URL already (e.g. from storage)
    if (imageUrl.startsWith("http")) return imageUrl;

    // Relative path inside event-images bucket
    return `${SUPABASE_URL}/storage/v1/object/public/event-images/${imageUrl}`;
  }

  // No image URL: use category-based fallback
  if (category && CATEGORY_IMAGE_MAP[category]) {
    return CATEGORY_IMAGE_MAP[category];
  }

  // Ultimate fallback
  return flyerSocial;
}
