# Supabase -> Convex migration (deep analysis + plan)

## Goal

Replace Supabase auth, data storage, and realtime with Convex while keeping the same product behavior.

## Current Supabase usage (from repo)

### Auth

- Magic link OTP: `supabase.auth.signInWithOtp` in `src/components/auth/signIn.tsx`
- Session stored in context in `src/components/auth/userAuth.tsx`
- Logout: `supabase.auth.signOut()`

### Data access

- Categories (called "bookmarks" in DB) are fetched with nested links:
  - `supabase.from('bookmarks').select('category_id, title, links (...)')`
- Add category: `supabase.from('bookmarks').insert({ title, user_id })`
- Update category: `supabase.from('bookmarks').update({ title }).match({ category_id })`
- Delete category: `supabase.from('bookmarks').delete().match({ category_id })`
- Add link: `supabase.from('links').insert({ url, category_id, user_id })`
- Delete link: `supabase.from('links').delete().eq('id', linkId)`

### Realtime

- Subscriptions on `bookmarks` and `links` channels to sync list UI.

### Inferred schema (based on usage)

`bookmarks` table (category):

- `category_id` (number)
- `title` (string)
- `user_id` (string)

`links` table:

- `id` (string/uuid)
- `url` (string)
- `category_id` (number)
- `user_id` (string)

## Convex data model proposal

Convex uses document IDs (`_id`) rather than numeric IDs. To minimize UI changes, either:

- Option A: Keep `categoryId` in docs to mirror `category_id`, or
- Option B: Use Convex `_id` everywhere and update UI code accordingly.

Recommended structure:

### Table: `bookmarks`

- `title: string`
- `userId: string`
- `createdAt: number`

### Table: `links`

- `url: string`
- `categoryId: Id<"bookmarks">`
- `userId: string`
- `createdAt: number`

Indexes:

- `bookmarks` by `userId`
- `links` by `categoryId`
- `links` by `userId` (optional)

## Convex auth plan

Supabase provides magic link OTP. Convex supports auth via providers.

Options:

1. Convex Auth (email link) if available in your project version.
2. Auth.js (formerly NextAuth) with an Email provider (e.g., Resend, Postmark).

Implementation outline:

- Configure provider credentials in `.env` (server only).
- Expose Convex auth hooks in client via `convex/react`.
- Replace `StoreProvider` with Convex `useAuth` or `useSession`.
- Update `/login` to request email sign-in and handle post-redirect.

## Convex queries and mutations (API surface to build)

### Queries

- `bookmarks.listByUser`
  - Input: none (uses auth)
  - Output: categories with nested links (aggregate)

### Mutations

- `bookmarks.create`
  - Input: `{ title: string }`
- `bookmarks.updateTitle`
  - Input: `{ categoryId: Id<"bookmarks">, title: string }`
- `bookmarks.delete`
  - Input: `{ categoryId: Id<"bookmarks"> }`
  - Behavior: delete linked `links` too
- `links.create`
  - Input: `{ categoryId: Id<"bookmarks">, url: string }`
- `links.delete`
  - Input: `{ linkId: Id<"links"> }`

Notes:

- Use `ctx.auth.getUserIdentity()` to enforce user scoping.
- Always filter by `userId` to avoid cross-user data access.

## Data migration plan (Supabase -> Convex)

Because Convex uses `_id` values, data will need a mapping step.

1. Export Supabase data:
   - Use SQL `COPY` to CSV for `bookmarks` and `links`.
2. Create a migration script:
   - Insert categories into Convex `bookmarks` and store a map of `category_id -> _id`.
   - Insert links referencing the new Convex `categoryId`.
   - Optionally store `legacyCategoryId` or `legacyLinkId` for traceability.
3. Run the migration in a Convex import script.

## UI layer updates (what changes in code)

Replace each Supabase call:

- `supabase.auth.*` -> Convex auth hooks
- `.from('bookmarks').select(...)` -> `useQuery(api.bookmarks.listByUser)`
- `.insert(...)` -> `useMutation(api.bookmarks.create)` / `api.links.create`
- `.update(...)` -> `useMutation(api.bookmarks.updateTitle)`
- `.delete(...)` -> `useMutation(api.bookmarks.delete)` / `api.links.delete`
- Realtime subscriptions are no longer manual; `useQuery` updates UI.

## Edge cases to preserve

- URL validation and auto-prefixing before inserts.
- Prevent editing links list when no links exist.
- Keep delete confirmation modal for categories.
- Keep optimistic UI behavior minimal (Convex is realtime).

## Security checklist

- All mutations must validate the authenticated user.
- Queries should only return the caller's data.
- Deleting a category should delete its links.

## Deliverable checklist

- Email login works without Supabase.
- Categories and links CRUD works on Convex.
- Realtime updates happen automatically.
- No direct client exposure of server-only secrets.
