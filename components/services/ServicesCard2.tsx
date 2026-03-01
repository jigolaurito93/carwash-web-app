const ServicesCard2 = () => {
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-7">
      {servicesList.map((service) => (
        // Card
        <div
          key={service.title}
          className="flex w-full max-w-80 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg xl:pb-10"
        >
          <div className="shrink-0 rounded-md bg-black/10 p-2 text-black">
            <div className="text-center font-lexend text-xl">
              {service.title}
            </div>
            <div className="text-center font-lexend text-sm">
              {service.description}
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            {service.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <MdLocalCarWash className="shrink-0 text-xl text-blue-900" />
                <div className="font-questrial text-sm">{feature}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            {Object.entries(service.vehicles).map(([size, price]) => (
              <div
                key={price}
                className="flex justify-between px-4 font-questrial"
              >
                <div>{size} :</div>
                <div>${price}</div>
              </div>
            ))}
          </div>
        </div>
        // Card End
      ))}
    </div>
  );
};

export default ServicesCard2;
