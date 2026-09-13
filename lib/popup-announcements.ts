import {
  isAnnouncementKind,
  isAnnouncementLive,
  type AnnouncementKind,
} from "@/lib/announcements";
import { isPopupLayoutKey, type PopupLayoutKey } from "@/lib/popup-layouts";

export type PopupAnnouncement = {
  id: number;
  title: string | null;
  message: string;
  link_url: string | null;
  kind: AnnouncementKind;
  layout_key: PopupLayoutKey;
  starts_at: string | null;
  expires_at: string | null;
  closes_on: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
};

export type PopupLayoutProps = {
  announcement: PopupAnnouncement;
  onDismiss: () => void;
  titleId: string;
  descriptionId: string;
};

const KIND_RANK: Record<AnnouncementKind, number> = {
  closure: 0,
  promo: 1,
  notice: 2,
};

export function mapPopupAnnouncement(row: {
  id: number;
  title?: string | null;
  message: string | null;
  link_url: string | null;
  kind?: string | null;
  layout_key?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
  closes_on?: string | null;
  sort_order: number | null;
  is_active: boolean | null;
  created_at?: string | null;
}): PopupAnnouncement | null {
  if (!row.message) return null;
  return {
    id: row.id,
    title: row.title ?? null,
    message: row.message,
    link_url: row.link_url,
    kind: isAnnouncementKind(row.kind) ? row.kind : "notice",
    layout_key: isPopupLayoutKey(row.layout_key) ? row.layout_key : "default",
    starts_at: row.starts_at ?? null,
    expires_at: row.expires_at ?? null,
    closes_on: row.closes_on ?? null,
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? false,
    created_at: row.created_at ?? undefined,
  };
}

export function pickLivePopup<T extends PopupAnnouncement>(
  items: T[],
  now = new Date(),
): T | null {
  const live = items.filter((item) => isAnnouncementLive(item, now));

  live.sort((a, b) => {
    const rank = KIND_RANK[a.kind] - KIND_RANK[b.kind];
    if (rank !== 0) return rank;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.id - b.id;
  });

  return live[0] ?? null;
}
