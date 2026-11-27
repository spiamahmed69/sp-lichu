# SP Lichu — তাজা লিচুর অনলাইন দোকান

React 19 + Vite + Tailwind v4, Bengali-first, BDT prices. Design direction from
lichu.borbila.net (red #DF2D4D / white commerce template) — layout and style
only; all text, logo and images are our own. Product photos are Wikimedia
Commons litchi photos (public).

## Routes
`/` home · `/shop` · `/category/:slug` (6 varieties) · `/product/:slug` ·
`/track-order` · `/my-account` · `/about` · `/checkout` · `/admin`

## Demo data (localStorage only — no backend yet)
- Cart + orders + demo accounts live in the browser's localStorage.
- Order placement generates an order ID (`SP-XXXXXX`); Track Order looks it up
  by order ID + phone.
- Demo admin: `admin@splichu.com` / `admin123` — **change before live use**.
- Admin panel: dashboard (products / orders / revenue), product CRUD
  (overrides seed data in localStorage), order status management, settings
  (shop name, delivery charge, bKash/Nagad/WhatsApp numbers — empty by
  default, no real numbers invented).

## Firebase later
`src/lib/store.jsx` keeps products / orders / settings as plain collections,
so Firebase can replace the localStorage layer without redesigning the
panel or the shop.

## Build
```bash
npm install
npm run build   # client build + SSR bundle + prerender + sitemap
npm run preview
```

Prerender: all public routes (home, shop, 6 categories, 24 products,
track-order, about, checkout = 35 routes) get static HTML. `/my-account`
and `/admin` are login-gated app pages and are intentionally not prerendered.
