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
import ServicesCard3 from "@/components/services/ServicesCard3";

const DisplayServices = () => {
    return (
        <div className="flex flex-col px-4 pt-20 pb-32">
            {/* Black bar on top of navbar */}
            <div className="fixed top-0 left-0 h-20 w-full bg-black" />
            {/* Services and Pricing */}
            <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
                Services and Pricing
            </div>

            <div>
                <ServicesCard3 />
            </div>

        </div>
    );
};

export default DisplayServices;
