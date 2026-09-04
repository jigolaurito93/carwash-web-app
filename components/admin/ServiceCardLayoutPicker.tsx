"use client";

import type { CardLayout, ServiceRow } from "@/lib/app.types";
import ServiceCard from "@/components/services/ServiceCard";
import { cn } from "@/lib/utils";

type Props = {
  value: CardLayout;
  onChange: (layout: CardLayout) => void;
  disabled?: boolean;
};

type LayoutOption = {
  value: CardLayout;
  label: string;
  hint: string;
  sample: ServiceRow;
};

function sampleService(
  layout: CardLayout,
  name: string,
  description: string,
  extras: Partial<ServiceRow>,
): ServiceRow {
  return {
    id: 0,
    name,
    description,
    sort_order: 1,
    category_id: 1,
    card_layout: layout,
    notes: null,
    is_active: true,
    categories: { name: "Sample" },
    layout1_data: null,
    layout2_data: null,
    layout3_data: null,
    layout4_data: null,
    ...extras,
  };
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    value: "layout1",
    label: "Layout 1 (Package)",
    hint: "Included items plus small / medium / large prices",
    sample: sampleService("layout1", "Regular Wash", "Exterior & interior", {
      layout1_data: {
        includes: ["Hand wash & dry", "Interior vacuum", "Window cleaning"],
        small_car_price: 15,
        medium_car_price: 20,
        large_car_price: 25,
      },
    }),
  },
  {
    value: "layout2",
    label: "Layout 2 (Add-ons)",
    hint: "A list of extras, each with its own price",
    sample: sampleService("layout2", "Add-Ons", "Upgrades & extras", {
      layout2_data: {
        items: {
          "Tire Dressing": 5,
          "Window Cleaning": 5,
          "Paint Sealant": 120,
        },
      },
    }),
  },
  {
    value: "layout3",
    label: "Layout 3 (Custom Info)",
    hint: "Freeform details with a call-for-quote button",
    sample: sampleService("layout3", "Custom Detail", "By appointment", {
      layout3_data:
        "Full custom detailing tailored to your vehicle. Pricing varies by size and condition.",
    }),
  },
  {
    value: "layout4",
    label: "Layout 4 (Info + Prices)",
    hint: "A short description plus vehicle prices",
    sample: sampleService("layout4", "Interior Detail", "Deep clean inside", {
      layout4_data: {
        info: "Vacuum, wipe-down, and window cleaning throughout the cabin.",
        small_car_price: 40,
        medium_car_price: 50,
        large_car_price: 65,
      },
    }),
  },
];

export default function ServiceCardLayoutPicker({
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <div>
      <p className="mb-2 block text-sm font-semibold text-gray-700">
        Card Layout *
      </p>
      <p className="mb-3 font-questrial text-xs text-gray-500">
        Sample cards match the public services page. Click a layout to use it.
      </p>
      <div
        role="radiogroup"
        aria-label="Card layout"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {LAYOUT_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex h-full flex-col rounded-2xl border-2 p-3 text-left transition-all",
                selected
                  ? "border-yellow-400 bg-yellow-50 shadow-md"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <div className="pointer-events-none min-h-0 flex-1" aria-hidden>
                <ServiceCard
                  service={option.sample}
                  variant="preview"
                  className="h-full"
                />
              </div>
              <div className="mt-3">
                <p className="font-lexend text-sm font-semibold text-gray-900">
                  {option.label}
                </p>
                <p className="mt-0.5 font-questrial text-xs text-gray-500">
                  {option.hint}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
