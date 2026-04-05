import { FaCheck } from "react-icons/fa";

interface ServicesCard3Props {
    services: any[];
    packageId: number;
}

const ServicesCard3 = ({ services, packageId }: ServicesCard3Props) => {
    // Get all services for this package
    const servicesForPackage = services.filter((s) => s.package_id === packageId);
    const firstService = servicesForPackage[0];
    const pkg = firstService?.services_packages;

    const formatServiceName = (name: string | null | undefined): string => {
        if (!name) return "";
        return name
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const getPrice = (size: string) =>
        servicesForPackage.find((s) => s.size === size)?.price || 0;

    return (
        <div className="flex w-full max-w-80 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg">
            <div className="shrink-0 rounded-md bg-black/10 p-2 text-black">
                <div className="text-center font-lexend text-xl">
                    {formatServiceName(pkg?.name)}
                </div>
                <div className="px-2 text-center font-lexend text-xs">
                    {pkg?.description}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2">
                {pkg?.types?.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-3 pl-3">
                        <FaCheck className="shrink-0 text-xl text-yellow-500" />
                        <div className="font-questrial text-sm">{feature}</div>
                    </div>
                ))}
            </div>

            <div className="">
                <div className="flex justify-between px-4 font-questrial">
                    <div>Most Cars / Sedan :</div>
                    <div>${getPrice("small").toFixed(2)}</div>
                </div>
                <div className="flex justify-between px-4 font-questrial">
                    <div>Mid-Size / Crossover :</div>
                    <div>${getPrice("medium").toFixed(2)}</div>
                </div>
                <div className="flex justify-between px-4 font-questrial">
                    <div>Full-Size / SUV :</div>
                    <div>${getPrice("large").toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
};

export default ServicesCard3;
