interface DetailItem {
  service: string;
  price: string;
  description?: string;
}

interface ServicesCardProps {
  serviceCard: DetailItem[];
}

const ServicesCard = ({ serviceCard }: ServicesCardProps) => {
  return (
    <div className="flex w-full max-w-80 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg xl:pb-10">
      <div className="rounded-md bg-black/10 px-2 py-2">
        <div className="text-center font-lexend text-lg">
          Professional Car Detailing
        </div>
        <div className="text-center font-lexend text-xs">
          (Deep cleaning for those who want a "New Car" feel)
        </div>
      </div>
      <div className="my-4 flex flex-col gap-2 px-3 py-4 lg:px-6">
        {serviceCard.map((detail) => (
          <div
            key={detail.service}
            className="flex justify-between font-questrial"
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
