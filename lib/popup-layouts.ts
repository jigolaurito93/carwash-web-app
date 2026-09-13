export const POPUP_LAYOUT_KEYS = ["default", "fourth-of-july"] as const;

export type PopupLayoutKey = (typeof POPUP_LAYOUT_KEYS)[number];

export const POPUP_LAYOUT_META: Record<
  PopupLayoutKey,
  { label: string; hint: string }
> = {
  default: {
    label: "Default",
    hint: "Generic notice, promo, or closed-day card. The owner writes the title and message.",
  },
  "fourth-of-july": {
    label: "4th of July promo",
    hint: "Patriotic seasonal design. Title, message, and link still come from this form.",
  },
};

export function isPopupLayoutKey(
  value: string | null | undefined,
): value is PopupLayoutKey {
  return (POPUP_LAYOUT_KEYS as readonly string[]).includes(value ?? "");
}
