import type { Json as DbJson } from "@/lib/database.types";

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

// Domain shape for services + categories(name) join.
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
  categories: {
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

export type GalleryImage = {
  id: number;
  storage_path: string;
  image_url: string;
  caption: string | null;
  alt_text: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type SiteAnnouncement = {
  id: number;
  message: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type WhyChooseUsItem = {
  title: string;
  description: string;
  icon?: string;
};

export type AboutContent = {
  id: number;
  owner_name: string;
  story_paragraphs: string[];
  mission: string;
  why_choose_us: WhyChooseUsItem[];
  updated_at: string;
};

export type WelcomeContent = {
  id: number;
  headline: string;
  tagline: string;
  intro: string;
  subheading: string;
  body_paragraphs: string[];
  cta_label: string;
  cta_href: string;
  image_path: string;
  image_alt: string;
  updated_at: string;
};

export type LegalSlug = "privacy" | "terms";

export type LegalDocument = {
  id: number;
  slug: LegalSlug;
  title: string;
  body: DbJson;
  version: number;
  change_summary: string;
  edited_by: string | null;
  edited_by_email: string;
  is_current: boolean;
  created_at: string;
};
