import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChurches = () =>
  useQuery({
    queryKey: ["churches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("churches")
        .select("id, church_name, city")
        .order("church_name");
      if (error) throw error;
      return data;
    },
  });
