# Solid -> TanStack Start migration (deep analysis + plan)

## Goal

Migrate the current SolidJS + Vite app to TanStack Start (React), while preserving the current UX and wiring it to a new Convex backend (see `docs/migration/02-supabase-to-convex.md`).

## Current project snapshot (from repo)

### Stack

- Framework: SolidJS (Vite)
- Routing: `@solidjs/router`
- UI: `@hope-ui/solid`
- Data: Supabase (`@supabase/supabase-js`)
- State: Solid signals + context (`createSignal`, `createStore`, `createResource`)
- Effects/utility: `solid-transition-group`, `solid-use`, `@solid-primitives/keyboard`
- SEO: `@solidjs/meta`

### Routes

- `/` -> `src/components/views/Home.tsx` (authenticated view)
- `/login` -> `src/components/auth/signIn.tsx` (magic link login)
- `/*` -> `src/components/views/404.tsx`

### Data model (inferred from code)

- `bookmarks` table: category records (fields used: `category_id`, `title`, `user_id`)
- `links` table: bookmarks (fields used: `id`, `url`, `category_id`, `user_id`)
- Fetch in `src/context/BookmarkProvider.tsx`:
  - `select` on `bookmarks` with nested `links`

### Auth flow (Supabase)

- Magic link OTP in `src/components/auth/signIn.tsx`
- Session stored in context in `src/components/auth/userAuth.tsx`
- Session checked in `Home` (redirect to `/login` if missing)

### Realtime

- `BookmarkProvider` subscribes to Supabase channels for `bookmarks` and `links`
- Updates `categories` store on insert/update/delete

### UI structure

- Top header with app title + email + sign out
- Categories list with inline edit, link edit, delete modal
- Inline add category and add link
- Small fade transitions via `src/index.css`
- Uses `icon.horse` for bookmark icons

### Known issues / cleanup targets before port

- `src/hooks/useSupabaseListener.ts` has a `createEffect` and `setSession` references that are undefined (dead or broken).
- `BookmarkProvider` assigns `categoriesSubscription` twice, never sets `bookmarkSubscription`.

## What TanStack Start expects (must verify in docs before coding)

TanStack Start is a React-first, full-stack framework built around TanStack Router.

Confirm these in the current Start docs before scaffolding:

- Project scaffolding command and template options.
- File-based routing conventions (folder name and route filename patterns).
- Server data APIs (loader/action equivalents and server functions).
- Environment variable naming and server-only vs client-exposed vars.
- Adapter choices (Node, Vercel, Cloudflare, etc.) and local dev workflow.

## Solid -> React mapping (porting guide)

Use this mapping as you rewrite components:

- `createSignal` -> `useState`
- `createEffect` -> `useEffect`
- `createResource` -> `useQuery` (TanStack Query) or route `loader`
- `Show` -> `{condition ? <A /> : <B />}`
- `For` -> `{list.map(...)}` (keyed)
- `createContext` + `useContext` -> React context
- `TransitionGroup` -> `react-transition-group` or CSS-only transitions
- `@solidjs/meta` -> `@tanstack/react-head` or `react-helmet-async`

## Proposed file/route mapping (TanStack Start)

Keep the current route semantics. One possible mapping:

- `src/routes/__root.tsx` (app shell + providers)
- `src/routes/index.tsx` (Home)
- `src/routes/login.tsx` (SignIn)
- `src/routes/$404.tsx` or `src/routes/_404.tsx` (not found)

Component folder can keep the same names:

- `src/components/ui/*`
- `src/components/auth/*`
- `src/components/lib/Seo.tsx` (ported to React)

## Step-by-step migration plan (high level)

1. Scaffold a new TanStack Start project (verify CLI and template first).
2. Add core dependencies for:
   - Convex (`convex`, `convex/react`) - see `docs/migration/02-supabase-to-convex.md`
   - Tailwind + Coss UI (see `docs/migration/03-ui-tailwind-coss.md`)
3. Port routing:
   - Create `__root` route with global providers and layout.
   - Create `/`, `/login`, and 404 routes matching existing behavior.
4. Port auth:
   - Replace Supabase session context with Convex auth hooks.
   - Gate the `/` route (redirect to `/login` when unauthenticated).
5. Port data and realtime:
   - Replace `BookmarkProvider` with Convex `useQuery` hooks.
   - Replace insert/update/delete with Convex `useMutation`.
6. Port UI:
   - Replace Hope UI components with Coss UI + Tailwind.
   - Keep the structure and spacing identical (see `docs/migration/03-ui-tailwind-coss.md`).
7. Replace transitions:
   - Keep `.bookmark-item` and `.list-item` classes or implement CSS transitions in Tailwind.
8. Recreate SEO/meta:
   - Replace `Seo` with a React equivalent in the root route or per-page meta.
9. Validate parity:
   - Login + logout.
   - List, create, edit, delete categories.
   - Add/delete links.
   - Offline state banner.
   - Animations.

## Component-by-component porting notes

Use this as a checklist during the port.

### `Home` route

- Gate route when no session.
- Convert layout to Tailwind while preserving padding, sizes, and alignment.
- Wire sign-out to Convex auth.

### `BookmarkProvider` -> React data hooks

- Replace `createResource` with `useQuery` or route loader.
- Realtime updates should be automatic with Convex queries.
- Keep error boundary and loading states.

### `BookmarkCategories`, `LinksList`, `CategoryPreferences`

- Map Solid event handlers to React (`onClick`, `onChange`, `onKeyDown`).
- Keep `ESC` key behavior for editing.
- Keep modals/popovers, likely via Coss UI primitives.

### `Input`

- Preserve URL validation and auto-prefix logic.
- Replace `useCurrentlyHeldKey` with `onKeyDown` logic or a small helper.

### `SignIn`

- Replace Supabase magic link call with Convex auth email provider flow.
- Preserve success/error notifications.

### `Seo`

- Use React head manager and keep existing meta tags.

## Risk list

- TanStack Start is evolving; confirm all APIs used for routing, loaders, and server functions.
- Convex auth email magic-link flow may differ from Supabase OTP and may require a provider.
- Coss UI component APIs may not map 1:1 to Hope UI; plan for small UI adjustments.

## Deliverable checklist

- TanStack Start app boots and renders `/login` and `/`.
- Auth works with magic link or email-based flow.
- Categories and links CRUD works.
- Realtime updates are automatic without manual subscriptions.
- UI matches the current layout and spacing.
