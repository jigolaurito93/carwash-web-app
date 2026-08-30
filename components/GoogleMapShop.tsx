"use client";
import type { ShopMapAddress } from "@/lib/supabase.types";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type ShopMapProps = {
  shopAddress: ShopMapAddress | null;
};

const containerStyle = {
  width: "100%",
  height: "500px",
};

const DEFAULT_CENTER = { lat: 41.882657, lng: -87.623303 };

const ShopMap = ({ shopAddress }: ShopMapProps) => {
  const center = {
    lat: shopAddress?.latitude ?? DEFAULT_CENTER.lat,
    lng: shopAddress?.longitude ?? DEFAULT_CENTER.lng,
  };

  // Formats the address to look like this: "123 Main St, Chicago, IL 60601"
  const formattedAddress = [
    shopAddress?.address1,
    shopAddress?.address2,
    `${shopAddress?.city}, ${shopAddress?.state} ${shopAddress?.zip}`,
  ]
    .filter(Boolean)
    .join(", ");

  // It builds the URL for the “Get Directions” link. When someone clicks it, Google Maps opens with directions to your shop.
  // It will look like this: "...&destination=123%20Main%20St%2C%20Chicago%2C%20IL%2060601"
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    formattedAddress,
  )}`;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey as string,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="mx-auto flex h-112.5 w-full max-w-187.5 flex-col space-y-3 sm:h-137.5">
      <div className="overflow-hidden">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          <Marker position={center} />
        </GoogleMap>
      </div>

      <div className="font-questrial text-sm text-gray-100">
        <div className="text-lg font-semibold text-yellow-400 sm:text-2xl">
          Onyx Premium Carwash
        </div>
        <div className="sm:text-lg">{formattedAddress}</div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded bg-blue-600 px-3 py-1 font-questrial font-semibold text-white hover:bg-blue-500 sm:px-6 sm:text-lg"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default ShopMap;
