import type { Database } from "./database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type ShopInfo = Tables<"shop_info">;

export type ShopMapAddress = Pick<
  ShopInfo,
  | "address1"
  | "address2"
  | "city"
  | "state"
  | "zip"
  | "name"
  | "latitude"
  | "longitude"
>;

export type { Database };
