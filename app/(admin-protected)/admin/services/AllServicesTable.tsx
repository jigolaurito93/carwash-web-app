"use client";

import { FiPlusCircle, FiChevronDown } from "react-icons/fi";
import { useState, useRef, useEffect, useMemo } from "react";
import type { Database } from "@/lib/database.types";

type Service = Database["public"]["Tables"]["services_all"]["Row"];

const ServicesTableClient = ({ services }: { services: Service[] }) => {
  // Category filters (unchanged)
  const [categoryFiltersOpen, setCategoryFiltersOpen] = useState(false);
  const [allServices, setAllServices] = useState(true);
  const [mainServices, setMainServices] = useState(false);
  const [otherServices, setOtherServices] = useState(false);
  const [detailingServices, setDetailingServices] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Subcategory filters
  const [subcategoryFiltersOpen, setSubcategoryFiltersOpen] = useState(false);
  const [allSubcategories, setAllSubcategories] = useState(true);
  const [regularSub, setRegularSub] = useState(false);
  const [premiumSub, setPremiumSub] = useState(false);
  const [addOnSub, setAddOnSub] = useState(false);
  const [completeDetailSub, setCompleteDetailSub] = useState(false);
  const [interiorDetailSub, setInteriorDetailSub] = useState(false);
  const subcategoryDropdownRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState("all");

  // Compute available subcategories based on category selection
  const availableSubcategories = useMemo(() => {
    if (allServices) return services;

    const filteredByCategory = services.filter((service) => {
      const matchesMain = mainServices && service.category === "main_service";
      const matchesOther =
        otherServices && service.category === "other_service";
      const matchesDetailing =
        detailingServices && service.category === "detailing_service";
      return matchesMain || matchesOther || matchesDetailing;
    });

    return filteredByCategory;
  }, [services, allServices, mainServices, otherServices, detailingServices]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryFiltersOpen(false);
      }
      if (
        subcategoryDropdownRef.current &&
        !subcategoryDropdownRef.current.contains(event.target as Node)
      ) {
        setSubcategoryFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Category filter handlers (unchanged)
  const handleAllServicesChange = (checked: boolean) => {
    setAllServices(checked);
    if (checked) {
      setMainServices(false);
      setOtherServices(false);
      setDetailingServices(false);
    }
  };

  const handleCategoryServiceChange = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    checked: boolean,
  ) => {
    setAllServices(false);
    setter(checked);
  };

  // Subcategory filter handlers
  const handleAllSubcategoriesChange = (checked: boolean) => {
    setAllSubcategories(checked);
    if (checked) {
      setRegularSub(false);
      setPremiumSub(false);
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

  // Dynamic subcategory checkboxes - only show if available in filtered data
  const renderSubcategoryCheckboxes = () => {
    const subcatCounts: Record<string, number> = {};

    availableSubcategories.forEach((service) => {
      if (service.sub_category) {
        subcatCounts[service.sub_category] =
          (subcatCounts[service.sub_category] || 0) + 1;
      }
    });

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
      { key: "add_on", label: "Add-on", state: addOnSub, setter: setAddOnSub },
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
    ];

    return subcatOptions.map(
      ({ key, label, state, setter }, index) =>
        subcatCounts[key] > 0 && (
          <label
            key={key}
            className={`flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50 ${index === 0 ? "" : "border-t"}`}
          >
            <input
              type="checkbox"
              checked={state}
              onChange={(e) =>
                handleSubcategoryChange(setter, e.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="flex items-center gap-1">
              {label}
              <span className="text-xs text-gray-400">
                ({subcatCounts[key]})
              </span>
            </span>
          </label>
        ),
    );
  };

  // Get display text
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
    if (completeDetailSub) selected.push("Comp Detail");
    if (interiorDetailSub) selected.push("Int Detail");
    return selected.length ? selected.join(", ") : "All Subcats";
  };

  // Combined filtering logic
  const filteredServices = services.filter((service) => {
    // Category filter
    if (!allServices) {
      const matchesMain = mainServices && service.category === "main_service";
      const matchesOther =
        otherServices && service.category === "other_service";
      const matchesDetailing =
        detailingServices && service.category === "detailing_service";
      if (!matchesMain && !matchesOther && !matchesDetailing) return false;
    }

    // Subcategory filter
    if (!allSubcategories) {
      const matchesRegular =
        regularSub && service.sub_category === "regular_wash";
      const matchesPremium =
        premiumSub && service.sub_category === "premium_wash";
      const matchesAddOn = addOnSub && service.sub_category === "add_on";
      const matchesCompleteDetail =
        completeDetailSub && service.sub_category === "complete_detail";
      const matchesInteriorDetail =
        interiorDetailSub && service.sub_category === "interior_detail";

      if (
        !matchesRegular &&
        !matchesPremium &&
        !matchesAddOn &&
        !matchesCompleteDetail &&
        !matchesInteriorDetail
      ) {
        return false;
      }
    }

    return true;
  });

  const formatSubCategory = (subCategory: string | null) => {
    if (!subCategory) return "—";
    const displayNames: Record<string, string> = {
      complete_detail: "Complete Detail",
      interior_detail: "Interior Detail",
      regular_wash: "Regular Wash",
      premium_wash: "Premium Wash",
      add_on: "Add On",
      paint_protection: "Paint Protection",
    };
    return (
      displayNames[subCategory] ||
      subCategory.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  return (
    <>
      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border bg-gray-50 p-4">
        {/* Category Dropdown (unchanged) */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            onClick={() => setCategoryFiltersOpen(!categoryFiltersOpen)}
            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              allServices || mainServices || otherServices || detailingServices
                ? "bg-black text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {getCategoryButtonText()}
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

        {/* Subcategory Dropdown - DYNAMIC */}
        <div className="relative" ref={subcategoryDropdownRef}>
          <button
            onClick={() => setSubcategoryFiltersOpen(!subcategoryFiltersOpen)}
            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              allSubcategories ||
              regularSub ||
              premiumSub ||
              addOnSub ||
              completeDetailSub ||
              interiorDetailSub
                ? "bg-black text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {getSubcategoryButtonText()}
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
                All Subcategories ({availableSubcategories.length})
              </label>
              <div className="py-2">
                {renderSubcategoryCheckboxes()}
                {availableSubcategories.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No subcategories available for selected categories
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Other Filter Buttons */}
        {[
          { id: "regular", label: "Regular" },
          { id: "premium", label: "Premium" },
          { id: "add_on", label: "Add-ons" },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              setAllServices(false);
              setMainServices(false);
              setOtherServices(false);
              setDetailingServices(false);
              setAllSubcategories(false);
              setRegularSub(false);
              setPremiumSub(false);
              setAddOnSub(false);
              setCompleteDetailSub(false);
              setInteriorDetailSub(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeFilter === filter.id
                ? "bg-black text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Rest remains the same */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-questrial text-3xl font-bold tracking-wider text-gray-900">
          All Services ({filteredServices.length})
        </h2>
        <button className="flex cursor-pointer items-center gap-2 rounded bg-black px-4 py-2 font-questrial text-sm font-bold text-white transition-all hover:bg-zinc-800">
          <FiPlusCircle className="h-4 w-4" />
          Add Service
        </button>
      </div>

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
                    ${row.price || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{row.category}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatSubCategory(row.sub_category)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="ml-auto flex justify-end gap-2 font-questrial tracking-widest">
                      <button className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold transition-all hover:bg-yellow-400">
                        Edit
                      </button>
                      <button className="cursor-pointer rounded border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white">
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
    </>
  );
};

export default ServicesTableClient;
