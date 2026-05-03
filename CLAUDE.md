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

- **Browser (client components):** `lib/supabase-browser.ts` — singleton `createBrowserClient`, used in all `"use client"` admin pages.
- **Server (server components):** `lib/supabase-server.ts` — exports `createClient()`, a per-request factory using `createServerClient` + `next/headers` cookies. Used in `app/schedule/page.tsx`. Call this in any new server components that need Supabase.

**Auth guard:** `proxy.ts` at the project root is the Next.js 16 proxy (Next.js 16 replaced `middleware.ts` with `proxy.ts`). It protects all `/admin/*` routes, redirecting unauthenticated users to `/admin/login`.

**Data model — `events` table:**

| column              | type         | notes                                                              |
| ------------------- | ------------ | ------------------------------------------------------------------ |
| `id`                | bigint       | PK, auto-generated                                                 |
| `title`             | text         |                                                                    |
| `description`       | text         |                                                                    |
| `event_type`        | text         | `"tournament"` or `"open_gym"`; CHECK constraint enforced          |
| `gender`            | text         | `"mens"`, `"womens"`, or `"coed"`; CHECK constraint enforced       |
| `surface`           | text         | `"indoor"`, `"grass"`, or `"beach"`; CHECK constraint enforced     |
| `team_size`         | text         | `"6v6"`, `"4v4"`, `"3v3"`, or `"2v2"`; CHECK constraint enforced  |
| `skill_levels`      | text[] \| null | subset of `["aa","bb","a","b","open"]`; CHECK constraint enforced |
| `event_date`        | date         | Postgres `date` type; JS receives as `YYYY-MM-DD` string           |
| `start_time`        | time         | Postgres `time` type; JS receives as `HH:MM:SS` string            |
| `end_time`          | time \| null | must be after `start_time` when set; CHECK constraint enforced     |
| `address`           | text \| null |                                                                    |
| `cost`              | numeric      | `>= 0` enforced; use `cost === 0` to display as free               |
| `cost_type`         | text         | `"team"` or `"individual"`; CHECK constraint enforced              |
| `capacity`          | int \| null  | `null` = unlimited; `> 0` enforced when set                        |
| `registration_link` | text \| null | must start with `http://` or `https://`; CHECK constraint enforced |
| `image_url`         | text \| null | Public URL from Supabase Storage bucket `event_images`             |
| `is_active`         | boolean      | default `true`; RLS exposes only active events to public           |
| `created_at`        | timestamptz  | set by DB default                                                  |
| `updated_at`        | timestamptz  | auto-updated by trigger on every UPDATE                            |
| `created_by`        | uuid         | `auth.uid()` default; references `auth.users(id)`                  |

**Public pages** (`/`, `/schedule`) are fully styled with Tailwind

**Admin pages** (`/admin`, `/admin/login`, `/admin/events/new`, `/admin/events/[id]/edit`) are completely unstyled bare HTML — intentional, still a work in progress.

**Schedule filtering logic:** `EventList.tsx` compares `event.event_date` (a `YYYY-MM-DD` string) against today's date obtained via `toLocaleDateString("en-CA", { timeZone: "America/New_York" })`. `FILTER_CATEGORIES` drives all sidebar filters: event type (`"tournament"` / `"open_gym"`), gender, surface, team size, and skill level (array column — an event matches if any of its `skill_levels` values are in the selected set; events with null/empty `skill_levels` are hidden when a skill filter is active). Pagination (`PAGE_SIZE = 10`) is implemented in state but no prev/next UI buttons exist yet.

**Image uploads:** stored in the `event_images` Supabase Storage bucket. The path is `${Date.now()}-${filename}`. On edit, the old image is deleted before uploading the replacement. Remote image hostname `fqoblokrlkqbnxikjfli.supabase.co` is allowlisted in `next.config.ts`.

**Page hero (`app/components/PageHero.tsx`):** All public pages use a shared `<PageHero>` component for the image + dimmer + title header. To add a hero to a new page:

```tsx
import PageHero from "@/app/components/PageHero";

<PageHero src='/images/<folder>/<file>.jpg' alt='...'>
  <h1 className='page-heading'>Page Title</h1>
</PageHero>;
```

- `contentPosition="top"` — title near the top-left (home page only); default is `"center"` (all other pages)
- `children` is the title markup — use `<h1 className="page-heading">` for standard pages, or a multi-line `<h1>` with `<br />` for the home page style
- Place the hero image in `public/images/<page-name>/`
