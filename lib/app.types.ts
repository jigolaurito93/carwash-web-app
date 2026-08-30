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

export type CardLayout = "layout1" | "layout2" | "layout3" | "layout4";

// Domain shape for services1 + categories1(name) join.
// Nullable fields match lib/database.types.ts (generated).
export type ServiceRow = {
  id: number;
  name: string;
  description: string | null;
  sort_order: number | null;
  category_id: number | null;
  card_layout: string | null;
  notes?: string | null;
  is_active: boolean | null;
  created_at?: string | null;
  categories1: {
    name: string;
  } | null;
  layout1_data:
    | (Layout1Data & {
        is_active?: boolean;
        sort_order?: number | null;
      })
    | null;
  layout2_data: Layout2Data | null;
  layout3_data: string | null;
  layout4_data: Layout4Data | null;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number | null;
  created_at?: string | null;
};
