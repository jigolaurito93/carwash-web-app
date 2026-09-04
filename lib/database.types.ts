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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          id: number
          mission: string
          owner_name: string
          story_paragraphs: string[]
          updated_at: string
          why_choose_us: Json
        }
        Insert: {
          id?: number
          mission: string
          owner_name: string
          story_paragraphs: string[]
          updated_at?: string
          why_choose_us: Json
        }
        Update: {
          id?: number
          mission?: string
          owner_name?: string
          story_paragraphs?: string[]
          updated_at?: string
          why_choose_us?: Json
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string
          first_name: string
          id: string
          job_title: string | null
          last_name: string
          phone: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id: string
          job_title?: string | null
          last_name: string
          phone: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          phone?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointment: {
        Row: {
          appointment_date: string
          created_at: string | null
          customer_name: string | null
          email: string | null
          first_name: string
          id: number
          last_name: string | null
          notes: string | null
          phone_number: string | null
          service: string
          service_id: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          customer_name?: string | null
          email?: string | null
          first_name: string
          id?: number
          last_name?: string | null
          notes?: string | null
          phone_number?: string | null
          service: string
          service_id?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          customer_name?: string | null
          email?: string | null
          first_name?: string
          id?: number
          last_name?: string | null
          notes?: string | null
          phone_number?: string | null
          service?: string
          service_id?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: number
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: number
          is_active: boolean
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: never
          is_active?: boolean
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: never
          is_active?: boolean
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string
          caption: string | null
          created_at: string
          id: number
          image_url: string
          is_active: boolean
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          id?: never
          image_url: string
          is_active?: boolean
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          id?: never
          image_url?: string
          is_active?: boolean
          sort_order?: number
          storage_path?: string
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          body: Json
          change_summary: string
          created_at: string
          edited_by: string | null
          edited_by_email: string
          id: number
          is_current: boolean
          slug: string
          title: string
          version: number
        }
        Insert: {
          body: Json
          change_summary: string
          created_at?: string
          edited_by?: string | null
          edited_by_email: string
          id?: never
          is_current?: boolean
          slug: string
          title: string
          version: number
        }
        Update: {
          body?: Json
          change_summary?: string
          created_at?: string
          edited_by?: string | null
          edited_by_email?: string
          id?: never
          is_current?: boolean
          slug?: string
          title?: string
          version?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          card_layout: string | null
          category_id: number | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          layout1_data: Json | null
          layout2_data: Json | null
          layout3_data: string | null
          layout4_data: Json | null
          name: string
          notes: string | null
          sort_order: number
        }
        Insert: {
          card_layout?: string | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          layout1_data?: Json | null
          layout2_data?: Json | null
          layout3_data?: string | null
          layout4_data?: Json | null
          name: string
          notes?: string | null
          sort_order?: number
        }
        Update: {
          card_layout?: string | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          layout1_data?: Json | null
          layout2_data?: Json | null
          layout3_data?: string | null
          layout4_data?: Json | null
          name?: string
          notes?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_hours: {
        Row: {
          close_time: string | null
          day_name: string
          id: number
          is_closed: boolean | null
          open_time: string | null
          shop_id: number
        }
        Insert: {
          close_time?: string | null
          day_name: string
          id?: number
          is_closed?: boolean | null
          open_time?: string | null
          shop_id: number
        }
        Update: {
          close_time?: string | null
          day_name?: string
          id?: number
          is_closed?: boolean | null
          open_time?: string | null
          shop_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_hours_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shop_info"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_info: {
        Row: {
          address: string | null
          address1: string | null
          address2: string | null
          city: string | null
          created_at: string | null
          description: string | null
          description2: string | null
          email: string | null
          facebook: string | null
          id: number
          instagram: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          state: string | null
          twitter: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          description2?: string | null
          email?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          state?: string | null
          twitter?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          description2?: string | null
          email?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          state?: string | null
          twitter?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      site_announcements: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          link_url: string | null
          message: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          link_url?: string | null
          message?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          link_url?: string | null
          message?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      welcome_content: {
        Row: {
          body_paragraphs: string[]
          cta_href: string
          cta_label: string
          headline: string
          id: number
          image_alt: string
          image_path: string
          intro: string
          subheading: string
          tagline: string
          updated_at: string
        }
        Insert: {
          body_paragraphs: string[]
          cta_href: string
          cta_label: string
          headline: string
          id?: number
          image_alt: string
          image_path: string
          intro: string
          subheading: string
          tagline: string
          updated_at?: string
        }
        Update: {
          body_paragraphs?: string[]
          cta_href?: string
          cta_label?: string
          headline?: string
          id?: number
          image_alt?: string
          image_path?: string
          intro?: string
          subheading?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_policies: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
