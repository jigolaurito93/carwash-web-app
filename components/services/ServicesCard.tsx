// Card for Other Services

// Interface for the Other Services Card
interface ServicesCardData {
  title: string;
  subtitle?: string;
  services: ServiceRow[];
}
// Interface for the Other Services (services list)
interface ServiceRow {
  service: string;
  price: string;
}
// Interface for the Other Services Card Props
interface ServicesCardProps {
  serviceCard: ServicesCardData;
}

const ServicesCard = ({ serviceCard }: ServicesCardProps) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg xl:pb-10">
      <div className="flex flex-col gap-1 rounded-md bg-black/10 px-2 py-2">
        <div className="text-center font-lexend text-xl">
          {serviceCard.title}
        </div>

        <div className="px-2 text-center font-lexend text-xs">
          {serviceCard.subtitle}
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 lg:px-3">
        {serviceCard.services.map((detail, i) => (
          <div
            key={`${detail.service}-${i}`}
            className="flex justify-between font-questrial text-sm"
          >
            <div>{detail.service}</div>
            <div>${detail.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesCard;
