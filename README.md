# TCN Real Estate Platform

A full-stack real estate web application with a multilingual public portal and a role-gated admin control panel for managing listings, media, and inventory.

**Live demo:** https://tcn-service.vercel.app

> I built this with a business partner for a real estate venture we're working on together. This is the first version — we put it online to see how the whole flow works end to end, and it's still in progress. Admin panel credentials are available on request.

---

## Overview

TCN Real Estate is a property listing and investment platform aimed at high-end buyers and investors. The application is split into two distinct surfaces sharing one codebase and one Supabase backend:

- **Public Portal** — a marketing and discovery site for browsing, searching, and filtering property listings across multiple languages.
- **Admin Panel** — a private, authenticated dashboard for managing the entire property inventory: listings, media, technical documents, and publication status.

The goal was to build something close to what a boutique real estate agency would actually need to run digital operations, not just a listings template.

## Key Features

### Public Portal

- Multi-language site (English, French, Arabic, Spanish) via `next-intl`, including full RTL support for Arabic
- Property search with filters by city, property type, purpose (buy/rent), and off-plan status
- Interactive coordinate maps (React-Leaflet) showing property locations, with multiple tile layer sources
- Featured property highlighting on the homepage
- Fully responsive layouts built with Tailwind CSS and Headless UI

### Admin Panel

- Authenticated, role-gated access (only users with an `admin` role can reach `/admin`; everyone else is redirected)
- Full CRUD for property listings
- **Media vault** — separate upload pipelines for marketing images and PDF technical records (floor plans, legal docs, spec sheets) per property
- Status management (available / sold / off-plan / draft) and one-click "featured" toggles
- Built on Supabase Row Level Security, so authorization is enforced at the database layer, not just in the UI

![Admin dashboard — inventory overview and published market value](docs/screenshots/admin-dashboard.png)

Property inventory with status filters, type filter, and featured toggles:

![Property inventory table](docs/screenshots/admin-inventory.png)

Listings are authored in all four languages from a single form — headline and description per locale, with the Arabic fields rendering RTL:

![Multilingual listing editor](docs/screenshots/admin-edit-multilingual.png)

Location is set either by pasting a Google Maps URL — coordinates are parsed out of it — or by pinning directly on the map:

![Location editor with map pin](docs/screenshots/admin-location.png)

Media vault — cover image, gallery, and PDF technical records per property:

![Media vault](docs/screenshots/admin-media-vault.png)

## Architecture Highlights

This is the part I'd point to first if you're technical.

**Custom middleware (`src/proxy.js`)** handles three concerns in a single request pipeline, in this order:

1. **Fast-path bypass** for Next.js internal assets, static files, and image optimization requests — this fixed a "provisional headers" hang I ran into where Next.js 16's own asset requests were getting caught in downstream logic.
2. **Auth guarding** for `/admin` and `/login` using Supabase's SSR client — reading and refreshing session cookies server-side, redirecting unauthenticated users away from `/admin` and non-admin roles away entirely, and bouncing already-authenticated users off `/login`.
3. **i18n routing** (`next-intl` middleware) for every other request, with a strict Content-Security-Policy header applied afterward, scoped to allow only the specific external origins the app actually needs (Supabase, OpenStreetMap/ArcGIS tile servers, unpkg for Leaflet assets).

**Security model:**

- Row Level Security (RLS) policies in Postgres as the actual authorization boundary
- Role-based access via Supabase `app_metadata`, checked server-side before any admin route renders. `app_metadata` is only writable with the service key — unlike `user_metadata`, which the account holder can modify from the client
- A locked-down CSP rather than a permissive default, with each allowed source justified by a real dependency (map tiles, Supabase storage, etc.)

## Security Fix — July 2026

The first version read the admin role from `user_metadata`, in both the middleware and the RLS policies on `listings` and `profiles`.

`user_metadata` is writable by the account holder — any authenticated user can call `updateUser({ data: { role: 'admin' } })` from the browser. So a registered user could have assigned themselves the admin role. And because the RLS policies read the same value, the database layer wouldn't have stopped them either: the middleware redirect and the policies were both keyed on a field the user controlled.

Supabase's security advisor flagged it as critical. The fix:

- Moved the role to `app_metadata`, which only the service key can write
- Rewrote the `Admins can manage listings` and `Profiles are viewable by owner or staff` policies to read from `app_metadata`
- Updated the middleware check to match

Signups were disabled and the project had a single user, so this was never exploitable in practice — but the authorization boundary was in the wrong place, and the point of putting it in the database is that it holds when everything above it fails.

## Tech Stack

| Layer                | Technology                                              |
| -------------------- | ------------------------------------------------------- |
| Framework            | Next.js 16 (App Router), React 19                       |
| Styling              | Tailwind CSS, Headless UI, Heroicons                    |
| Database & Auth      | Supabase (PostgreSQL, SSR bindings, Row Level Security) |
| Internationalization | next-intl (en / fr / ar / es, incl. RTL)                |
| Maps                 | Leaflet, React-Leaflet                                  |
| Hosting              | Vercel                                                  |

## Project Structure

```
src/
├── app/
│   ├── (admin)/    # Admin dashboard routes — protected by proxy.js
│   ├── (auth)/     # Login / auth routes
│   ├── (public)/   # Public portal routes (listings, search, contact, etc.)
│   ├── globals.css
│   └── icon.svg
├── components/
│   ├── admin/      # Admin dashboard UI (CRUD forms, media vault, tables)
│   ├── providers/  # React context providers
│   ├── public/     # Public-facing UI (listing cards, map, search bar)
│   └── ui/         # Shared/base UI components
├── i18n/
│   ├── request.js  # next-intl request config
│   └── routing.js  # Locale routing config (en / fr / ar / es)
├── lib/
│   └── schema/     # Validation schemas for listings, forms, etc.
├── messages/       # Translation strings — ar.json, en.json, es.json, fr.json
├── utils/
│   └── supabase/   # Supabase client setup (server + browser)
└── proxy.js        # Custom middleware: auth guard, CSP, i18n routing
```

## Access

The public portal is live and fully browsable at the link above.

The admin panel is at `/login` and is restricted. Get in touch and I'll send demo credentials — full read/write, so you can create, edit and delete listings and try the media vault. The listings behind it are seeded test data, not real inventory.
