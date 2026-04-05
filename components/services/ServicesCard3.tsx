import { AllService } from "@/lib/database.types";
import { FaCheck } from "react-icons/fa";

interface ServicesCard3Props {
  services: AllService[];
  packageId: number;
}

const ServicesCard3 = ({ services, packageId }: ServicesCard3Props) => {
  const servicesForPackage = services.filter((s) => s.package_id === packageId);
  const pkg = servicesForPackage[0]?.services_packages;

  const formatServiceName = (name: string | null | undefined): string => {
    if (!name) return "";
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getPrice = (size: string) =>
    parseFloat(
      servicesForPackage.find((s) => s.size === size)?.price || "0",
    ).toFixed(2);

  if (!pkg) return null;

  return (
    <div className="flex w-full max-w-80 flex-col gap-5 rounded-md border border-black/30 p-4 pb-10 shadow-lg">
      <header className="shrink-0 rounded-md bg-black/10 p-2 text-black">
        <h3 className="text-center font-lexend text-xl">
          {formatServiceName(pkg.name)}
        </h3>
        {pkg.description && (
          <p className="px-2 text-center font-lexend text-xs">
            {pkg.description}
          </p>
        )}
      </header>

      <ul className="flex min-h-0 flex-1 flex-col gap-2">
        {pkg.types?.map((feature: string) => (
          <li key={feature} className="flex items-center gap-3 pl-3">
            <FaCheck className="shrink-0 text-xl text-yellow-500" />
            <span className="font-questrial text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        {[
          { size: "small", label: "Most Cars / Sedan" },
          { size: "medium", label: "Mid-Size / Crossover" },
          { size: "large", label: "Full-Size / SUV" },
        ].map(({ size, label }) => (
          <div key={size} className="flex justify-between px-4 font-questrial">
            <span>{label}:</span>
            <span>${getPrice(size)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesCard3;
