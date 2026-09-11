import { getLiveAnnouncements } from "@/lib/load-announcements";
import TopBannerRotator from "@/components/TopBannerRotator";

const TopBanner = async () => {
  const announcements = (await getLiveAnnouncements())
    .filter((row) => row.show_in_banner)
    .map((row) => ({
      id: row.id,
      message: row.message,
      link_url: row.link_url,
    }));

  if (announcements.length === 0) return null;

  return <TopBannerRotator announcements={announcements} />;
};

export default TopBanner;
