export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: number;
          name: string;
          subtitle: string | null;
          types: Json;
          price_car: number | null;
          price_mid: number | null;
          price_full: number | null;
          is_active: boolean;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          subtitle?: string | null;
          types?: Json;
          price_car?: number | null;
          price_mid?: number | null;
          price_full?: number | null;
          is_active?: boolean;
          sort_order?: number | null;
        };
        Update: {
          name?: string;
          subtitle?: string | null;
          types?: Json;
          price_car?: number | null;
          price_mid?: number | null;
          price_full?: number | null;
          is_active?: boolean;
          sort_order?: number | null;
        };
      };
      services_all: {
        Row: {
          id: number;
          name: string;
          description?: string | null;
          price: string | number;
          category: string;
          sub_category: string;
          types: Json;
          sort_order?: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          price: string | number;
          category: string;
          sub_category: string;
          types: Json;
          created_at: string;
          updated_at: string;
        };
        Update: {
          id: number;
          name: string;
          price: string | number;
          category: string;
          sub_category: string;
          types: Json;
          created_at: string;
          updated_at: string;
        };
      };
      gallery_images: {
        Row: {
          id: number;
          image_url: string;
          caption: string | null;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          image_url: string;
          caption?: string | null;
          sort_order?: number | null;
        };
        Update: {
          image_url?: string;
          caption?: string | null;
          sort_order?: number | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
