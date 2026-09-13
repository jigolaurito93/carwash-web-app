export const ANNOUNCEMENT_KINDS = ["notice", "promo", "closure"] as const;

export type AnnouncementKind = (typeof ANNOUNCEMENT_KINDS)[number];

export type PublicAnnouncement = {
  id: number;
  title: string | null;
  message: string;
  link_url: string | null;
  kind: AnnouncementKind;
  show_in_banner: boolean;
  starts_at: string | null;
  expires_at: string | null;
  closes_on: string | null;
  sort_order: number;
  is_active: boolean;
};

export function isAnnouncementKind(
  value: string | null | undefined,
): value is AnnouncementKind {
  return value === "notice" || value === "promo" || value === "closure";
}

export function parseYmdLocal(ymd: string): Date | null {
  const match = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function isoToDatetimeLocalValue(
  iso: string | null | undefined,
): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return toDatetimeLocalValue(date);
}

export function datetimeLocalToIso(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function endOfLocalDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 0, 0);
  return next;
}

export function isAnnouncementLive(
  row: {
    is_active: boolean | null;
    starts_at: string | null;
    expires_at: string | null;
  },
  now = new Date(),
): boolean {
  if (!row.is_active) return false;
  if (row.starts_at) {
    const startsAt = new Date(row.starts_at);
    if (!Number.isNaN(startsAt.getTime()) && startsAt > now) return false;
  }
  if (row.expires_at) {
    const expiresAt = new Date(row.expires_at);
    if (!Number.isNaN(expiresAt.getTime()) && expiresAt <= now) return false;
  }
  return true;
}

export function announcementStatus(
  row: {
    is_active: boolean | null;
    starts_at: string | null;
    expires_at: string | null;
  },
  now = new Date(),
): "hidden" | "scheduled" | "expired" | "live" {
  if (!row.is_active) return "hidden";
  if (row.starts_at) {
    const startsAt = new Date(row.starts_at);
    if (!Number.isNaN(startsAt.getTime()) && startsAt > now) return "scheduled";
  }
  if (row.expires_at) {
    const expiresAt = new Date(row.expires_at);
    if (!Number.isNaN(expiresAt.getTime()) && expiresAt <= now)
      return "expired";
  }
  return "live";
}

export function liveClosureAnnouncements<T extends PublicAnnouncement>(
  items: T[],
  now = new Date(),
): T[] {
  return items.filter(
    (item) => item.kind === "closure" && isAnnouncementLive(item, now),
  );
}

export function defaultModalTitle(kind: AnnouncementKind): string {
  if (kind === "closure") return "We'll be closed";
  if (kind === "promo") return "Special offer";
  return "Announcement";
}

export function announcementKindLabel(kind: AnnouncementKind): string {
  if (kind === "closure") return "Closed day";
  if (kind === "promo") return "Promo";
  return "Notice";
}
