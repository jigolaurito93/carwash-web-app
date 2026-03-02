import {
  servicesList,
  addOnsList,
  otherWashList,
  paintProtectionList,
  waxList,
  engineBayCleaningList,
  completeDetailList,
  interiorDetailList,
  exteriorDetailList,
  miniDetailList,
} from "@/data/services";
import ServicesCard from "@/components/services/ServicesCard";
import ServicesCard2 from "@/components/services/ServicesCard2";

const ServicesPage = () => {
  return (
    <div className="flex flex-col px-4 pt-20 pb-32">
      {/* Black bar on top of navbar */}
      <div className="fixed top-0 left-0 h-[80px] w-full bg-black" />
      {/* Services and Pricing */}
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Services and Pricing
      </div>
      <div className="max-w-9xl mx-auto grid gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <ServicesCard2 serviceCard={servicesList[0]} />
        <ServicesCard2 serviceCard={servicesList[1]} />
        <ServicesCard2 serviceCard={servicesList[2]} />
        <ServicesCard2 serviceCard={otherWashList} />
      </div>
      {/* Services and Pricing End */}

      {/* Other Services */}
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Other Services
      </div>
      <div className="max-w-9xl mx-auto grid gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <ServicesCard serviceCard={addOnsList} />
        <ServicesCard serviceCard={paintProtectionList} />
        <ServicesCard serviceCard={waxList} />
        <ServicesCard serviceCard={engineBayCleaningList} />
      </div>
      {/* Other Services End */}

      {/* Detailing Services */}
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Detailing Services
      </div>
      <div className="max-w-9xl mx-auto grid gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <ServicesCard2 serviceCard={completeDetailList} />
        <ServicesCard2 serviceCard={interiorDetailList} />
        <ServicesCard2 serviceCard={exteriorDetailList} />
        <ServicesCard2 serviceCard={miniDetailList} />
      </div>
      {/* Detailing Services End */}
    </div>
  );
};

export default ServicesPage;
