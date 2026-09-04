"use client";

import {
  getOrderedItems,
  parseSortPlacement,
  previewOrderedNames,
  serializeSortPlacement,
  type SortPlacement,
  type SortableItem,
} from "@/lib/sort-order";
import { cn } from "@/lib/utils";

type Props = {
  items: SortableItem[];
  placement: SortPlacement;
  onChange: (placement: SortPlacement) => void;
  previewName: string;
  noun: "category" | "service";
  disabled?: boolean;
  disabledReason?: string;
  excludeId?: number;
};

export default function SortPositionField({
  items,
  placement,
  onChange,
  previewName,
  noun,
  disabled,
  disabledReason,
  excludeId,
}: Props) {
  const ordered = getOrderedItems(items, excludeId);
  const preview = previewOrderedNames(items, placement, previewName, excludeId);
  const last = ordered[ordered.length - 1];

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        Display position
      </label>
      <select
        value={serializeSortPlacement(placement)}
        onChange={(event) => onChange(parseSortPlacement(event.target.value))}
        className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        disabled={disabled}
      >
        {!ordered.length ? (
          <option value="end">First {noun}</option>
        ) : last ? (
          <>
            <option value="end">{`Last — after "${last.name}"`}</option>
            <option value="start">{`First — before "${ordered[0].name}"`}</option>
            {ordered.slice(0, -1).map((item) => (
              <option key={item.id} value={`after:${item.id}`}>
                {`After "${item.name}"`}
              </option>
            ))}
          </>
        ) : null}
      </select>
      {disabledReason ? (
        <p className="mt-2 font-questrial text-xs text-gray-500">
          {disabledReason}
        </p>
      ) : (
        <p className="mt-2 font-questrial text-xs text-gray-500">
          Controls where this {noun} appears on the public services page.
        </p>
      )}

      {!disabled && preview.length > 0 && (
        <ol className="mt-3 max-h-44 space-y-1 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
          {preview.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className={cn(
                "flex items-center gap-2 font-questrial text-xs",
                item.isNew ? "font-semibold text-gray-900" : "text-gray-500",
              )}
            >
              <span className="w-4 shrink-0 text-gray-400 tabular-nums">
                {index + 1}.
              </span>
              <span className="min-w-0 truncate">{item.name}</span>
              {item.isNew && (
                <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-900 uppercase">
                  Here
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
