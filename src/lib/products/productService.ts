// Combines the real API with the user's local changes (localChanges.ts).
// UI code talks to this file, never to Axios directly.

import { ApiError } from "@/lib/api/client";
import {
  createProduct,
  deleteProduct,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/api/products";
import {
  addCreated,
  isLocalId,
  markDeleted,
  nextLocalId,
  readChanges,
  removeCreated,
  replaceCreated,
  saveUpdate,
} from "./localChanges";
import type { Product, ProductInput, ProductListResponse, ProductQuery } from "@/types/product";

/** Roughly the same matching the API does, used for products it does not know about. */
function matchesQuery(p: Product, query: ProductQuery) {
  if (query.q) {
    const needle = query.q.toLowerCase();
    return [p.title, p.description, p.brand ?? "", p.category].some((field) =>
      field.toLowerCase().includes(needle),
    );
  }
  if (query.category) return p.category === query.category;
  return true;
}

/**
 * Gets `limit` API products starting at position `skip`, as if the deleted
 * products were never there.
 */
async function fetchServerSlice(
  query: ProductQuery,
  skip: number,
  limit: number,
  deletedIds: Set<number>,
  signal?: AbortSignal,
): Promise<{ products: Product[]; total: number }> {
  const base = {
    q: query.q,
    category: query.category,
    sortBy: query.sortBy,
    order: query.order,
    delay: query.delay,
    signal,
  };

  if (deletedIds.size === 0) {
    // Simple case: one request. limit=0 means "everything" to DummyJSON, so ask
    // for at least 1 (we still need the total when the page is full of local items).
    const response = await fetchProducts({ ...base, skip, limit: Math.max(limit, 1) });
    return { products: response.products.slice(0, limit), total: response.total };
  }

  // Some products were deleted, so API positions no longer match ours.
  // 1) Get only the ids of every matching product (small response) to find
  //    which positions are really on this page.
  const idsResponse = await fetchProducts({ ...base, skip: 0, limit: 0, select: "id" });
  const visiblePositions = idsResponse.products
    .map((p, position) => ({ id: p.id, position }))
    .filter(({ id }) => !deletedIds.has(id))
    .map(({ position }) => position);

  const total = visiblePositions.length;
  const wanted = visiblePositions.slice(skip, skip + limit);
  if (wanted.length === 0) return { products: [], total };

  // 2) Load the full products for that stretch and drop the deleted ones in it.
  const first = wanted[0];
  const last = wanted[wanted.length - 1];
  const response = await fetchProducts({ ...base, skip: first, limit: last - first + 1 });
  return { products: response.products.filter((p) => !deletedIds.has(p.id)), total };
}

/**
 * One page of products.
 * Products the user added are shown first (page 1 onwards), followed by the API
 * products. Deleted products are skipped and edits are applied on top.
 */
export async function listProducts(query: ProductQuery, signal?: AbortSignal): Promise<ProductListResponse> {
  const changes = readChanges();
  const created = changes.created.filter((p) => matchesQuery(p, query));

  const skip = (query.page - 1) * query.limit;
  const localItems = created.slice(skip, skip + query.limit);
  const serverSkip = Math.max(0, skip - created.length);
  const serverLimit = query.limit - localItems.length;

  const server = await fetchServerSlice(query, serverSkip, serverLimit, new Set(changes.deleted), signal);
  const serverItems = server.products.map((p) => ({ ...p, ...changes.updated[p.id] }));

  return {
    products: [...localItems, ...serverItems],
    total: server.total + created.length,
    skip,
    limit: query.limit,
  };
}

function notFound(id: number | string): never {
  throw new ApiError(`Product with id '${id}' not found`, 404);
}

export async function getProduct(id: number, signal?: AbortSignal): Promise<Product> {
  if (!Number.isInteger(id) || id < 1) notFound(id);

  const changes = readChanges();
  if (changes.deleted.includes(id)) notFound(id);

  if (isLocalId(id)) {
    const local = changes.created.find((p) => p.id === id);
    return local ?? notFound(id);
  }

  const product = await fetchProduct(id, signal);
  return { ...product, ...changes.updated[id] };
}

export async function addProduct(input: ProductInput): Promise<Product> {
  // The API echoes the product back (always with id 195) but does not store it.
  const saved = await createProduct(input);
  const product: Product = {
    ...saved,
    ...input,
    id: nextLocalId(readChanges()),
    images: input.thumbnail ? [input.thumbnail] : [],
    reviews: [],
    isLocal: true,
  };
  addCreated(product);
  return product;
}

export async function editProduct(product: Product, input: ProductInput): Promise<Product> {
  if (product.isLocal) {
    // The API has never heard of this id (PUT would return 404), so update it locally only.
    const updated: Product = {
      ...product,
      ...input,
      images: input.thumbnail ? [input.thumbnail] : [],
    };
    replaceCreated(updated);
    return updated;
  }

  await updateProduct(product.id, input);
  saveUpdate(product.id, input);
  return { ...product, ...input };
}

export async function removeProduct(product: Product): Promise<void> {
  if (product.isLocal) {
    removeCreated(product.id);
    return;
  }

  await deleteProduct(product.id);
  markDeleted(product.id);
}
