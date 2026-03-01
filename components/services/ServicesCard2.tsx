import { FaCheck } from "react-icons/fa";

interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  vehicles: Record<string, number>;
}

interface ServicesItemProps {
  serviceCard: ServiceItem;
}

const ServicesCard2 = ({ serviceCard }: ServicesItemProps) => {
  return (
    <div className="flex w-full max-w-80 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg xl:pb-10">
      <div className="shrink-0 rounded-md bg-black/10 p-2 text-black">
        <div className="text-center font-lexend text-xl">
          {serviceCard.title}
        </div>
        <div className="px-2 text-center font-lexend text-xs">
          {serviceCard.description}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {serviceCard.features.map((feature) => (
          <div key={feature} className="flex items-center gap-3 pl-3">
            <FaCheck className="shrink-0 text-xl text-yellow-500" />
            <div className="font-questrial text-sm">{feature}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {Object.entries(serviceCard.vehicles).map(([size, price]) => (
          <div key={price} className="flex justify-between px-4 font-questrial">
            <div>{size} :</div>
            <div>${price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesCard2;
