import { MdLocalCarWash } from "react-icons/md";
import { servicesList, addOnsList, detailList } from "@/data/services";
import ServicesCard from "@/components/services/ServicesCard";
import ServicesCard2 from "@/components/services/ServicesCard2";

const ServicesPage = () => {
  return (
    <div className="flex flex-col px-4 py-32">
      <div className="mx-auto font-lexend text-lg">Services and Pricing</div>

      {/* Services and Pricing */}
      <ServicesCard2 />
      {/* Services and Pricing End */}

      <div className="item-stretch flex flex-wrap justify-center gap-7">
        {/* Add-Ons List */}
        <ServicesCard serviceCard={addOnsList} />
        {/* Detailing List */}
        <ServicesCard serviceCard={detailList} />
      </div>
    </div>
  );
};

export default ServicesPage;
