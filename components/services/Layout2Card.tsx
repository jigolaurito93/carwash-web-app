// components/cards/Layout2Card.tsx
import type { ServiceRow } from "@/lib/database.types";

type Props = {
  service: ServiceRow;
};

export default function Layout2Card({ service }: Props) {
  const items = service.layout2_data?.items;

  if (!items || Object.keys(items).length === 0) return null;

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(/\.?0+$/, "");
  };

  return (
    <div className="mt-4">
      <ul className="space-y-1 text-sm text-white/90">
        {Object.entries(items).map(([name, price]) => (
          <li key={name} className="flex justify-between">
            <span>{name}</span>
            <span className="">${formatPrice(price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
