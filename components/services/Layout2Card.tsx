// components/cards/Layout2Card.tsx
import type { ServiceRow } from "@/lib/database.types";

type Props = {
  service: ServiceRow;
};

export default function Layout2Card({ service }: Props) {
  const items = service.layout2_data?.items;

  if (!items || Object.keys(items).length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">Add‑ons</h4>
      <ul className="space-y-1 text-sm text-gray-600">
        {Object.entries(items).map(([name, price]) => (
          <li key={name} className="flex justify-between">
            <span>{name}</span>
            <span className="font-semibold">${price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
