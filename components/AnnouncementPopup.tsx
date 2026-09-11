import { pickModalAnnouncement } from "@/lib/announcements";
import { getLiveAnnouncements } from "@/lib/load-announcements";
import AnnouncementPopupModal from "@/components/AnnouncementPopupModal";

export default async function AnnouncementPopup() {
  const announcement = pickModalAnnouncement(await getLiveAnnouncements());
  if (!announcement) return null;

  return <AnnouncementPopupModal announcement={announcement} />;
}
