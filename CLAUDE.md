# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (uses Turbopack)
npm run build    # Production build
npm run lint     # Run ESLint
```

```bash
npm test         # Run all Jest unit tests
npm run test:watch  # Jest in watch mode
npm run test:e2e    # Playwright E2E tests (requires dev server)
```

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

**Schedule filtering logic:** `EventList.tsx` compares `event.event_date` (a `YYYY-MM-DD` string) against today's date obtained via `toLocaleDateString("en-CA", { timeZone: "America/New_York" })`. `FILTER_CATEGORIES` drives all sidebar filters: event type (`"tournament"` / `"open_gym"`), gender, surface, team size, and skill level (array column — an event matches if any of its `skill_levels` values are in the selected set; events with null/empty `skill_levels` are hidden when a skill filter is active). All matching events render — no pagination.

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

## New page checklist

Every new public page must include all four of the following:

**1. Metadata** — set in the same file as the page component.

- Static page: `export const metadata: Metadata = { title: "Page Name", description: "..." }`
- Dynamic route (fetches by ID): `export async function generateMetadata({ params })` — query only the fields needed for title/description, then return `{}` if the record is missing.
- Always set `title` (short name only — the root layout appends `" | Outta Control Volleyball"` via the `"%s | Outta Control Volleyball"` template) and `description`.
- Add `openGraph: { title, description }` for pages worth sharing on social media.
- `metadataBase` is already set to `https://oc-volleyball.com` in `app/layout.tsx`, so OG image `url` values can be relative paths (e.g. `"/images/logo/oc_logo.png"`).

**2. Loading state** — create `loading.tsx` in the same folder as the page.

- Render the same `<PageHero>` with the same static image so the hero appears instantly.
- Replace all data-driven content with `bg-gray-200 animate-pulse` skeleton blocks sized to match the real content.
- See `app/loading.tsx`, `app/schedule/loading.tsx`, and `app/schedule/[id]/loading.tsx` for examples.

**3. Hero** — use `<PageHero>` as documented above. Every public page has one.

**4. notFound()** — any dynamic route that fetches a record by ID must call `notFound()` from `next/navigation` when the query returns nothing. Also export a `generateMetadata` that returns `{}` for the same missing-record case.

## Testing

Follow this workflow for **every** change to a `.ts` or `.tsx` source file — no exceptions for "small" changes. Tests are not required for non-code edits (config files, CSS, JSON, markdown).

### Step 1 — Write tests first

Before writing any implementation code, write the full test suite in `__tests__/<filename>.test.ts(x)` adjacent to the source file. Use existing tests in `app/schedule/__tests__/` and `lib/__tests__/` as style references.

Tests must be strict and adversarial — written as if you are trying to break your own implementation:
- **Happy paths** — correct inputs, expected outputs
- **Edge cases** — empty arrays, zero values, single-element inputs, very large inputs
- **Invalid inputs** — wrong types, null, undefined, out-of-range values
- **Boundary conditions** — off-by-one, min/max limits, exact threshold values
- **Failure modes** — what should throw, what should return a fallback, what should be rejected

Do not write tests that are trivially easy to pass. Write tests that would catch real bugs.

### Step 2 — Implement the code

Write the implementation after the tests exist. The PostToolUse hook runs `npm test` automatically after every edit — watch the spinner for results.

### Step 3 — Fix loop (code only, max 5 iterations)

If tests fail:
1. Read the failure output carefully
2. Fix only the implementation — never change a test to make it pass, unless the test itself is provably wrong (e.g., wrong expected value due to a spec misread)
3. Run `npm test` again
4. Repeat until all tests pass

If tests are still failing after 5 iterations: stop and explain exactly what you are stuck on — do not continue guessing.

### Step 4 — Report

When all tests pass, report:
- How many fix-loop iterations it took
- The root cause of each failure
- Any edge cases discovered during the process that were not in the original spec
