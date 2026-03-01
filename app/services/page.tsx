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
      <div className="mx-auto py-10 font-lexend text-lg">
        Services and Pricing
      </div>

      {/* Services and Pricing */}
      <div className="flex flex-wrap items-stretch justify-center gap-7">
        <ServicesCard2 serviceCard={servicesList[0]} />
        <ServicesCard2 serviceCard={servicesList[1]} />
        <ServicesCard2 serviceCard={servicesList[2]} />
        <ServicesCard2 serviceCard={otherWashList} />
      </div>
      {/* Services and Pricing End */}

      <div className="mx-auto py-10 font-lexend text-lg">Other Services</div>
      <div className="item-stretch flex flex-wrap justify-center gap-7">
        {/* Add-Ons List */}
        <ServicesCard serviceCard={addOnsList} />
        {/* Paint Protection List */}
        <ServicesCard serviceCard={paintProtectionList} />
        {/* Hand Wax List */}
        <ServicesCard serviceCard={waxList} />
        {/* Engine Bay Cleaning List */}
        <ServicesCard serviceCard={engineBayCleaningList} />
        {/* Detailing List */}
        {/* <ServicesCard serviceCard={detailList} /> */}
      </div>

      <div className="mx-auto py-10 font-lexend text-lg">
        Detailing Services
      </div>
      <div className="item-stretch flex flex-wrap justify-center gap-7">
        <ServicesCard2 serviceCard={completeDetailList} />
        <ServicesCard2 serviceCard={interiorDetailList} />
        <ServicesCard2 serviceCard={exteriorDetailList} />
        <ServicesCard2 serviceCard={miniDetailList} />
      </div>
    </div>
  );
};

export default ServicesPage;
