"use client";

import { FiPlusCircle, FiChevronDown } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import type { Database } from "@/lib/database.types";

type Service = Database["public"]["Tables"]["services_all"]["Row"];

const ServicesTableClient = ({ services }: { services: Service[] }) => {
  // Replace activeFilter with checkbox states
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [allServices, setAllServices] = useState(true);
  const [mainServices, setMainServices] = useState(false);
  const [otherServices, setOtherServices] = useState(false);
  const [detailingServices, setDetailingServices] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState("all");

  // Other filters remain buttons
  const otherFilters = [
    { id: "regular", label: "Regular" },
    { id: "premium", label: "Premium" },
    { id: "add_on", label: "Add-ons" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle "All Services" checkbox - unchecks others
  const handleAllServicesChange = (checked: boolean) => {
    setAllServices(checked);
    if (checked) {
      setMainServices(false);
      setOtherServices(false);
      setDetailingServices(false);
    }
  };

  // Determine active filter based on checkboxes
  const getActiveFilter = () => {
    if (allServices) return "all";
    if (mainServices) return "main_service";
    if (otherServices) return "other_service";
    if (detailingServices) return "detailing_service";
    return "all";
  };

  const filteredServices = services.filter((service) => {
    const currentFilter = getActiveFilter();
    if (currentFilter === "all") return true;
    return service.category === currentFilter;
  });

  const formatSubCategory = (subCategory: string | null) => {
    if (!subCategory) return "—";
    const displayNames: Record<string, string> = {
      complete_detail: "Complete Detail",
      interior_detail: "Interior Detail",
      regular: "Regular",
      premium: "Premium",
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
      {/* Filter Buttons - First is now dropdown */}
      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border bg-gray-50 p-4">
        {/* Dropdown Filter Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              allServices || mainServices || otherServices || detailingServices
                ? "bg-black text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {allServices && "All Services"}
            {mainServices && "Main Services"}
            {otherServices && "Other Services"}
            {detailingServices && "Detailing Services"}
            {!(
              allServices ||
              mainServices ||
              otherServices ||
              detailingServices
            ) && "All Services"}
            <FiChevronDown
              className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {filtersOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              <label className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={allServices}
                  onChange={(e) => handleAllServicesChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                All Services
              </label>
              <label className="flex cursor-pointer items-center gap-2 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={mainServices}
                  onChange={(e) => {
                    setMainServices(e.target.checked);
                    if (allServices) setAllServices(false);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  disabled={allServices}
                />
                Main Services
              </label>
              <label className="flex cursor-pointer items-center gap-2 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={otherServices}
                  onChange={(e) => {
                    setOtherServices(e.target.checked);
                    if (allServices) setAllServices(false);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  disabled={allServices}
                />
                Other Services
              </label>
              <label className="flex cursor-pointer items-center gap-2 border-t border-gray-100 px-4 py-3 text-sm hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={detailingServices}
                  onChange={(e) => {
                    setDetailingServices(e.target.checked);
                    if (allServices) setAllServices(false);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  disabled={allServices}
                />
                Detailing Services
              </label>
            </div>
          )}
        </div>

        {/* Other Filter Buttons */}
        {otherFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              // Reset checkboxes when using other filters
              setAllServices(false);
              setMainServices(false);
              setOtherServices(false);
              setDetailingServices(false);
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

      {/* Rest of your component remains the same */}
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
