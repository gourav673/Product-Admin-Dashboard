// DummyJSON only pretends to save add/edit/delete. To still show the change,
// we keep a small record of what the user changed in localStorage and lay it
// over the API data (see productService.ts). It survives a page refresh.

import type { Product, ProductInput } from "@/types/product";

const STORAGE_KEY = "productLocalChanges";
export const LOCAL_ID_START = 10000;

export interface LocalChanges {
  /** Products added by the user, newest first. */
  created: Product[];
  /** Edits made to real API products, by id. */
  updated: Record<number, Partial<ProductInput>>;
  /** Ids of real API products the user deleted. */
  deleted: number[];
}

const EMPTY: LocalChanges = { created: [], updated: {}, deleted: [] };

export function readChanges(): LocalChanges {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<LocalChanges>;
    return {
      created: Array.isArray(parsed.created) ? parsed.created : [],
      updated: parsed.updated && typeof parsed.updated === "object" ? parsed.updated : {},
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted.filter((id) => typeof id === "number") : [],
    };
  } catch {
    return EMPTY;
  }
}

function writeChanges(changes: LocalChanges) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
  } catch {
    // Storage full or blocked: the change still shows until the page reloads.
  }
}

export function hasLocalChanges(): boolean {
  const c = readChanges();
  return c.created.length > 0 || c.deleted.length > 0 || Object.keys(c.updated).length > 0;
}

export function resetLocalChanges() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isLocalId(id: number): boolean {
  return id >= LOCAL_ID_START;
}

export function nextLocalId(changes: LocalChanges): number {
  const ids = changes.created.map((p) => p.id);
  return ids.length ? Math.max(...ids) + 1 : LOCAL_ID_START;
}

export function addCreated(product: Product) {
  const changes = readChanges();
  writeChanges({ ...changes, created: [product, ...changes.created] });
}

export function replaceCreated(product: Product) {
  const changes = readChanges();
  writeChanges({
    ...changes,
    created: changes.created.map((p) => (p.id === product.id ? product : p)),
  });
}

export function removeCreated(id: number) {
  const changes = readChanges();
  writeChanges({ ...changes, created: changes.created.filter((p) => p.id !== id) });
}

export function saveUpdate(id: number, patch: Partial<ProductInput>) {
  const changes = readChanges();
  writeChanges({
    ...changes,
    updated: { ...changes.updated, [id]: { ...changes.updated[id], ...patch } },
  });
}

export function markDeleted(id: number) {
  const changes = readChanges();
  const updated = { ...changes.updated };
  delete updated[id];
  writeChanges({
    ...changes,
    updated,
    deleted: [...changes.deleted.filter((d) => d !== id), id],
  });
}
