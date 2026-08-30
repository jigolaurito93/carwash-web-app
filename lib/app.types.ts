export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// Interface for the "services_packages" table, which is related to "all_services"
export interface ServicesPackage {
  name: string | null;
  types: string[] | null;
  description: string | null;
  sort_order: number | null;
  categories: {
    id: number;
    name: string | null;
  } | null;
}

export interface AllService {
  package_id: number;
  name: string | null;
  price: string | null;
  size?: string | null;
  is_active: boolean;
  sort_order: number | null;
  services_packages: ServicesPackage | null;
}

//////////////////////////////////////////////////////////////////////////
// types.ts
export type Layout1Data = {
  includes: string[];
  small_car_price: number;
  medium_car_price: number;
  large_car_price: number;
};

export type Layout2Data = {
  items: Record<string, number>;
};

export type Layout4Data = {
  info: string;
  small_car_price: number;
  medium_car_price: number;
  large_car_price: number;
};

// This must match your Supabase RLS‑generated type for `services1`
export type ServiceRow = {
  id: number;
  name: string;
  description: string | null;
  sort_order: number | null;
  category_id: number;
  card_layout: "layout1" | "layout2" | "layout3" | "layout4" | null;
  notes?: string | null;
  is_active: boolean;
  categories1: {
    name: string;
    card_layout: "layout1" | "layout2" | "layout3" | "layout4";
  };
  layout1_data: {
    includes: string[];
    small_car_price: number;
    medium_car_price: number;
    large_car_price: number;
    is_active: boolean;
    sort_order: number | null;
  } | null;
  layout2_data: {
    items: Record<string, number>;
  } | null;
  layout3_data: string | null; // Assuming layout3 is just a string description for now
  layout4_data: {
    info: string;
    small_car_price: number;
    medium_car_price: number;
    large_car_price: number;
  } | null;
};

// types.ts (or lib/types.ts)
export type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  card_layout: "layout1" | "layout2" | "layout3" | "layout4";
};
