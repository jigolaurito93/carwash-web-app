type CustomerService = {
  id: number;
  name: string;
  description?: string;
  features: string | Array<{ service: string; price: number }>;
  price_small?: number | null;
  price_medium?: number | null;
  price_large?: number | null;
  is_active: boolean;
  sort_order: number;
  service_type: "tiered" | "other";
  created_at: string;
  updated_at: string;
};

interface OtherCardProps {
  service: CustomerService;
}

export function OtherCard({ service }: OtherCardProps) {
  const prices =
    typeof service.features === "object" && Array.isArray(service.features)
      ? (service.features as Array<{ service: string; price: number }>)
      : [];

  return (
    <div className="mx-auto flex w-full max-w-80 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg sm:max-w-300 md:max-w-90">
      <div className="flex flex-col gap-1 rounded-md bg-black/10 px-2 py-2">
        <h3 className="text-center font-lexend text-xl">{service.name}</h3>
        {service.description && (
          <p className="px-2 text-center font-lexend text-xs">
            {service.description}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 px-3 lg:px-3">
        {prices.map((other, i) => (
          <div
            key={`${other.service}-${i}`}
            className="flex justify-between font-questrial text-sm"
          >
            <span>{other.service}</span>
            <span>${other.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
