# Product Admin Dashboard

A small admin dashboard for logging in and managing products, built on the free [DummyJSON](https://dummyjson.com) API.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Axios

- Live demo: _add Vercel link here_
- Choices, one problem I hit, and where AI helped: see [NOTES.md](./NOTES.md)

## Setup

Requirements: Node.js 18.18 or newer (built with Node 20).

```bash
npm install
npm run dev        # http://localhost:3000
```

Log in with **emilys** / **emilyspass**.

Other scripts:

```bash
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
```

No environment variables are needed.

## What is finished

**Features**

-  Login page (`POST /auth/login`) with error messages for wrong details or empty fields
-  Product pages are protected by middleware (server-side redirect) and a client-side guard
- Log out button in the header. An expired token (401) logs you out automatically
- Product list with image, title, category, price, rating and stock. Table on desktop, cards on mobile
-  Server-side pagination with `limit` and `skip`: page numbers with ellipsis, Previous/Next, page size 10/20/50, and "Showing 21–40 of 194"
- Debounced search (400 ms) with `/products/search?q=`. Changing the search goes back to page 1
-  Category filter (`/products/categories`) and sort by price, rating or title (asc/desc)
-  Details page at `/products/[id]` with an image gallery, description, price, stock and reviews
- "Product not found" page for bad ids (`/products/abc`, `/products/99999`, deleted products)
- Add and edit form with validation, and a confirm popup before deleting
- Loader while loading, a message when nothing is found, and a Retry button on errors

**Rules**

-  One shared Axios instance ([src/lib/api/client.ts](src/lib/api/client.ts)) adds the token to every request and handles errors in one place
-  Page, page size, search, category and sort live in the URL, so refreshing or sharing a link shows the same result
- No React Query, SWR, or table/pagination libraries
-  API calls live in `src/lib/api/*`. UI components never import Axios

**Things to handle carefully**

-  Fast typing never shows old results: the previous request is aborted, and each response is checked against the latest request id. Try `/products?delay=2000` (the `delay` URL param is passed through to the API)
- Search and category together: they cancel each other out (see NOTES.md)
- Add, edit and delete are kept in the app with a local overlay (see NOTES.md)
-  Bad URL values (`?page=abc`, `?limit=7`, `?sortBy=x`) fall back to defaults and the URL is cleaned. `?page=999` jumps to the last page
- Clicking Login or Save many times sends only one request (ref-based guard plus a disabled button)

## Project structure

```
src/
  middleware.ts               route protection (token cookie)
  app/                        routes: /login, /products, /products/new, /products/[id], /products/[id]/edit
  components/
    ui/                       Button, Spinner, TextField, ConfirmDialog, Empty/Error states
    auth/                     AuthProvider (guard and logout), LoginForm
    layout/                   AppHeader
    products/                 list view, table, cards, filters, search, pagination, form, details…
  hooks/                      useProductQuery (URL state), useProducts (race-safe fetch),
                              useDebouncedValue, useSingleFlight, useProduct, useCategories, useDeleteProduct
  lib/
    api/                      client.ts (Axios), auth.ts, products.ts: raw endpoints only
    auth/session.ts           token cookie and user in localStorage
    products/                 productService (API plus local changes), localChanges,
                              queryParams (URL parsing), pagination, validation
  types/                      shared TypeScript types
```

## How I tested it

I checked every item above in a real browser with a scripted run: login errors and the double-click guard, pagination text, bad URL values, the search race with `delay=2000`, debounce (one request per burst of typing), category/search exclusivity, sort, empty state, not-found ids, add/edit/delete (including after a refresh), the mobile card layout, and logout.
