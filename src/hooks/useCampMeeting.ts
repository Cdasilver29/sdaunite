import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CampSchedule = {
  id: string;
  session_date: string;
  time: string;
  title: string;
  speaker: string;
  status: string;
  stream_url: string | null;
};

export type CampTrack = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: string;
  year: string;
  audio_url: string | null;
  cover_image_url: string | null;
  play_count: number;
};

export function useCampSchedules() {
  return useQuery({
    queryKey: ["camp-meeting-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("camp_meeting_schedules")
        .select("*")
        .order("time", { ascending: true });
      if (error) throw error;
      return data as CampSchedule[];
    },
  });
}

export function useCampTracks() {
  return useQuery({
    queryKey: ["camp-meeting-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("camp_meeting_tracks")
        .select("*")
        .order("year", { ascending: false });
      if (error) throw error;
      return data as CampTrack[];
    },
  });
}
