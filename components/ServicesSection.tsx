import { MdLocalCarWash } from "react-icons/md";
import Link from "next/link";
import { servicesList } from "@/data/services";

const ServicesSection = () => {
  return (
    <div className="px-6 pt-6 pb-16 md:px-24 lg:px-40">
      <div className="pt-10 text-center font-lexend text-3xl">
        Services and Pricing
      </div>
      <div className="mx-auto my-4 w-fit rounded-sm bg-black px-5 py-3 text-center font-questrial text-xl font-bold text-white lg:px-10 lg:text-2xl">
        Starting at $14.99
      </div>
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
            <div className="flex min-h-0 flex-1 flex-col gap-2 pl-2">
              {service.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <MdLocalCarWash className="shrink-0 text-xl text-blue-900" />
                  <div className="font-questrial text-sm">{feature}</div>
                </div>
              ))}
            </div>
          </div>
          // Card End
        ))}
      </div>
      <div className="mx-auto mt-10 w-fit cursor-pointer rounded-md border border-black/50 px-7 py-3 text-center font-lexend text-sm shadow-2xl transition-colors duration-300 hover:bg-black/50">
        <Link href="/services">See All Services</Link>
      </div>
    </div>
  );
};

export default ServicesSection;
