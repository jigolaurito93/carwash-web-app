// components/cards/Layout1Card.tsx
import type { ServiceRow } from "@/lib/database.types";

type Props = {
  service: ServiceRow;
};

export default function Layout1Card({ service }: Props) {
  const data = service.layout1_data;

  return (
    <div className="mt-4">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">
        What&apos;s included
      </h4>
      <ul className="mb-3 list-inside list-disc text-sm text-gray-600">
        {data?.includes
          .filter((i: string) => i.trim())
          .map((item, idx) => (
            <li key={idx}>{item.trim()}</li>
          ))}
      </ul>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Small:</span>{" "}
          <span className="font-semibold">
            ${data?.small_car_price.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Medium:</span>{" "}
          <span className="font-semibold">
            ${data?.medium_car_price.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Large:</span>{" "}
          <span className="font-semibold">
            ${data?.large_car_price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
