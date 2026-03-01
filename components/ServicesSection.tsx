import Link from "next/link";
import { servicesList } from "@/data/services";
import ServicesCard2 from "./services/ServicesCard2";

const ServicesSection = () => {
  return (
    <div className="px-6 pt-6 pb-16 md:px-24 lg:px-40">
      <div className="pt-10 text-center font-lexend text-3xl">
        Services and Pricing
      </div>
      <div className="mx-auto my-4 w-fit rounded-sm bg-black px-9 py-1 text-center font-questrial text-xl font-bold text-white lg:px-24 lg:text-2xl">
        Starting at $14.99
      </div>
      <div className="flex flex-wrap items-stretch justify-center gap-7">
        <ServicesCard2 serviceCard={servicesList[0]} />
        <ServicesCard2 serviceCard={servicesList[1]} />
        <ServicesCard2 serviceCard={servicesList[2]} />
      </div>
      <div className="mx-auto mt-10 w-fit cursor-pointer rounded-md border border-black/50 px-7 py-3 text-center font-lexend text-sm shadow-2xl transition-colors duration-300 hover:bg-black/50">
        <Link href="/services">See All Services</Link>
      </div>
    </div>
  );
};

export default ServicesSection;
