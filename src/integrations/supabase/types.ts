export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_articles: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          published: boolean
          related_event_ids: string[] | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category?: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          image_url?: string | null
          published?: boolean
          related_event_ids?: string[] | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          published?: boolean
          related_event_ids?: string[] | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      churches: {
        Row: {
          address: string | null
          church_name: string
          city: string
          conference: string | null
          country: string
          created_at: string
          id: string
          verified_status: boolean
        }
        Insert: {
          address?: string | null
          church_name: string
          city: string
          conference?: string | null
          country?: string
          created_at?: string
          id?: string
          verified_status?: boolean
        }
        Update: {
          address?: string | null
          church_name?: string
          city?: string
          conference?: string | null
          country?: string
          created_at?: string
          id?: string
          verified_status?: boolean
        }
        Relationships: []
      }
      event_analytics: {
        Row: {
          attendance_count: number
          average_rating: number | null
          event_id: string
          id: string
          tickets_sold: number
          total_revenue: number
          updated_at: string
          volunteer_count: number
        }
        Insert: {
          attendance_count?: number
          average_rating?: number | null
          event_id: string
          id?: string
          tickets_sold?: number
          total_revenue?: number
          updated_at?: string
          volunteer_count?: number
        }
        Update: {
          attendance_count?: number
          average_rating?: number | null
          event_id?: string
          id?: string
          tickets_sold?: number
          total_revenue?: number
          updated_at?: string
          volunteer_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_checkins: {
        Row: {
          event_id: string
          id: string
          scanned_at: string
          scanned_by_user_id: string | null
          ticket_id: string
        }
        Insert: {
          event_id: string
          id?: string
          scanned_at?: string
          scanned_by_user_id?: string | null
          ticket_id: string
        }
        Update: {
          event_id?: string
          id?: string
          scanned_at?: string
          scanned_by_user_id?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_checkins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_checkins_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      event_reviews: {
        Row: {
          created_at: string
          event_id: string
          fellowship_experience_comment: string | null
          id: string
          rating: number
          spiritual_impact_comment: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          fellowship_experience_comment?: string | null
          id?: string
          rating: number
          spiritual_impact_comment?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          fellowship_experience_comment?: string | null
          id?: string
          rating?: number
          spiritual_impact_comment?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          age_group: string | null
          bible_reference: string | null
          bible_verse: string | null
          church_id: string | null
          city: string
          country: string
          created_at: string
          description: string
          end_datetime: string
          event_capacity: number
          event_category: Database["public"]["Enums"]["event_category"]
          event_status: Database["public"]["Enums"]["event_status"]
          id: string
          image_url: string | null
          location_name: string
          ministry_department_id: string | null
          ministry_focus: string | null
          organizer_id: string
          start_datetime: string
          subtitle: string | null
          title: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          age_group?: string | null
          bible_reference?: string | null
          bible_verse?: string | null
          church_id?: string | null
          city?: string
          country?: string
          created_at?: string
          description: string
          end_datetime: string
          event_capacity?: number
          event_category: Database["public"]["Enums"]["event_category"]
          event_status?: Database["public"]["Enums"]["event_status"]
          id?: string
          image_url?: string | null
          location_name: string
          ministry_department_id?: string | null
          ministry_focus?: string | null
          organizer_id: string
          start_datetime: string
          subtitle?: string | null
          title: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          age_group?: string | null
          bible_reference?: string | null
          bible_verse?: string | null
          church_id?: string | null
          city?: string
          country?: string
          created_at?: string
          description?: string
          end_datetime?: string
          event_capacity?: number
          event_category?: Database["public"]["Enums"]["event_category"]
          event_status?: Database["public"]["Enums"]["event_status"]
          id?: string
          image_url?: string | null
          location_name?: string
          ministry_department_id?: string | null
          ministry_focus?: string | null
          organizer_id?: string
          start_datetime?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_ministry_department_id_fkey"
            columns: ["ministry_department_id"]
            isOneToOne: false
            referencedRelation: "ministry_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_departments: {
        Row: {
          department_name: string
          description: string | null
          id: string
        }
        Insert: {
          department_name: string
          description?: string | null
          id?: string
        }
        Update: {
          department_name?: string
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          currency: string
          id: string
          mpesa_checkout_request_id: string | null
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_provider_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone_number: string | null
          ticket_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          currency?: string
          id?: string
          mpesa_checkout_request_id?: string | null
          paid_at?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_provider_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone_number?: string | null
          ticket_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          currency?: string
          id?: string
          mpesa_checkout_request_id?: string | null
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_provider_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone_number?: string | null
          ticket_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_group: string | null
          church_id: string | null
          created_at: string
          email: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          phone_number: string | null
          profile_photo_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_group?: string | null
          church_id?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          phone_number?: string | null
          profile_photo_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_group?: string | null
          church_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          phone_number?: string | null
          profile_photo_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      retreats: {
        Row: {
          capacity: number
          church_id: string | null
          city: string
          country: string
          created_at: string
          currency: string
          description: string
          end_date: string
          id: string
          image_url: string | null
          includes_accommodation: boolean | null
          includes_meals: boolean | null
          includes_transport: boolean | null
          location_name: string
          organizer_id: string
          retreat_status: string
          schedule: Json | null
          spiritual_objective: string | null
          start_date: string
          starting_price: number | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          church_id?: string | null
          city?: string
          country?: string
          created_at?: string
          currency?: string
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          includes_accommodation?: boolean | null
          includes_meals?: boolean | null
          includes_transport?: boolean | null
          location_name: string
          organizer_id: string
          retreat_status?: string
          schedule?: Json | null
          spiritual_objective?: string | null
          start_date: string
          starting_price?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          church_id?: string | null
          city?: string
          country?: string
          created_at?: string
          currency?: string
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          includes_accommodation?: boolean | null
          includes_meals?: boolean | null
          includes_transport?: boolean | null
          location_name?: string
          organizer_id?: string
          retreat_status?: string
          schedule?: Json | null
          spiritual_objective?: string | null
          start_date?: string
          starting_price?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retreats_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_access: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          payment_id: string | null
          stream_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          stream_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          stream_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_access_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_access_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          approved: boolean
          bible_text: string | null
          church_id: string | null
          created_at: string
          currency: string
          description: string
          duration_minutes: number | null
          id: string
          organizer_id: string
          price: number
          pricing_model: string
          rent_duration_hours: number | null
          stream_status: string
          stream_type: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          approved?: boolean
          bible_text?: string | null
          church_id?: string | null
          created_at?: string
          currency?: string
          description: string
          duration_minutes?: number | null
          id?: string
          organizer_id: string
          price?: number
          pricing_model?: string
          rent_duration_hours?: number | null
          stream_status?: string
          stream_type?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          approved?: boolean
          bible_text?: string | null
          church_id?: string | null
          created_at?: string
          currency?: string
          description?: string
          duration_minutes?: number | null
          id?: string
          organizer_id?: string
          price?: number
          pricing_model?: string
          rent_duration_hours?: number | null
          stream_status?: string
          stream_type?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streams_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      team_event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          payment_id: string | null
          registration_status: Database["public"]["Enums"]["registration_status"]
          team_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          payment_id?: string | null
          registration_status?: Database["public"]["Enums"]["registration_status"]
          team_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          payment_id?: string | null
          registration_status?: Database["public"]["Enums"]["registration_status"]
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_event_registrations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_event_registrations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          position: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          position?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          position?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          captain_user_id: string
          church_id: string | null
          created_at: string
          id: string
          team_name: string
        }
        Insert: {
          captain_user_id: string
          church_id?: string | null
          created_at?: string
          id?: string
          team_name: string
        }
        Update: {
          captain_user_id?: string
          church_id?: string | null
          created_at?: string
          id?: string
          team_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_types: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          event_id: string
          id: string
          name: string
          price: number
          quantity_available: number
          sales_end_date: string | null
          sales_start_date: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          event_id: string
          id?: string
          name: string
          price?: number
          quantity_available?: number
          sales_end_date?: string | null
          sales_start_date?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          price?: number
          quantity_available?: number
          sales_end_date?: string | null
          sales_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          event_id: string
          id: string
          purchased_at: string
          qr_code: string
          ticket_status: Database["public"]["Enums"]["ticket_status"]
          ticket_type_id: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          purchased_at?: string
          qr_code: string
          ticket_status?: Database["public"]["Enums"]["ticket_status"]
          ticket_type_id: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          purchased_at?: string
          qr_code?: string
          ticket_status?: Database["public"]["Enums"]["ticket_status"]
          ticket_type_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_registrations: {
        Row: {
          attendance_status: Database["public"]["Enums"]["attendance_status"]
          created_at: string
          event_id: string
          id: string
          user_id: string
          volunteer_role: Database["public"]["Enums"]["volunteer_role"]
        }
        Insert: {
          attendance_status?: Database["public"]["Enums"]["attendance_status"]
          created_at?: string
          event_id: string
          id?: string
          user_id: string
          volunteer_role?: Database["public"]["Enums"]["volunteer_role"]
        }
        Update: {
          attendance_status?: Database["public"]["Enums"]["attendance_status"]
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
          volunteer_role?: Database["public"]["Enums"]["volunteer_role"]
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      xperience_photos: {
        Row: {
          approved: boolean
          approved_by: string | null
          caption: string | null
          created_at: string
          event_id: string
          id: string
          image_url: string
          uploaded_by: string
        }
        Insert: {
          approved?: boolean
          approved_by?: string | null
          caption?: string | null
          created_at?: string
          event_id: string
          id?: string
          image_url: string
          uploaded_by: string
        }
        Update: {
          approved?: boolean
          approved_by?: string | null
          caption?: string | null
          created_at?: string
          event_id?: string
          id?: string
          image_url?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "xperience_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "organizer" | "admin" | "church_admin" | "super_admin"
      attendance_status: "registered" | "attended" | "no_show"
      event_category:
        | "Social & Fellowship"
        | "Outdoor & Nature"
        | "Spiritual Retreats"
        | "Service & Mission"
        | "Sports & Health"
        | "Music & Worship"
        | "Fundraisers"
      event_status: "draft" | "published" | "cancelled"
      gender_type: "male" | "female"
      payment_method: "mpesa" | "card"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      registration_status: "pending" | "confirmed" | "cancelled"
      ticket_status: "valid" | "cancelled" | "refunded" | "checked_in"
      volunteer_role: "mentor" | "helper" | "logistics" | "coordinator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "organizer", "admin", "church_admin", "super_admin"],
      attendance_status: ["registered", "attended", "no_show"],
      event_category: [
        "Social & Fellowship",
        "Outdoor & Nature",
        "Spiritual Retreats",
        "Service & Mission",
        "Sports & Health",
        "Music & Worship",
        "Fundraisers",
      ],
      event_status: ["draft", "published", "cancelled"],
      gender_type: ["male", "female"],
      payment_method: ["mpesa", "card"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      registration_status: ["pending", "confirmed", "cancelled"],
      ticket_status: ["valid", "cancelled", "refunded", "checked_in"],
      volunteer_role: ["mentor", "helper", "logistics", "coordinator"],
    },
  },
} as const
