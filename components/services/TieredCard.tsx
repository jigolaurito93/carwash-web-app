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

interface TieredCardProps {
  service: CustomerService;
}

export function TieredCard({ service }: TieredCardProps) {
  return (
    <div className="mb-12 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <h2 className="flex-1 pr-4 text-3xl font-bold text-gray-900">
          {service.name}
        </h2>
        {service.description && (
          <div className="bg-liner-to-r rounded-full from-blue-500 to-purple-600 px-4 py-1 text-sm font-semibold text-white">
            {service.description}
          </div>
        )}
      </div>

      {/* Features - FIXED split */}
      {typeof service.features === "string" && service.features && (
        <div className="mb-8">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            What's Included
            <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-800">
              Everything above +
            </span>
          </h3>
          <ul className="list-none space-y-2 text-gray-700">
            {service.features
              .split("\n") // ✅ Fixed: single quotes, not escaped
              .filter((line) => line.trim())
              .map((feature, index) => (
                <li
                  key={index}
                  className="relative flex items-start gap-3 pl-6 before:absolute before:top-1 before:left-0 before:h-2 before:w-2 before:rounded-full before:bg-blue-500"
                >
                  <span>{feature.trim()}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 gap-6 rounded-xl bg-linear-to-r from-gray-50 to-blue-50 p-6 md:grid-cols-3">
        <div className="text-center">
          <div className="mb-1 text-sm font-medium tracking-wide text-gray-500 uppercase">
            Most Cars / Sedan
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${service.price_small?.toFixed(2) || "—"}
          </div>
        </div>

        <div className="text-center">
          <div className="mb-1 text-sm font-medium text-gray-500 uppercase">
            Mid-Size / Crossover
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${service.price_medium?.toFixed(2) || "—"}
          </div>
        </div>

        <div className="text-center">
          <div className="mb-1 text-sm font-medium text-gray-500 uppercase">
            Full-Size / SUV
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${service.price_large?.toFixed(2) || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
