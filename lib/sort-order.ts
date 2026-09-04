export type SortPlacement =
  | { kind: "start" }
  | { kind: "end" }
  | { kind: "after"; id: number };

export type SortableItem = {
  id: number;
  name: string;
  sort_order: number | null;
};

export function serializeSortPlacement(placement: SortPlacement): string {
  if (placement.kind === "after") return `after:${placement.id}`;
  return placement.kind;
}

export function parseSortPlacement(value: string): SortPlacement {
  if (value === "start") return { kind: "start" };
  if (value.startsWith("after:")) {
    const id = Number(value.slice("after:".length));
    if (Number.isFinite(id) && id > 0) return { kind: "after", id };
  }
  return { kind: "end" };
}

export function getOrderedItems(
  items: SortableItem[],
  excludeId?: number,
): SortableItem[] {
  return items
    .filter((item) => item.id !== excludeId)
    .slice()
    .sort((a, b) => {
      const aOrder = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.id - b.id;
    });
}

export function placementFromCurrent(
  items: SortableItem[],
  currentId: number,
): SortPlacement {
  const ordered = getOrderedItems(items);
  const index = ordered.findIndex((item) => item.id === currentId);
  if (index < 0 || index === ordered.length - 1) return { kind: "end" };
  if (index === 0) return { kind: "start" };
  return { kind: "after", id: ordered[index - 1].id };
}

export function resolveSortOrder(
  placement: SortPlacement,
  items: SortableItem[],
  excludeId?: number,
): number {
  const ordered = getOrderedItems(items, excludeId);
  if (!ordered.length) return 10;

  if (placement.kind === "start") {
    return (ordered[0].sort_order ?? 10) - 10;
  }

  if (placement.kind === "end") {
    return (ordered[ordered.length - 1].sort_order ?? 0) + 10;
  }

  const index = ordered.findIndex((item) => item.id === placement.id);
  if (index < 0) {
    return (ordered[ordered.length - 1].sort_order ?? 0) + 10;
  }

  const afterOrder = ordered[index].sort_order ?? 0;
  const nextOrder = ordered[index + 1]?.sort_order;
  if (nextOrder == null) return afterOrder + 10;
  if (nextOrder - afterOrder > 1) {
    return Math.floor((afterOrder + nextOrder) / 2);
  }
  return afterOrder + 1;
}

export function previewOrderedNames(
  items: SortableItem[],
  placement: SortPlacement,
  previewName: string,
  excludeId?: number,
): { name: string; isNew: boolean }[] {
  const ordered = getOrderedItems(items, excludeId);
  const label = previewName.trim() || "New item";
  const entry = { name: label, isNew: true };
  const existing = ordered.map((item) => ({ name: item.name, isNew: false }));

  if (!existing.length || placement.kind === "start") {
    return [entry, ...existing];
  }
  if (placement.kind === "end") {
    return [...existing, entry];
  }

  const index = existing.findIndex(
    (_, itemIndex) => ordered[itemIndex]?.id === placement.id,
  );
  const insertAt = index < 0 ? existing.length : index + 1;
  return [...existing.slice(0, insertAt), entry, ...existing.slice(insertAt)];
}
