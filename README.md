# E‑Commerce Product Listing

A responsive product listing page built to the brief: mock API, TanStack Table,
Redux, React Query caching, debounced search, throttled infinite scroll,
reusable hooks, and a consistent green theme in **pure CSS**.

## Run it

```bash
npm install
npm start dev      # http://localhost:3000
npm run build    # production build
npm run preview  # preview the build
```

> Product images come from `picsum.photos`, so an internet connection is needed
> to see them (they lazy‑load).

## What's inside

| Concern | Tool | File(s) |
| --- | --- | --- |
| Server state / caching | **React Query** | `hooks/useProducts.js` |
| Client/UI state | **Redux Toolkit** | `store/` |
| Filter + sort logic | **TanStack Table** (headless) | `features/ProductListing.jsx` |
| Search | **debounce** | `hooks/useDebounce.js` + `components/Toolbar.jsx` |
| Infinite scroll | **throttle** | `hooks/useThrottle.js`, `hooks/useInfiniteScroll.js` |
| Persistence | localStorage | `store/index.js` (favorites), `hooks/useLocalStorage.js` (theme) |
| Theming | CSS variables | `styles/variables.css` |

## Architecture in one line

React Query owns the *server* data (cached once), Redux owns the *user's* choices
(filters + favorites), and TanStack Table turns those choices into the filtered,
sorted rows that get rendered as a responsive grid — revealed a page at a time by
a throttled infinite‑scroll hook.

See **DOCUMENTATION.pdf** for the full walkthrough.
