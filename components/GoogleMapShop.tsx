"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 41.882657, // Chicago Bean latitude
  lng: -87.623303, // Chicago Bean longitude (note the minus)
};
const ShopMap = () => {
  const shopAddress = "123 Detailers Way, Auto City, ST 12345";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    shopAddress,
  )}`;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey as string,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          <Marker position={center} />
        </GoogleMap>
      </div>

      <div className="font-questrial text-sm text-gray-100">
        <div className="text-lg font-semibold text-white">
          Onyx Premium Carwash
        </div>
        <div>{shopAddress}</div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-500"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default ShopMap;
