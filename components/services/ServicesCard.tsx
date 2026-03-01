interface ServiceRow {
  service: string;
  price: string;
  description?: string;
}

interface ServicesCardData {
  title: string;
  subtitle?: string;
  description?: string;
  services: ServiceRow[];
}

interface ServicesCardProps {
  serviceCard: ServicesCardData;
}

const ServicesCard = ({ serviceCard }: ServicesCardProps) => {
  const subtitleText = serviceCard.subtitle ?? serviceCard.description ?? "";
  return (
    <div className="flex w-full max-w-80 flex-col rounded-md border border-black/30 p-4 pb-10 shadow-lg xl:pb-10">
      <div className="flex flex-col gap-1 rounded-md bg-black/10 px-2 py-2">
        <div className="text-center font-lexend text-lg">
          {serviceCard.title}
        </div>
        {subtitleText && (
          <div className="px-2 text-center font-lexend text-xs">
            {subtitleText}
          </div>
        )}
      </div>
      <div className="my-4 flex flex-col gap-2 px-3 lg:px-3">
        {serviceCard.services.map((detail) => (
          <div
            key={detail.service}
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
