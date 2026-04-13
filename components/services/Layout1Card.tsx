// components/cards/Layout1Card.tsx
import type { ServiceRow } from "@/lib/database.types";

type Props = {
  service: ServiceRow;
};

export default function Layout1Card({ service }: Props) {
  const data = service.layout1_data;

  return (
    <div className="flex h-full flex-col p-6">
      {/* Features */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-12">
        <h4 className="text-sm font-semibold tracking-wide text-white">
          What&apos;s included
        </h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-white/90">
          {data?.includes
            ?.filter((i: string) => i.trim())
            .map((item, idx) => (
              <li key={idx}>{item.trim()}</li>
            ))}
        </ul>
      </div>

      {/* Prices - simple flex, no grid */}
      <div className="shrink-0 space-y-1 border-t border-white/10 pt-4">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-gray-400">Most Cars / Sedans:</span>
          <span className="font-bold text-white">
            ${data?.small_car_price?.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-medium text-gray-400">
            Mid-Size / Crossover:
          </span>
          <span className="font-bold text-white">
            ${data?.medium_car_price?.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-medium text-gray-400">Full-Size / Large:</span>
          <span className="font-bold text-white">
            ${data?.large_car_price?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
