import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbEvent = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  event_category: string;
  church_id: string | null;
  organizer_id: string;
  location_name: string;
  city: string;
  country: string;
  start_datetime: string;
  end_datetime: string;
  event_capacity: number;
  event_status: string;
  ministry_focus: string | null;
  bible_verse: string | null;
  bible_reference: string | null;
  image_url: string | null;
  verified: boolean;
  age_group: string | null;
  created_at: string;
  churches?: { church_name: string } | null;
  ticket_types?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string | null;
    quantity_available: number;
  }[];
  tickets?: { id: string }[];
};

export const usePublishedEvents = () =>
  useQuery({
    queryKey: ["events", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          churches ( church_name ),
          ticket_types ( id, name, price, currency, description, quantity_available ),
          tickets ( id )
        `)
        .eq("event_status", "published")
        .order("start_datetime", { ascending: true });

      if (error) throw error;
      return data as unknown as DbEvent[];
    },
  });

export const useEventById = (id: string | undefined) =>
  useQuery({
    queryKey: ["events", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          churches ( church_name ),
          ticket_types ( id, name, price, currency, description, quantity_available ),
          tickets ( id )
        `)
        .eq("id", id!)
        .single();

      if (error) throw error;
      return data as unknown as DbEvent;
    },
  });

export const useOrganizerEvents = (userId: string | undefined) =>
  useQuery({
    queryKey: ["events", "organizer", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          churches ( church_name ),
          ticket_types ( id, name, price, currency, description, quantity_available ),
          tickets ( id )
        `)
        .eq("organizer_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as DbEvent[];
    },
  });
