import type { ComponentType } from "react";
import type { PopupLayoutProps } from "@/lib/popup-announcements";
import type { PopupLayoutKey } from "@/lib/popup-layouts";
import DefaultPopupLayout from "@/components/announcements/layouts/DefaultPopupLayout";
import FourthOfJulyPopup from "@/components/announcements/layouts/FourthOfJulyPopup";

/**
 * Register custom popup designs here.
 *
 * 1. Add a component in this folder (copy FourthOfJulyPopup.tsx).
 * 2. Add its key to POPUP_LAYOUT_KEYS / POPUP_LAYOUT_META in lib/popup-layouts.ts.
 * 3. Map that key to the component below.
 *
 * The CMS dropdown updates from the meta list. Unknown keys fall back to Default.
 */
export const POPUP_LAYOUT_COMPONENTS: Record<
  PopupLayoutKey,
  ComponentType<PopupLayoutProps>
> = {
  default: DefaultPopupLayout,
  "fourth-of-july": FourthOfJulyPopup,
};

export function getPopupLayoutComponent(key: string | null | undefined) {
  if (key && key in POPUP_LAYOUT_COMPONENTS) {
    return POPUP_LAYOUT_COMPONENTS[key as PopupLayoutKey];
  }
  return DefaultPopupLayout;
}
