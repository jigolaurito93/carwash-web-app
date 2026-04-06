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
    <div className="mb-12 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <h2 className="flex-1 pr-4 text-3xl font-bold text-gray-900">
          {service.name}
        </h2>
        {service.description && (
          <div className="rounded-full bg-linear-to-r from-green-500 to-emerald-600 px-4 py-1 text-sm font-semibold text-white">
            {service.description}
          </div>
        )}
      </div>

      {/* Price List */}
      <div className="mb-8 space-y-3">
        {prices.map((item, index) => (
          <div
            key={index}
            className="group flex items-center justify-between rounded-xl border border-gray-200 px-6 py-4 transition-all hover:bg-gray-50"
          >
            <span className="text-lg font-semibold text-gray-900 group-hover:text-gray-800">
              {item.service}
            </span>
            <span className="rounded-lg bg-linear-to-r from-gray-900 to-gray-700 px-4 py-2 text-2xl font-bold text-gray-900 shadow-md">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {prices.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No pricing available
        </div>
      )}
    </div>
  );
}
