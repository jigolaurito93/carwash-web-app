import { pickLivePopup } from "@/lib/popup-announcements";
import { getLivePopupAnnouncements } from "@/lib/load-popup-announcements";
import AnnouncementPopupModal from "@/components/AnnouncementPopupModal";

export default async function AnnouncementPopup() {
  const announcement = pickLivePopup(await getLivePopupAnnouncements());
  if (!announcement) return null;

  return <AnnouncementPopupModal announcement={announcement} />;
}
