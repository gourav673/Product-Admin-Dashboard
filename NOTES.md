# Notes

## My choices

**The URL is the source of truth for the list.** Page, page size, search, category and sort are read from the URL ([queryParams.ts](src/lib/products/queryParams.ts)) and every change writes back to it ([useProductQuery.ts](src/hooks/useProductQuery.ts)). This makes refresh, Back/Forward and shared links work without extra state. Every value is checked when it is read: anything invalid falls back to a default, and the address bar is corrected. A page past the end moves to the last real page.

**Old search results never replace new ones.** [useProducts.ts](src/hooks/useProducts.ts) uses two guards:

1. When the query changes, the previous request is aborted with an `AbortController`.
2. Each request gets an increasing id. A response only updates the screen if its id is still the latest, which covers a response that arrived just before the abort.

The search box is also debounced (400 ms), so fast typing sends one request, not one per key.

**Search and category cannot be combined.** DummyJSON has separate endpoints (`/products/search` and `/products/category/:slug`), and neither accepts the other's filter. I made them mutually exclusive: typing a search clears the category, and picking a category clears the search. A line under the filters tells the user this.

Why: the other option is to fetch every search result and filter by category in the browser. That breaks the rule of loading data page by page from the API, and it would make "Showing X of Y" come from a different place than every other view. Keeping them exclusive means every list view is real server-side pagination. If a URL has both (for example, a hand-edited link), search wins.

**Add, edit and delete are kept locally.** The API answers these requests but does not save anything. Every change still calls the real API (so Axios, the token and error handling are exercised), and the result is saved in a small localStorage overlay ([localChanges.ts](src/lib/products/localChanges.ts)). [productService.ts](src/lib/products/productService.ts) merges it with the API data:

- **Added products** get a local id (10000 and up, because the API always returns id 195). They appear at the top of the list, count towards the total, and are matched against search and category. Because they don't come from the API, they are not re-sorted with the API items.
- **Edits** to API products are saved as a patch and applied whenever that product shows up (list or details). Editing a product added locally does not call `PUT`, because the API would return 404 for an id it has never seen.
- **Deleted products** are hidden everywhere, and their details page shows "not found".

The overlay survives a refresh. The UI never knows about it, because components only call the service.

**Small pieces.** Raw endpoints are in `lib/api`, merging logic is in `lib/products`, state logic is in hooks, and components mostly render. The table and the cards share `ProductActions`, `ProductImage` and `StockBadge`.

**Double-submit guard.** [useSingleFlight.ts](src/hooks/useSingleFlight.ts) blocks with a `ref`, not just state. A `ref` updates immediately, so a second click that lands before React re-renders and disables the button is still ignored. After a successful save or login, the button stays disabled while the page navigates away.

**Auth.** The token is stored in a cookie so the Next.js middleware can redirect before a protected page renders. The Axios request interceptor reads it and adds `Authorization: Bearer …`. The response interceptor turns every failure into one `ApiError` with a readable message, and on a 401 it clears the session and sends the user to login.

## One problem I faced and how I fixed it

**Deleting a product broke pagination.** At first I hid deleted products by filtering them out of the page the API returned. After deleting one item, page 1 showed 9 products instead of 10. The total and "Showing…" text were also wrong, and item positions shifted between pages. My browser test caught this ("Showing 1–9 of 194").

The root cause is that the API's `skip` counts positions in its own list, which still contains the deleted products. Asking for a few extra items doesn't fix it, because I don't know how many deleted products come before the current page.

The fix: when there are deletions, the service first asks the API for only the ids of all matching products (`select=id`, a small response). Removing the deleted ids from that list gives the real positions and an exact total. It then loads the full products for exactly that stretch. With no deletions, it still uses a single request. After the fix, pages stay full and the "Showing 1–10 of 194" text is correct.

## Where AI helped me

- Scaffolding the folder structure and the first version of repetitive UI (table, cards, form fields, Tailwind classes).
- Talking through edge cases: the `useSingleFlight` ref guard, the search input sync (ignoring its own URL change so it never overwrites what the user is typing), and `limit=0` meaning "all items" in DummyJSON.
- Writing a browser test script that ran every requirement from the brief, which is how I found the delete/pagination bug above.

I reviewed and understand every file. The design decisions above (exclusive search/category, the local overlay, the URL as the source of truth) are mine, and I can explain or change any part of them.
