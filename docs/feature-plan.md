# Quick Links Feature Plan

This document lists feature ideas for the Quick Links app and the steps needed to implement each one. It is a broad backlog, not a prioritized roadmap. Each feature includes the core technical steps across schema, Convex functions, UI, and testing.

## Feature 01: Real authentication (magic link or OAuth)

- Define the auth method (magic link, Google, GitHub) and user session rules.
- Add provider fields to `convex/schema.ts` (provider, providerId, verifiedEmail, lastLoginAt).
- Create Convex mutations/queries in `convex/users.ts` to handle login, logout, and session refresh.
- Replace localStorage-only auth in `src/components/auth/AuthProvider.tsx` with provider SDK and session storage.
- Add UI flows in `src/components/auth/SignIn.tsx` for provider buttons and error states.
- Add route protection utilities and show loading states on `src/routes/index.tsx` and `src/routes/login.tsx`.
- Add tests for auth flows (mock provider) and basic session persistence.
- Document new environment variables in `README.md`.

## Feature 02: User profile and settings

- Define profile fields (displayName, avatarUrl, defaultView, timezone).
- Update `convex/schema.ts` and add an index by userId.
- Add `convex/users.ts` mutations for update profile and query current profile.
- Add a settings route (e.g. `src/routes/settings.tsx`) with form UI components.
- Add avatar upload (store URL, or integrate file storage later).
- Update `src/components/auth/AuthProvider.tsx` to include profile info in the context.
- Add form validation and UI feedback with toasts.
- Add tests for profile updates and empty state.

## Feature 03: Category ordering, pinning, and appearance

- Decide on ordering fields (sortIndex, pinned, color, icon).
- Add fields and indexes in `convex/schema.ts` and update `convex/bookmarks.ts` list query to order.
- Add mutations for reordering, pin/unpin, and appearance updates.
- Add UI controls in `src/components/ui/CategoryPreferences.tsx` and drag-and-drop in `src/components/ui/BookmarkCategories.tsx`.
- Store user preferences and persist after drag end.
- Update `src/types.ts` to include new fields.
- Add tests for ordering and pinned sorting.

## Feature 04: Link metadata and rich previews

- Define metadata fields (title, description, imageUrl, faviconUrl, siteName).
- Add fields to `convex/schema.ts` and a background job or mutation to fetch metadata.
- Add a server-side fetcher (Convex action) to request OpenGraph and favicon.
- Update `convex/links.ts` create mutation to queue metadata fetch.
- Update `src/components/ui/LinksList.tsx` to display preview cards.
- Add loading/error UI when metadata is missing or fetch fails.
- Add tests for metadata parsing and fallback display.

## Feature 05: Tags, search, and filters

- Add a tags table or tags array on links in `convex/schema.ts` with index.
- Add mutations to add/remove tags and queries for tag search.
- Add a global search query that matches URL, title, and tags.
- Add UI in `src/components/ui` for tag input and a search bar.
- Add filter controls (by tag, category, or date) in `src/routes/index.tsx`.
- Add empty state and no-results states.
- Add tests for search filtering and tag CRUD.

## Feature 06: Bulk actions

- Add selection state to `src/components/ui/LinksList.tsx` (multi-select).
- Add bulk actions UI (move, delete, add tags, change category).
- Add Convex mutations for bulk operations with ownership checks.
- Add confirmation dialogs and undo toast when possible.
- Add keyboard shortcuts for selection and bulk operations.
- Add tests for bulk delete/move behavior.

## Feature 07: Sorting and view modes

- Add fields for link order (sortIndex) and lastVisited.
- Add UI for sorting (recent, alphabetical, custom) and view mode (grid/compact).
- Add mutations for updating custom order and sorting preferences.
- Update list queries to accept sorting parameters.
- Persist preferences in user settings.
- Add tests for sorting logic and preference persistence.

## Feature 08: Duplicate detection and cleanup

- Add a normalizedUrl field in `convex/schema.ts` with index.
- Add logic in `convex/links.ts` to normalize URL on create.
- Add a query to find duplicates per user and category.
- Add a cleanup UI with "merge" and "delete duplicates" actions.
- Add tests for URL normalization and duplicate detection.

## Feature 09: Import and export

- Add import parser for HTML bookmarks and CSV (client-side parsing).
- Add a preview step in UI to map categories and links before saving.
- Add batch import mutation to insert categories and links efficiently.
- Add export endpoint to generate HTML and CSV from Convex data.
- Add UI in settings to upload/download and show progress.
- Add tests for parsing and import edge cases.

## Feature 10: Sharing and public collections

- Add share settings fields (isPublic, shareSlug, shareTitle).
- Add a public query in `convex/bookmarks.ts` with access checks.
- Add a public route (e.g. `src/routes/share/$slug.tsx`) with read-only view.
- Add UI to generate and revoke share links in category preferences.
- Add caching headers for public pages.
- Add tests for access rules and invalid share links.

## Feature 11: Team workspaces and collaboration

- Add workspaces table and membership relation in `convex/schema.ts`.
- Add permission roles (owner, editor, viewer) and access checks.
- Update bookmark/category/link schemas to include workspaceId.
- Update queries/mutations to filter by workspace and user role.
- Add workspace switcher UI and invite flow (email invite).
- Add tests for permission boundaries.

## Feature 12: Read later and reminders

- Add fields for readLater, reminderAt, and reminderStatus.
- Add mutation to schedule reminders and query upcoming reminders.
- Add UI toggle on links for read later and reminder picker.
- Add a reminders view route and filters.
- Add notification integration (in-app, email if supported).
- Add tests for scheduling and reminder states.

## Feature 13: Broken link monitoring and archive

- Add a job to check link status codes periodically.
- Add fields (lastCheckedAt, lastStatus, isBroken).
- Add UI badges for broken links and bulk archive action.
- Add archive mutation and archived filter.
- Add tests for status parsing and archive flow.

## Feature 14: Offline mode and PWA

- Add a service worker and cache strategy for routes and assets.
- Add local storage cache for bookmarks and sync on reconnect.
- Add UI banner for offline/online status (extend `useOnlineStatus`).
- Add conflict resolution rules for offline edits.
- Add tests for offline cache and sync behavior.

## Feature 15: Quick capture tools (bookmarklet and extension)

- Add a simple bookmarklet that posts URL to the app with auth.
- Create a minimal browser extension to capture current tab URL.
- Add an API endpoint or special route to accept captured URLs.
- Add UI for tagging and category selection on capture.
- Add docs in `README.md` with setup instructions.

## Feature 16: Mobile share sheet integration

- Add a PWA manifest and register share target.
- Add a route to accept shared URLs and prefill QuickLinksInput.
- Add UI for fast category selection and save confirmation.
- Add tests for share target parsing.

## Feature 17: Activity feed and notifications

- Add an activity table to log events (create, delete, update).
- Add a query for recent activity by user or workspace.
- Add a notifications UI drawer with unread state.
- Add mutation to mark notifications as read.
- Add tests for activity ordering and read state.

## Feature 18: Click analytics and insights

- Add a linkClicks table with timestamp and linkId.
- Add a mutation to record clicks (client sends click events).
- Add a dashboard view with charts (top links, trends).
- Add filters for date range and category.
- Add tests for aggregation queries.

## Feature 19: Backups and restore

- Add an export schedule or manual backup option.
- Add a restore flow that validates data and previews changes.
- Add server-side validation for import payloads.
- Add tests for backup and restore edge cases.

## Feature 20: Accessibility and keyboard-first flows

- Add keyboard shortcuts for create, search, and navigation.
- Ensure all menus/dialogs are focus-trapped and labeled.
- Add skip links and improved focus styles in `src/styles.css`.
- Add tests for keyboard navigation on key UI paths.
