import { MdLocalCarWash } from "react-icons/md";
import { servicesList, addOnsList } from "@/data/services";

const ServicesPage = () => {
    return (
        <div className="flex flex-col py-32">
            <div className="mx-auto font-lexend text-lg">Services and Pricing</div>
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

            {/* Extra Services / Add-Ons */}
            <div className="mx-auto my-10 rounded-md">
                <div className="mx-auto font-lexend text-lg">
                    Extras Services (Add-on)
                </div>
                <div className="mx-auto font-lexend text-sm">
                    (Available for any wash package)
                </div>
                <div className="my-4 flex flex-col gap-3 rounded-md border border-black/30 px-6 py-4">
                    {Object.entries(addOnsList).map(([service, price]) => (
                        <div key={service} className="flex justify-between font-questrial">
                            <div>{service}</div>
                            <div>${price}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Extra Services / Add-Ons */}

            {/* Professional Car Detailing */}
            <div className="mx-auto my-10 rounded-md">
                <div className="mx-auto font-lexend text-lg">
                    Extras Services (Add-on)
                </div>
                <div className="mx-auto font-lexend text-sm">
                    (Available for any wash package)
                </div>
                <div className="my-4 flex flex-col gap-3 rounded-md border border-black/30 px-6 py-4">
                    {Object.entries(addOnsList).map(([service, price]) => (
                        <div key={service} className="flex justify-between font-questrial">
                            <div>{service}</div>
                            <div>${price}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Professional Car Detailing */}
        </div>
    );
};

export default ServicesPage;
