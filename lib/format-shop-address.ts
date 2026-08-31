export type ShopAddressParts = {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
};

/** Formats as "123 Main St, Chicago, IL 60601" */
export function formatShopAddress(shop?: ShopAddressParts | null) {
  if (!shop) return "";

  const cityStateZip = [
    shop.city,
    [shop.state, shop.zip].filter(Boolean).join(" "),
  ]
    .filter((part) => part?.trim())
    .join(", ");

  return [shop.address1, shop.address2, cityStateZip]
    .filter((part) => part?.trim())
    .join(", ");
}
