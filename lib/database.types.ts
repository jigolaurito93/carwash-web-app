export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      all_services: {
        Row: {
          created_at: string;
          id: number;
          is_active: boolean | null;
          name: string | null;
          package_id: number | null;
          price: number | null;
          size: string | null;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          is_active?: boolean | null;
          name?: string | null;
          package_id?: number | null;
          price?: number | null;
          size?: string | null;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_active?: boolean | null;
          name?: string | null;
          package_id?: number | null;
          price?: number | null;
          size?: string | null;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "all_services_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "services_packages";
            referencedColumns: ["id"];
          },
        ];
      };
      appointment: {
        Row: {
          appointment_date: string;
          created_at: string | null;
          customer_name: string | null;
          id: number;
          notes: string | null;
          phone_number: string | null;
          service: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          appointment_date: string;
          created_at?: string | null;
          customer_name?: string | null;
          id?: number;
          notes?: string | null;
          phone_number?: string | null;
          service: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          appointment_date?: string;
          created_at?: string | null;
          customer_name?: string | null;
          id?: number;
          notes?: string | null;
          phone_number?: string | null;
          service?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
          order_by: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
          order_by?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
          order_by?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      categories1: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          slug: string;
          sort_order: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          slug: string;
          sort_order?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          slug?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      detailingServices: {
        Row: {
          created_at: string | null;
          id: number;
          is_active: boolean | null;
          name: string;
          price_car: number | null;
          price_full: number | null;
          price_mid: number | null;
          sort_order: number | null;
          subtitle: string | null;
          types: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          is_active?: boolean | null;
          name: string;
          price_car?: number | null;
          price_full?: number | null;
          price_mid?: number | null;
          sort_order?: number | null;
          subtitle?: string | null;
          types?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          is_active?: boolean | null;
          name?: string;
          price_car?: number | null;
          price_full?: number | null;
          price_mid?: number | null;
          sort_order?: number | null;
          subtitle?: string | null;
          types?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          created_at: string;
          id: number;
          is_active: boolean;
          question: string;
          sort_order: number;
        };
        Insert: {
          answer: string;
          created_at?: string;
          id?: never;
          is_active?: boolean;
          question: string;
          sort_order?: number;
        };
        Update: {
          answer?: string;
          created_at?: string;
          id?: never;
          is_active?: boolean;
          question?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          alt_text: string;
          caption: string | null;
          created_at: string;
          id: number;
          image_url: string;
          is_active: boolean;
          sort_order: number;
          storage_path: string;
        };
        Insert: {
          alt_text?: string;
          caption?: string | null;
          created_at?: string;
          id?: never;
          image_url: string;
          is_active?: boolean;
          sort_order?: number;
          storage_path: string;
        };
        Update: {
          alt_text?: string;
          caption?: string | null;
          created_at?: string;
          id?: never;
          image_url?: string;
          is_active?: boolean;
          sort_order?: number;
          storage_path?: string;
        };
        Relationships: [];
      };
      other_services: {
        Row: {
          category: string | null;
          created_at: string | null;
          description: string | null;
          features: Json | null;
          id: number;
          is_active: boolean | null;
          name: string | null;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          features?: Json | null;
          id?: number;
          is_active?: boolean | null;
          name?: string | null;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          features?: Json | null;
          id?: number;
          is_active?: boolean | null;
          name?: string | null;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      services_all: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          id: number;
          is_active: boolean;
          name: string | null;
          price: string | null;
          sort_order: number | null;
          sub_category: string | null;
          types: Json | null;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          is_active: boolean;
          name?: string | null;
          price?: string | null;
          sort_order?: number | null;
          sub_category?: string | null;
          types?: Json | null;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          is_active?: boolean;
          name?: string | null;
          price?: string | null;
          sort_order?: number | null;
          sub_category?: string | null;
          types?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      services_packages: {
        Row: {
          category_id: number | null;
          created_at: string;
          description: string | null;
          id: number;
          name: string | null;
          sort_order: number | null;
          types: Json | null;
          updated_at: string;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string | null;
          sort_order?: number | null;
          types?: Json | null;
          updated_at?: string;
        };
        Update: {
          category_id?: number | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string | null;
          sort_order?: number | null;
          types?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_packages_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      services1: {
        Row: {
          card_layout: string | null;
          category_id: number | null;
          created_at: string | null;
          description: string | null;
          id: number;
          is_active: boolean | null;
          layout1_data: Json | null;
          layout2_data: Json | null;
          layout3_data: string | null;
          layout4_data: Json | null;
          name: string;
          notes: string | null;
          sort_order: number;
        };
        Insert: {
          card_layout?: string | null;
          category_id?: number | null;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          is_active?: boolean | null;
          layout1_data?: Json | null;
          layout2_data?: Json | null;
          layout3_data?: string | null;
          layout4_data?: Json | null;
          name: string;
          notes?: string | null;
          sort_order?: number;
        };
        Update: {
          card_layout?: string | null;
          category_id?: number | null;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          is_active?: boolean | null;
          layout1_data?: Json | null;
          layout2_data?: Json | null;
          layout3_data?: string | null;
          layout4_data?: Json | null;
          name?: string;
          notes?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "services1_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories1";
            referencedColumns: ["id"];
          },
        ];
      };
      shop_hours: {
        Row: {
          close_time: string | null;
          day_name: string;
          id: number;
          is_closed: boolean | null;
          open_time: string | null;
          shop_id: number;
        };
        Insert: {
          close_time?: string | null;
          day_name: string;
          id?: number;
          is_closed?: boolean | null;
          open_time?: string | null;
          shop_id: number;
        };
        Update: {
          close_time?: string | null;
          day_name?: string;
          id?: number;
          is_closed?: boolean | null;
          open_time?: string | null;
          shop_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "shop_hours_shop_id_fkey";
            columns: ["shop_id"];
            isOneToOne: false;
            referencedRelation: "shop_info";
            referencedColumns: ["id"];
          },
        ];
      };
      shop_info: {
        Row: {
          address: string | null;
          address1: string | null;
          address2: string | null;
          city: string | null;
          created_at: string | null;
          description: string | null;
          description2: string | null;
          email: string | null;
          facebook: string | null;
          id: number;
          instagram: string | null;
          latitude: number | null;
          longitude: number | null;
          name: string;
          phone: string | null;
          state: string | null;
          twitter: string | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          address1?: string | null;
          address2?: string | null;
          city?: string | null;
          created_at?: string | null;
          description?: string | null;
          description2?: string | null;
          email?: string | null;
          facebook?: string | null;
          id?: number;
          instagram?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          name?: string;
          phone?: string | null;
          state?: string | null;
          twitter?: string | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          address1?: string | null;
          address2?: string | null;
          city?: string | null;
          created_at?: string | null;
          description?: string | null;
          description2?: string | null;
          email?: string | null;
          facebook?: string | null;
          id?: number;
          instagram?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          name?: string;
          phone?: string | null;
          state?: string | null;
          twitter?: string | null;
          zip?: string | null;
        };
        Relationships: [];
      };
      site_announcements: {
        Row: {
          created_at: string;
          id: number;
          is_active: boolean | null;
          link_url: string | null;
          message: string | null;
          sort_order: number | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          is_active?: boolean | null;
          link_url?: string | null;
          message?: string | null;
          sort_order?: number | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_active?: boolean | null;
          link_url?: string | null;
          message?: string | null;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      tiered_services: {
        Row: {
          category: string | null;
          created_at: string | null;
          description: string | null;
          features: Json | null;
          id: number;
          is_active: boolean | null;
          name: string;
          price_large: number | null;
          price_medium: number | null;
          price_small: number | null;
          sort_order: number | null;
          updated_at: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          features?: Json | null;
          id?: number;
          is_active?: boolean | null;
          name: string;
          price_large?: number | null;
          price_medium?: number | null;
          price_small?: number | null;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          features?: Json | null;
          id?: number;
          is_active?: boolean | null;
          name?: string;
          price_large?: number | null;
          price_medium?: number | null;
          price_small?: number | null;
          sort_order?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      customer_services: {
        Row: {
          category: string | null;
          created_at: string | null;
          description: string | null;
          features: Json | null;
          id: number | null;
          is_active: boolean | null;
          name: string | null;
          price_large: number | null;
          price_medium: number | null;
          price_small: number | null;
          service_type: string | null;
          sort_order: number | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      check_policies: { Args: never; Returns: Json };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
