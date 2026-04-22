# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (uses Turbopack)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite exists yet.

## Architecture

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Supabase (Postgres + Auth + Storage).

**Supabase clients:** Two clients exist — use the right one for the context:
- **Browser (client components):** `lib/supabase.js` — singleton `createBrowserClient`, used in all `"use client"` admin pages.
- **Server (server components):** `lib/supabase-server.ts` — exports `createClient()`, a per-request factory using `createServerClient` + `next/headers` cookies. Used in `app/schedule/page.tsx`. Call this in any new server components that need Supabase.

**Auth guard:** `proxy.ts` at the project root is the Next.js 16 proxy (Next.js 16 replaced `middleware.ts` with `proxy.ts`). It protects all `/admin/*` routes, redirecting unauthenticated users to `/admin/login`.

**Data model — `events` table:**

| column              | type         | notes                                                  |
| ------------------- | ------------ | ------------------------------------------------------ |
| `id`                | int          | PK                                                     |
| `name`              | text         |                                                        |
| `type`              | text         | `"tournament"` or `"open gym"` (lowercase)             |
| `date`              | text         | ISO date `YYYY-MM-DD`                                  |
| `time`              | text         | `HH:MM`                                                |
| `address`           | text         |                                                        |
| `description`       | text         |                                                        |
| `rules`             | text \| null |                                                        |
| `cost`              | float        |                                                        |
| `cost_unit`         | text         | `"per person"`, `"per team"`, or `"free"`              |
| `registration_link` | text \| null |                                                        |
| `image_url`         | text \| null | Public URL from Supabase Storage bucket `event_images` |

**Public pages** (`/`, `/schedule`) are fully styled with Tailwind

**Admin pages** (`/admin`, `/admin/login`, `/admin/events/new`, `/admin/events/[id]/edit`) are completely unstyled bare HTML — intentional, still a work in progress.

**Schedule filtering logic:** `EventList.tsx` compares `event.date` (a `YYYY-MM-DD` string) against today's date obtained via `toLocaleDateString("en-CA", { timeZone: "America/New_York" })`. The `type` filter maps display labels → DB values via `FILTER_TO_DB_TYPE` (`"Tournaments"` → `"tournament"`, `"Open Gyms"` → `"open gym"`). Pagination (`PAGE_SIZE = 10`) is implemented in state but no prev/next UI buttons exist yet.

**Image uploads:** stored in the `event_images` Supabase Storage bucket. The path is `${Date.now()}-${filename}`. On edit, the old image is deleted before uploading the replacement. Remote image hostname `fqoblokrlkqbnxikjfli.supabase.co` is allowlisted in `next.config.ts`.
