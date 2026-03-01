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
      {/* Services and Pricing */}
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Services and Pricing
      </div>
      <div className="flex flex-wrap items-stretch justify-center gap-7">
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
      <div className="item-stretch flex flex-wrap justify-center gap-7">
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
      <div className="item-stretch flex flex-wrap justify-center gap-7">
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
