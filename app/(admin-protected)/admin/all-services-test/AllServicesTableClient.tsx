"use client";

import { FiPlusCircle, FiChevronDown } from "react-icons/fi";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";

import { toast } from "sonner";

import { deleteAllServiceRow } from "../services/actions";
import AllServicesModal from "./AllServicesModal";

type AllServiceRow = Database["public"]["Tables"]["all_services"]["Row"] & {
  services_packages: {
    name: string; // subcategory = "regular_wash"
    categories: {
      name: string; // category = "main_service"
    } | null;
  } | null;
};

const AllServicesTableClient = ({
  services,
}: {
  services: AllServiceRow[];
}) => {
  console.log("🚨 SERVICES LENGTH:", services?.length || 0); // ← ADD THIS
  console.log("🚨 FIRST SERVICE:", services?.[0] || "NO DATA"); // ← ADD THIS

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if clicking outside ALL dropdowns
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node) &&
        subcategoryDropdownRef.current &&
        !subcategoryDropdownRef.current.contains(event.target as Node) &&
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryFiltersOpen(false);
        setSubcategoryFiltersOpen(false);
        setPriceFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();

  // Category filters (unchanged)
  const [categoryFiltersOpen, setCategoryFiltersOpen] = useState(false);
  const [allServices, setAllServices] = useState(true);
  const [mainServices, setMainServices] = useState(false);
  const [otherServices, setOtherServices] = useState(false);
  const [detailingServices, setDetailingServices] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Subcategory filters (unchanged)
  const [subcategoryFiltersOpen, setSubcategoryFiltersOpen] = useState(false);
  const [allSubcategories, setAllSubcategories] = useState(true);
  const [regularSub, setRegularSub] = useState(false);
  const [premiumSub, setPremiumSub] = useState(false);
  const [premiumPlusSub, setPremiumPlusSub] = useState(false);
  const [exteriorWashSub, setExteriorWashSub] = useState(false);
  const [paintProtectionSub, setPaintProtectionSub] = useState(false);
  const [addOnSub, setAddOnSub] = useState(false);
  const [handWaxSub, setHandWaxSub] = useState(false);
  const [engineBaySub, setEngineBaySub] = useState(false);
  const [completeDetailSub, setCompleteDetailSub] = useState(false);
  const [interiorDetailSub, setInteriorDetailSub] = useState(false);
  const [exteriorDetailSub, setExteriorDetailSub] = useState(false);
  const [miniDetailSub, setMiniDetailSub] = useState(false);

  const subcategoryDropdownRef = useRef<HTMLDivElement>(null);

  // NEW: Price range filter
  const [priceFilterOpen, setPriceFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<string>("all");
  const priceDropdownRef = useRef<HTMLDivElement>(null);

  // Modal state (unchanged)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<AllServiceRow | null>(
    null,
  );

  const availableSubcategories = useMemo(() => {
    if (allServices) return services;

    return services.filter((service) => {
      const serviceCategory = service.services_packages?.categories?.name || "";
      const matchesMain = mainServices && serviceCategory === "main_service";
      const matchesOther = otherServices && serviceCategory === "other_service";
      const matchesDetailing =
        detailingServices && serviceCategory === "detailing_service";
      return matchesMain || matchesOther || matchesDetailing;
    });
  }, [services, allServices, mainServices, otherServices, detailingServices]);

  const toggleDropdown = (dropdown: "category" | "subcategory" | "price") => {
    // If clicking SAME dropdown that's already open → CLOSE IT
    if (dropdown === "category" && categoryFiltersOpen) {
      setCategoryFiltersOpen(false);
      return;
    }
    if (dropdown === "subcategory" && subcategoryFiltersOpen) {
      setSubcategoryFiltersOpen(false);
      return;
    }
    if (dropdown === "price" && priceFilterOpen) {
      setPriceFilterOpen(false);
      return;
    }

    // Close all others, open clicked one
    setCategoryFiltersOpen(dropdown === "category");
    setSubcategoryFiltersOpen(dropdown === "subcategory");
    setPriceFilterOpen(dropdown === "price");
  };

  const getAvailableSubcategoryCount = () => {
    let totalServices = 0; // ✅ Count TOTAL services

    services.forEach((service) => {
      const serviceCategory = service.services_packages?.categories?.name;
      const categoryMatches =
        allServices ||
        (mainServices && serviceCategory === "main_service") ||
        (otherServices && serviceCategory === "other_service") ||
        (detailingServices && serviceCategory === "detailing_service");

      if (categoryMatches) {
        totalServices++; // ✅ Count every matching service
      }
    });

    return totalServices; // ✅ Returns 12 for Main Services
  };

  const getSubcategoryCounts = () => {
    const subcatCounts: Record<string, number> = {};
    services.forEach((service) => {
      const serviceCategory = service.services_packages?.categories?.name;
      const subcatName = service.services_packages?.name;
      const categoryMatches =
        allServices ||
        (mainServices && serviceCategory === "main_service") ||
        (otherServices && serviceCategory === "other_service") ||
        (detailingServices && serviceCategory === "detailing_service");
      if (subcatName && categoryMatches) {
        subcatCounts[subcatName] = (subcatCounts[subcatName] || 0) + 1;
      }
    });
    return subcatCounts;
  };

  // Category filter handlers (unchanged)
  const handleAllServicesChange = (checked: boolean) => {
    setAllServices(checked);
    if (checked) {
      setMainServices(false);
      setOtherServices(false);
      setDetailingServices(false);
      setAllSubcategories(true);
      setRegularSub(false);
      setPremiumSub(false);
      setAddOnSub(false);
      setHandWaxSub(false);
      setEngineBaySub(false);
      setCompleteDetailSub(false);
      setInteriorDetailSub(false);
      setExteriorDetailSub(false);
      setMiniDetailSub(false);
    }
  };

  const handleCategoryServiceChange = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    checked: boolean,
  ) => {
    setAllServices(false);
    setter(checked);
  };

  // Subcategory filter handlers (unchanged)
  const handleAllSubcategoriesChange = (checked: boolean) => {
    setAllSubcategories(checked);
    if (checked) {
      setRegularSub(false);
      setPremiumSub(false);
      setPremiumPlusSub(false);
      setExteriorWashSub(false);
      setAddOnSub(false);
      setCompleteDetailSub(false);
      setInteriorDetailSub(false);
    }
  };

  const handleSubcategoryChange = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    checked: boolean,
  ) => {
    setAllSubcategories(false);
    setter(checked);
  };

  // NEW: Price range filter handler
  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
  };

  // Existing handlers (unchanged)
  const handleEdit = (service: AllServiceRow) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    toast.custom(
      (t) => (
        <div className="w-87.5 rounded-xl bg-black p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-black">
              <span className="text-xl font-bold">!</span>
            </div>
            <h3 className="font-lexend text-lg font-bold text-white uppercase">
              Confirm Deletion
            </h3>
            <p className="mt-2 font-questrial text-sm text-gray-400">
              Are you sure you want to remove{" "}
              <span className="text-yellow-400">&quot;{name}&quot;</span>? This
              cannot be undone.
            </p>
            <div className="mt-6 flex w-full gap-3">
              <button
                onClick={() => toast.dismiss(t)}
                className="flex-1 cursor-pointer rounded-md border border-zinc-700 bg-white py-2 font-questrial text-xs font-bold tracking-wider text-black transition-colors hover:bg-zinc-200"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  const res = await deleteAllServiceRow(id);
                  if (res.success) {
                    toast.success("Service removed.");
                    router.refresh();
                  } else {
                    toast.error("Error: " + res.error);
                  }
                }}
                className="flex-1 cursor-pointer rounded-md bg-red-600 py-2 font-questrial text-xs font-bold tracking-wider text-white transition-all hover:bg-red-500 active:scale-95"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  // Dynamic subcategory checkboxes (unchanged)
  const renderSubcategoryCheckboxes = () => {
    const subcatCounts = getSubcategoryCounts();

    const subcatOptions = [
      {
        key: "regular_wash",
        label: "Regular",
        state: regularSub,
        setter: setRegularSub,
      },
      {
        key: "premium_wash",
        label: "Premium",
        state: premiumSub,
        setter: setPremiumSub,
      },
      {
        key: "premium_plus_wash",
        label: "Premium Plus",
        state: premiumPlusSub,
        setter: setPremiumPlusSub,
      },
      { key: "add_on", label: "Add-on", state: addOnSub, setter: setAddOnSub },
      {
        key: "hand_wax",
        label: "Hand Wax",
        state: handWaxSub,
        setter: setHandWaxSub,
      },
      {
        key: "engine_bay_cleaning",
        label: "Engine Bay",
        state: engineBaySub,
        setter: setEngineBaySub,
      },
      {
        key: "complete_detail",
        label: "Complete Detail",
        state: completeDetailSub,
        setter: setCompleteDetailSub,
      },
      {
        key: "interior_detail",
        label: "Interior Detail",
        state: interiorDetailSub,
        setter: setInteriorDetailSub,
      },
      {
        key: "paint_protection",
        label: "Paint Protection",
        state: paintProtectionSub,
        setter: setPaintProtectionSub,
      },
      {
        key: "exterior_wash",
        label: "Exterior Wash",
        state: exteriorWashSub,
        setter: setExteriorWashSub,
      },
      {
        key: "exterior_detail",
        label: "Exterior Detail",
        state: exteriorDetailSub,
        setter: setExteriorDetailSub,
      },
      {
        key: "mini_detail",
        label: "Mini Detail",
        state: miniDetailSub,
        setter: setMiniDetailSub,
      },
    ];

    return subcatOptions.map(({ key, label, state, setter }, index) =>
      subcatCounts[key] > 0 ? ( // Still only show if data exists
        <label
          key={key}
          className={`flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50 ${index === 0 ? "" : "border-t"}`}
        >
          <input
            type="checkbox"
            checked={state}
            onChange={(e) => handleSubcategoryChange(setter, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="flex items-center gap-1">
            {label}
            <span className="text-xs text-gray-400">({subcatCounts[key]})</span>
          </span>
        </label>
      ) : null,
    );
  };

  // Button text getters (unchanged)
  const getCategoryButtonText = () => {
    if (allServices) return "All Services";
    const selected = [];
    if (mainServices) selected.push("Main");
    if (otherServices) selected.push("Other");
    if (detailingServices) selected.push("Detailing");
    return selected.length ? selected.join(", ") + " Services" : "All Services";
  };

  const getSubcategoryButtonText = () => {
    if (allSubcategories) return "All Subcats";
    const selected = [];
    if (regularSub) selected.push("Regular");
    if (premiumSub) selected.push("Premium");
    if (addOnSub) selected.push("Add-on");
    if (premiumPlusSub) selected.push("Premium Plus");
    if (completeDetailSub) selected.push("Comp Detail");
    if (interiorDetailSub) selected.push("Int Detail");
    if (paintProtectionSub) selected.push("Paint Protection");
    if (exteriorWashSub) selected.push("Exterior Wash");
    if (handWaxSub) selected.push("Hand Wax");
    if (engineBaySub) selected.push("Engine Bay");
    if (exteriorDetailSub) selected.push("Ext Detail");
    if (miniDetailSub) selected.push("Mini Detail");

    return selected.length ? selected.join(", ") : "All Subcats";
  };

  // NEW: Price range button text
  const getPriceButtonText = () => {
    const ranges: Record<string, string> = {
      all: "All Prices",
      low: "$0-20",
      mid: "$20-50",
      high: "$50+",
    };
    return ranges[priceRange] || "All Prices";
  };

  const filteredServices = services.filter((service) => {
    // ✅ Extract from nested structure
    const serviceCategory = service.services_packages?.categories?.name || "";
    const serviceSubcategory = service.services_packages?.name || "";

    // Category filter
    if (!allServices) {
      const matchesMain = mainServices && serviceCategory === "main_service";
      const matchesOther = otherServices && serviceCategory === "other_service";
      const matchesDetailing =
        detailingServices && serviceCategory === "detailing_service";
      if (!matchesMain && !matchesOther && !matchesDetailing) return false;
    }

    // Subcategory filter
    if (!allSubcategories) {
      const matchesRegular =
        regularSub && serviceSubcategory === "regular_wash";
      const matchesPremium =
        premiumSub && serviceSubcategory === "premium_wash";
      const matchesAddOn = addOnSub && serviceSubcategory === "add_on";
      const matchesExteriorDetail =
        exteriorDetailSub && serviceSubcategory === "exterior_detail";
      const matchesMiniDetail =
        miniDetailSub && serviceSubcategory === "mini_detail";
      const matchesHandWax = handWaxSub && serviceSubcategory === "hand_wax";
      const matchesEngineBay =
        engineBaySub && serviceSubcategory === "engine_bay_cleaning";
      const matchesComplete =
        completeDetailSub && serviceSubcategory === "complete_detail";
      const matchesExterior =
        exteriorWashSub && serviceSubcategory === "exterior_wash";
      const matchesInterior =
        interiorDetailSub && serviceSubcategory === "interior_detail";
      const matchesPaint =
        paintProtectionSub && serviceSubcategory === "paint_protection";
      const matchesPremiumPlus =
        premiumPlusSub && serviceSubcategory === "premium_plus_wash";

      if (
        !matchesRegular &&
        !matchesExteriorDetail &&
        !matchesPremium &&
        !matchesPremiumPlus &&
        !matchesExterior &&
        !matchesAddOn &&
        !matchesMiniDetail &&
        !matchesHandWax &&
        !matchesEngineBay &&
        !matchesComplete &&
        !matchesInterior &&
        !matchesPaint
      ) {
        return false; // ❌ None match
      }
    }

    if (priceRange !== "all") {
      const price = Number(service.price || 0); // ✅ Number() handles both string/number
      if (priceRange === "low" && price > 20) return false;
      if (priceRange === "mid" && (price > 50 || price <= 20)) return false;
      if (priceRange === "high" && price <= 50) return false;
    }

    return true;
  });

  const formatCategory = (service: AllServiceRow) => {
    const cat = service.services_packages?.categories?.name; // ✅ Now gets STRING "main_service"
    if (!cat) return "—";

    const displayNames: Record<string, string> = {
      main_service: "Main Services",
      other_service: "Other Services",
      detailing_service: "Detailing Services",
    };
    return (
      displayNames[cat] ||
      cat.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
    );
  };

  const formatSubCategory = (service: AllServiceRow) => {
    const subcat = service.services_packages?.name; // ✅ Already string per your type
    if (!subcat) return "—";

    const displayNames: Record<string, string> = {
      regular_wash: "Regular Wash",
      premium_wash: "Premium Wash",
      add_on: "Add-on",
      complete_detail: "Complete Detail",
      interior_detail: "Interior Detail",
      paint_protection: "Paint Protection",
    };
    return (
      displayNames[subcat] ||
      subcat.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
    );
  };

  return (
    <>
      <div className="mt-12 mb-6 flex items-center justify-between">
        <h2 className="font-questrial text-3xl font-bold tracking-wider text-gray-900">
          All Services ({filteredServices.length})
        </h2>
        <button
          onClick={handleCreate}
          className="flex cursor-pointer items-center gap-2 rounded bg-black px-4 py-2 font-questrial text-sm font-bold text-white transition-all hover:bg-zinc-800"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Filter Buttons - UPDATED */}
      <div className="mb-1 font-questrial text-sm font-bold tracking-wider text-gray-400">
        Filter
      </div>
      <hr />
      <div className="flex flex-wrap gap-2 rounded-xl bg-gray-50 p-4">
        {/* Category Dropdown (unchanged) */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            onClick={() => toggleDropdown("category")}
            className={`flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${allServices || mainServices || otherServices || detailingServices
                ? "bg-black text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Services
            <FiChevronDown
              className={`h-4 w-4 transition-transform ${categoryFiltersOpen ? "rotate-180" : ""}`}
            />
          </button>
          {categoryFiltersOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-52 rounded-lg border border-gray-200 bg-white shadow-lg">
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={allServices}
                  onChange={(e) => handleAllServicesChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                All Services
              </label>
              <label className="flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={mainServices}
                  onChange={(e) =>
                    handleCategoryServiceChange(
                      setMainServices,
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                Main Services
              </label>
              <label className="flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={otherServices}
                  onChange={(e) =>
                    handleCategoryServiceChange(
                      setOtherServices,
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                Other Services
              </label>
              <label className="flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={detailingServices}
                  onChange={(e) =>
                    handleCategoryServiceChange(
                      setDetailingServices,
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                Detailing Services
              </label>
            </div>
          )}
        </div>

        {/* Subcategory Dropdown (FIXED) */}
        <div className="relative" ref={subcategoryDropdownRef}>
          <button
            onClick={() => toggleDropdown("subcategory")}
            className={`flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${allSubcategories ||
                regularSub ||
                premiumSub ||
                addOnSub ||
                completeDetailSub ||
                interiorDetailSub ||
                paintProtectionSub
                ? "bg-black text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Category
            <FiChevronDown
              className={`h-4 w-4 transition-transform ${subcategoryFiltersOpen ? "rotate-180" : ""}`}
            />
          </button>
          {subcategoryFiltersOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 max-h-64 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              <label className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={allSubcategories}
                  onChange={(e) =>
                    handleAllSubcategoriesChange(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                All Categories ({getAvailableSubcategoryCount()})
              </label>
              <div className="py-2">
                {renderSubcategoryCheckboxes()}
                {Object.keys(getSubcategoryCounts()).length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No subcategories available for selected categories
                  </div>
                )}
              </div>{" "}
              {/* ← Proper closing */}
            </div>
          )}
        </div>

        {/* NEW: Price Range Dropdown */}
        <div className="relative" ref={priceDropdownRef}>
          <button
            onClick={() => toggleDropdown("price")}
            className={`flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${priceRange !== "all"
                ? "bg-black text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {getPriceButtonText()}
            <FiChevronDown
              className={`h-4 w-4 transition-transform ${priceFilterOpen ? "rotate-180" : ""}`}
            />
          </button>

          {priceFilterOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              <label className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="radio"
                  name="price-range"
                  value="all"
                  checked={priceRange === "all"}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                All Prices
              </label>
              <label className="flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="radio"
                  name="price-range"
                  value="low"
                  checked={priceRange === "low"}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                $0 - $20
              </label>
              <label className="flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="radio"
                  name="price-range"
                  value="mid"
                  checked={priceRange === "mid"}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                $20 - $50
              </label>
              <label className="flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="radio"
                  name="price-range"
                  value="high"
                  checked={priceRange === "high"}
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                $50+
              </label>
            </div>
          )}
        </div>
      </div>
      <hr />

      {/* Table (unchanged) */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 font-questrial">
            <tr>
              <th className="px-4 py-3 font-bold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Category
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Subcategory
              </th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredServices.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No services match the selected filter.
                </td>
              </tr>
            ) : (
              filteredServices.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 tabular-nums">
                    {row.price != null
                      ? `$${Number(row.price).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatCategory(row)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatSubCategory(row)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="ml-auto flex justify-end gap-2 font-questrial tracking-widest">
                      <button
                        onClick={() => handleEdit(row)}
                        className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold transition-all hover:bg-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id, row.name)}
                        className="cursor-pointer rounded border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AllServicesModal
          service={selectedService} // ✅ No casting needed
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
};

export default AllServicesTableClient;
