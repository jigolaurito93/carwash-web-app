// components/ShopInfoSection.tsx
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

const ShopInfoSection = async () => {
  const { data: shop_hours, error } = await supabase
    .from("shop_hours")
    .select("day_name, open_time, close_time, is_closed")
    .order("day_name", { ascending: true });

  const { data: shopInfo, error: shopError } = await supabase
    .from("shop_info")
    .select("address, phone, email")
    .single();

  if (error || shopError || !shop_hours || !shopInfo) {
    return (
      <div className="bg-black/90 px-3 py-7 text-center text-red-500">
        Error loading shop information
      </div>
    );
  }

  // Helper: format time to 12‑hour AM/PM
  const formatTime = (time: string | null) => {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  // Group Mon–Fri with same open/close and not closed
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const monFri = weekdays.every((day) =>
    shop_hours.some(
      (h) =>
        h.day_name === day &&
        h.open_time === shop_hours[0]?.open_time &&
        h.close_time === shop_hours[0]?.close_time &&
        !h.is_closed,
    ),
  );

  const hasSat = shop_hours.some(
    (h) => h.day_name === "Saturday" && !h.is_closed,
  );
  const hasSun = shop_hours.some((h) => h.day_name === "Sunday");

  return (
    <div className="bg-black/90 px-12 py-7 font-lexend text-white md:py-10">
      {/* Stack columns on small screens, row on md+ */}
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 text-center sm:flex-row sm:items-start sm:gap-20 sm:text-left md:max-w-2xl md:gap-20 lg:gap-36">
        {/* Operating Hours */}
        <div className="w-full max-w-60 space-y-4 md:max-w-68">
          <div className="text-center text-xl md:text-2xl">Operating Hours</div>
          <ul className="w-full space-y-1 font-questrial text-sm md:text-lg">
            {/* Mon–Fri block */}
            {monFri && (
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span>
                  {formatTime(shop_hours[0]?.open_time)} -{" "}
                  {formatTime(shop_hours[0]?.close_time)}
                </span>
              </li>
            )}

            {/* Saturday block */}
            {hasSat && (
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>
                  {formatTime(
                    shop_hours.find((h) => h.day_name === "Saturday")
                      ?.open_time,
                  )}{" "}
                  -{" "}
                  {formatTime(
                    shop_hours.find((h) => h.day_name === "Saturday")
                      ?.close_time,
                  )}
                </span>
              </li>
            )}

            {/* Sunday (closed) */}
            {hasSun && (
              <li className="flex justify-between text-blue-400">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="w-full max-w-70 space-y-4 sm:max-w-60 md:max-w-55">
          <div className="text-center text-xl md:text-2xl">Contact Us</div>
          <div className="flex w-full flex-col justify-center space-y-1 font-questrial text-sm md:text-lg">
            {/* Address */}
            <div className="flex items-start gap-3 text-left">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-blue-500" />
              <span
                dangerouslySetInnerHTML={{
                  __html: shopInfo.address.replace(/\n/g, "<br />"),
                }}
              />
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="shrink-0 text-blue-500" />
              <a href={`tel:${shopInfo.phone}`} className="hover:text-white">
                {shopInfo.phone}
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <FaEnvelope className="shrink-0 text-blue-500" />
              <a href={`mailto:${shopInfo.email}`} className="hover:text-white">
                {shopInfo.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopInfoSection;
