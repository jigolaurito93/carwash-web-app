interface ServiceRow {
  service: string;
  price: string;
}

interface ServicesCardData {
  title: string;
  subtitle?: string;
  services: ServiceRow[];
}

const ServicesCard4 = ({ serviceCard }: { serviceCard: ServicesCardData }) => {
  const formatServiceName = (name: string | null | undefined): string => {
    if (!name) return "";
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice)
      ? price
      : numPrice % 1 === 0
        ? `${numPrice}.00`
        : price;
  };

  const formattedTitle = formatServiceName(serviceCard.title);

  return (
    <div className="flex w-full flex-1 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg xl:pb-10">
      <div className="flex flex-col gap-1 rounded-md bg-black/10 px-2 py-2">
        <h3 className="text-center font-lexend text-xl">{formattedTitle}</h3>
        {serviceCard.subtitle && (
          <p className="px-2 text-center font-lexend text-xs">
            {serviceCard.subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 px-3 lg:px-3">
        {serviceCard.services.map((detail, i) => (
          <div
            key={`${detail.service}-${i}`}
            className="flex justify-between font-questrial text-sm"
          >
            <span>{detail.service}</span>
            <span>${formatPrice(detail.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesCard4;
