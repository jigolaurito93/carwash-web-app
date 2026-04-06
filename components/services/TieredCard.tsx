import { FaCheck } from "react-icons/fa";

type CustomerService = {
  id: number;
  name: string;
  description?: string;
  features: string[];
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
    <div className="mx-auto flex w-full max-w-80 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg sm:max-w-300 md:max-w-90">
      <header className="shrink-0 rounded-md bg-black/10 p-2 text-black">
        <h3 className="text-center font-lexend text-xl">{service.name}</h3>
        {service.description && (
          <p className="px-2 text-center font-lexend text-xs">
            {service.description}
          </p>
        )}
      </header>

      <ul className="flex min-h-0 flex-1 flex-col gap-2">
        {service.features?.map((feature: string) => (
          <li key={feature} className="flex items-center gap-3 pl-3">
            <FaCheck className="shrink-0 text-xl text-yellow-500" />
            <span className="font-questrial text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <div className="flex justify-between px-4 font-questrial">
          <span>Most Cars / Sedan:</span>
          <span>${service.price_small}</span>
        </div>
        <div className="flex justify-between px-4 font-questrial">
          <span>Mid-Size / Crossover:</span>
          <span>${service.price_medium}</span>
        </div>
        <div className="flex justify-between px-4 font-questrial">
          <span>Full-Size / SUV:</span>
          <span>${service.price_large}</span>
        </div>
      </div>
    </div>
  );
}
