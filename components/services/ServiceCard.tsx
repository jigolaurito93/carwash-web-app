import { HiShieldCheck } from "react-icons/hi";
import type { ServiceRow } from "@/lib/app.types";
import { cn } from "@/lib/utils";

type Props = {
  service: ServiceRow;
  phone?: string | null;
  variant?: "full" | "preview";
  className?: string;
};

function formatPrice(value: number) {
  return `$${value.toFixed(2).replace(/\.?0+$/, "")}`;
}

export default function ServiceCard({
  service,
  phone,
  variant = "full",
  className,
}: Props) {
  const isPreview = variant === "preview";
  const isLayout1 = service.card_layout === "layout1";
  const isLayout2 = service.card_layout === "layout2";
  const isLayout3 = service.card_layout === "layout3";
  const isLayout4 = service.card_layout === "layout4";
  const showPrices =
    (isLayout1 && service.layout1_data) || (isLayout4 && service.layout4_data);

  return (
    <div
      className={cn(
        "grid overflow-hidden bg-[#1c1c1c] backdrop-blur-sm",
        isPreview
          ? "h-full grid-rows-[56px_1fr] rounded-xl"
          : "hover:shadow-3xl mx-auto w-full max-w-90 grid-rows-[96px_1fr] rounded-2xl transition-all xl:max-w-250",
        className,
      )}
    >
      <div
        className={cn(
          "row-start-1 flex shrink-0 items-center justify-center bg-yellow-400",
          isPreview ? "h-14 px-3 py-2" : "h-24 p-4",
        )}
      >
        <div
          className={cn("text-center", isPreview ? "space-y-0.5" : "space-y-1")}
        >
          <h3
            className={cn(
              "font-lexend leading-tight font-bold text-gray-900",
              isPreview ? "text-sm" : "text-xl",
            )}
          >
            {service.name}
          </h3>
          {service.description && (
            <p
              className={cn(
                "font-lexend leading-tight text-gray-700",
                isPreview ? "text-[10px]" : "text-xs",
              )}
            >
              {service.description}
            </p>
          )}
        </div>
      </div>

      <div
        className={cn("row-start-2 overflow-y-auto", isPreview ? "p-3" : "p-6")}
      >
        {isLayout1 && service.layout1_data && (
          <div className={cn("space-y-2", isPreview ? "mb-2" : "mb-8")}>
            <h4
              className={cn(
                "font-semibold tracking-wide text-yellow-400",
                isPreview ? "mb-2 text-[11px]" : "text-md mb-4",
              )}
            >
              What&apos;s included
            </h4>
            <ul
              className={cn(
                "space-y-2 text-white/90",
                isPreview ? "text-[10px]" : "text-sm",
              )}
            >
              {service.layout1_data.includes
                ?.filter((item: string) => item.trim())
                .map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <HiShieldCheck
                      className={cn(
                        "mt-0.5 shrink-0 text-green-400",
                        isPreview ? "h-3 w-3" : "mt-1 h-4 w-4",
                      )}
                    />
                    <span className="leading-5">{item.trim()}</span>
                  </div>
                ))}
            </ul>
            {service.notes && !isPreview && (
              <p className="mt-10 text-sm text-gray-400 italic">
                {service.notes}
              </p>
            )}
          </div>
        )}

        {isLayout2 && service.layout2_data && (
          <div className={cn("space-y-2", isPreview ? "mb-2" : "mb-8")}>
            <h4
              className={cn(
                "font-semibold tracking-wide text-yellow-400",
                isPreview ? "mb-2 text-[11px]" : "text-md mb-4",
              )}
            >
              Add-Ons & Upgrades
            </h4>
            <ul
              className={cn(
                "space-y-1 text-white/90",
                isPreview ? "text-[10px]" : "text-sm",
              )}
            >
              {Object.entries(service.layout2_data.items || {}).map(
                ([name, price]) => (
                  <li key={name} className="flex items-start gap-2">
                    <span className="leading-5">{name}</span>
                    <span className="ml-auto font-medium">
                      {typeof price === "number" ? (
                        `$${price.toFixed(2)}`
                      ) : (
                        <span className="italic">{price}</span>
                      )}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

        {isLayout3 && service.layout3_data && (
          <div className={cn("space-y-2", isPreview ? "mb-2" : "mb-8")}>
            <p
              className={cn(
                "whitespace-pre-wrap text-white/90",
                isPreview ? "text-[10px] leading-4" : "text-sm leading-7",
              )}
            >
              {service.layout3_data}
            </p>
            {isPreview ? (
              <span className="mt-3 inline-block rounded bg-yellow-400 px-3 py-1 font-questrial text-[10px] font-bold tracking-wider text-black uppercase">
                Call for Quote
              </span>
            ) : (
              <button className="btnSaveYlw mt-14">
                <a href={`tel:${phone}`} className="hover:text-white">
                  Call for Quote
                </a>
              </button>
            )}
          </div>
        )}

        {isLayout4 && service.layout4_data && (
          <div
            className={cn(
              "space-y-2",
              isPreview ? "mb-2 text-[10px]" : "mb-8 text-sm",
            )}
          >
            <p className="text-md whitespace-pre-wrap text-white/90">
              {service.layout4_data.info}
            </p>
          </div>
        )}
      </div>

      {showPrices && (
        <div
          className={cn(
            "row-start-3 flex flex-col justify-center space-y-1 border-t border-white/10 bg-gray-900/50",
            isPreview ? "px-3 py-2" : "p-6 pt-4",
          )}
        >
          <div
            className={cn(
              "flex justify-between",
              isPreview ? "text-[10px]" : "text-sm",
            )}
          >
            <span className="font-bold text-gray-400">Most Cars / Sedans:</span>
            <span className="font-bold text-white">
              {formatPrice(
                (isLayout1
                  ? service.layout1_data?.small_car_price
                  : service.layout4_data?.small_car_price) ?? 0,
              )}
            </span>
          </div>
          <div
            className={cn(
              "flex justify-between",
              isPreview ? "text-[10px]" : "text-sm",
            )}
          >
            <span className="font-bold text-gray-400">
              Mid-Size / Crossover:
            </span>
            <span className="font-bold text-white">
              {formatPrice(
                (isLayout1
                  ? service.layout1_data?.medium_car_price
                  : service.layout4_data?.medium_car_price) ?? 0,
              )}
            </span>
          </div>
          <div
            className={cn(
              "flex justify-between",
              isPreview ? "text-[10px]" : "text-sm",
            )}
          >
            <span className="font-bold text-gray-400">Full-Size / Large:</span>
            <span className="font-bold text-white">
              {formatPrice(
                (isLayout1
                  ? service.layout1_data?.large_car_price
                  : service.layout4_data?.large_car_price) ?? 0,
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
