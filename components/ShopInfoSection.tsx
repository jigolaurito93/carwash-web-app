import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import type { Database } from "@/lib/database.types";
import { formatShopAddress } from "@/lib/format-shop-address";
import { cn } from "@/lib/utils";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type ShopHourRow = {
  day_name: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean | null;
};

type HourGroup = {
  start: string;
  end: string;
  closed: boolean;
  openTime: string | null;
  closeTime: string | null;
};

function formatTime(time: string | null | undefined) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return "";
  const period = h < 12 ? "AM" : "PM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function groupHours(hours: ShopHourRow[]): HourGroup[] {
  const byName = new Map(hours.map((row) => [row.day_name, row]));
  const groups: HourGroup[] = [];

  for (const day of DAY_ORDER) {
    const row = byName.get(day);
    if (!row) continue;

    const closed = Boolean(row.is_closed);
    const last = groups.at(-1);
    const sameAsLast =
      last &&
      last.closed === closed &&
      last.openTime === row.open_time &&
      last.closeTime === row.close_time;

    if (sameAsLast && last) {
      last.end = day;
      continue;
    }

    groups.push({
      start: day,
      end: day,
      closed,
      openTime: row.open_time,
      closeTime: row.close_time,
    });
  }

  return groups;
}

function dayRangeLabel(start: string, end: string) {
  if (start === end) return start;
  return `${start.slice(0, 3)} – ${end.slice(0, 3)}`;
}

const ShopInfoSection = async ({
  variant = "dark",
}: {
  variant: "dark" | "light";
}) => {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: shop_hours, error } = await supabase
    .from("shop_hours")
    .select("day_name, open_time, close_time, is_closed")
    .order("day_name", { ascending: true });

  const { data: shopInfo, error: shopError } = await supabase
    .from("shop_info")
    .select("address1, address2, city, state, zip, phone, email")
    .single();

  const isDark = variant === "dark";

  if (error || shopError || !shop_hours || !shopInfo) {
    return (
      <div
        className={cn(
          "px-6 py-10 text-center font-questrial text-red-500",
          isDark ? "bg-black/90" : "bg-white",
        )}
      >
        Error loading shop information
      </div>
    );
  }

  const hourGroups = groupHours(shop_hours);
  const formattedAddress = formatShopAddress(shopInfo);
  const streetLine = [shopInfo.address1, shopInfo.address2]
    .filter((part) => part?.trim())
    .join(", ");
  const cityLine = [
    shopInfo.city,
    [shopInfo.state, shopInfo.zip].filter(Boolean).join(" "),
  ]
    .filter((part) => part?.trim())
    .join(", ");
  const mapsHref = formattedAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`
    : null;

  const iconWrap = cn(
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-blue-500",
    isDark ? "border-white/15 bg-white/5" : "border-black/10 bg-black/5",
  );

  return (
    <section
      className={cn(
        "px-6 py-14 font-lexend sm:px-10 md:py-20",
        isDark ? "bg-black/90 text-white" : "bg-white text-black",
      )}
    >
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-0">
        <div
          className={cn(
            "md:pr-12 lg:pr-16",
            isDark
              ? "md:border-r md:border-white/15"
              : "md:border-r md:border-black/10",
          )}
        >
          <p className="font-questrial text-[11px] font-bold tracking-[0.22em] text-yellow-400 uppercase">
            Plan your visit
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Operating Hours
          </h2>
          <div className="mt-3 h-0.5 w-12 bg-yellow-400" />

          <ul className="mt-8 space-y-0 font-questrial text-sm md:text-base">
            {hourGroups.map((group) => (
              <li
                key={`${group.start}-${group.end}`}
                className={cn(
                  "flex items-baseline justify-between gap-6 border-b py-3 last:border-b-0",
                  isDark ? "border-white/10" : "border-black/10",
                )}
              >
                <span>{dayRangeLabel(group.start, group.end)}</span>
                <span
                  className={cn(
                    "tabular-nums",
                    group.closed && "text-blue-400",
                  )}
                >
                  {group.closed
                    ? "Closed"
                    : `${formatTime(group.openTime)} – ${formatTime(group.closeTime)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:pl-12 lg:pl-16">
          <p className="font-questrial text-[11px] font-bold tracking-[0.22em] text-yellow-400 uppercase">
            Get in touch
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Contact Us
          </h2>
          <div className="mt-3 h-0.5 w-12 bg-yellow-400" />

          <ul className="mt-8 space-y-5 font-questrial text-sm md:text-base">
            {formattedAddress && (
              <li className="flex items-start gap-4">
                <span className={iconWrap} aria-hidden="true">
                  <FaMapMarkerAlt className="h-4 w-4" />
                </span>
                {mapsHref ? (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 leading-relaxed transition-colors hover:text-yellow-400"
                  >
                    {streetLine ? (
                      <span className="block">{streetLine}</span>
                    ) : null}
                    {cityLine ? (
                      <span className="block">{cityLine}</span>
                    ) : null}
                  </a>
                ) : (
                  <span className="leading-relaxed">
                    {streetLine ? (
                      <span className="block">{streetLine}</span>
                    ) : null}
                    {cityLine ? (
                      <span className="block">{cityLine}</span>
                    ) : null}
                  </span>
                )}
              </li>
            )}

            {shopInfo.phone && (
              <li className="flex items-center gap-4">
                <span className={iconWrap} aria-hidden="true">
                  <FaPhoneAlt className="h-4 w-4" />
                </span>
                <a
                  href={`tel:${shopInfo.phone}`}
                  className="transition-colors hover:text-yellow-400"
                >
                  {shopInfo.phone}
                </a>
              </li>
            )}

            {shopInfo.email && (
              <li className="flex items-center gap-4">
                <span className={iconWrap} aria-hidden="true">
                  <FaEnvelope className="h-4 w-4" />
                </span>
                <a
                  href={`mailto:${shopInfo.email}`}
                  className="break-all transition-colors hover:text-yellow-400"
                >
                  {shopInfo.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ShopInfoSection;
